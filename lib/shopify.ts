import { SNAPSHOT_PRODUCTS, toProducts, type Product, type ShopifyProduct } from "@/lib/virtualstore"

/**
 * Live catalogue for the Virtual Store, read from the Shopify Admin API.
 *
 * Needs two env vars in Vercel:
 *   SHOPIFY_STORE_DOMAIN  e.g. fazenda-8692.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN   Admin API token from a custom app with read_products
 *
 * Results are cached under the "shopify-products" tag. Shopify's product
 * webhooks call /api/revalidate, which clears that tag, so edits show up within
 * seconds. The page also re-checks every few minutes in case a webhook is missed.
 */

export const SHOPIFY_TAG = "shopify-products"
const API_VERSION = "2025-07"
const QUERY = "status:active AND inventory_total:>0"

const PRODUCTS_QUERY = /* GraphQL */ `
  query VirtualStore($cursor: String, $query: String!) {
    products(first: 250, after: $cursor, query: $query, sortKey: ID) {
      pageInfo { hasNextPage endCursor }
      nodes {
        handle
        vendor
        title
        media(first: 20) {
          nodes { ... on MediaImage { image { url } } }
        }
      }
    }
  }
`

type ProductsResponse = {
  data?: {
    products: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null }
      nodes: {
        handle: string
        vendor: string
        title: string
        media: { nodes: { image?: { url: string } | null }[] }
      }[]
    }
  }
  errors?: unknown
}

async function fetchLive(domain: string, token: string): Promise<ShopifyProduct[]> {
  const all: ShopifyProduct[] = []
  let cursor: string | null = null
  do {
    const res: Response = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { cursor, query: QUERY } }),
      next: { tags: [SHOPIFY_TAG], revalidate: 300 },
    })
    if (!res.ok) throw new Error(`Shopify ${res.status}`)
    const json = (await res.json()) as ProductsResponse
    if (!json.data) throw new Error(`Shopify error: ${JSON.stringify(json.errors)}`)
    const page = json.data.products
    for (const p of page.nodes) {
      all.push({
        handle: p.handle,
        vendor: p.vendor,
        title: p.title,
        images: p.media.nodes.map((m) => m.image?.url).filter((u): u is string => Boolean(u)),
      })
    }
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null
  } while (cursor)
  return all
}

export async function getVirtualStoreProducts(): Promise<Product[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_ADMIN_TOKEN
  if (!domain || !token) return SNAPSHOT_PRODUCTS
  try {
    const live = await fetchLive(domain, token)
    return live.length > 0 ? toProducts(live) : SNAPSHOT_PRODUCTS
  } catch (error) {
    console.error("[virtualstore] live Shopify fetch failed, using snapshot", error)
    return SNAPSHOT_PRODUCTS
  }
}
