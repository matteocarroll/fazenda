import snapshot from "@/data/shopify-products.json"

/**
 * Live catalogue for the Virtual Store, read from the Shopify Admin API on the
 * server. The page revalidates every 60 seconds and the Shopify webhook at
 * /api/revalidate refreshes it immediately on product changes.
 *
 * Credentials (Vercel env vars):
 *   SHOPIFY_STORE_DOMAIN   fazenda-8692.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN    a shpat_ token from an existing custom app, or
 *   SHOPIFY_CLIENT_ID +    a Dev Dashboard app's credentials, exchanged for a
 *   SHOPIFY_CLIENT_SECRET  24-hour token with the client credentials grant.
 *
 * Without credentials, or if Shopify is unreachable during a build, the page
 * falls back to data/shopify-products.json, the last MCP export.
 */

export type ShopifyProduct = {
  handle: string
  vendor: string
  title: string
  images: string[]
}

export const SHOPIFY_TAG = "shopify-products"

const API_VERSION = "2026-10"
const SNAPSHOT_CDN = "https://cdn.shopify.com/s/files/1/0781/2762/8515/files/"

const QUERY = `query VirtualStore($after: String) {
  products(first: 50, after: $after, query: "status:active AND inventory_total:>0") {
    pageInfo { hasNextPage endCursor }
    nodes {
      handle
      vendor
      title
      media(first: 6) { nodes { ... on MediaImage { image { url } } } }
    }
  }
}`

type ProductsPage = {
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

let cachedToken: { value: string; expires: number } | null = null

async function accessToken(domain: string): Promise<string | null> {
  if (process.env.SHOPIFY_ADMIN_TOKEN) return process.env.SHOPIFY_ADMIN_TOKEN
  const id = process.env.SHOPIFY_CLIENT_ID
  const secret = process.env.SHOPIFY_CLIENT_SECRET
  if (!id || !secret) return null
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.value

  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret }),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Shopify token request failed: ${res.status}`)
  const { access_token, expires_in } = (await res.json()) as { access_token: string; expires_in: number }
  // Renew five minutes early.
  cachedToken = { value: access_token, expires: Date.now() + (expires_in - 300) * 1000 }
  return access_token
}

async function fetchLive(domain: string, token: string): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = []
  let after: string | null = null
  do {
    const res = await fetch(`https://${domain}/admin/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
      body: JSON.stringify({ query: QUERY, variables: { after } }),
      next: { revalidate: 60, tags: [SHOPIFY_TAG] },
    })
    if (!res.ok) throw new Error(`Shopify products request failed: ${res.status}`)
    const json = (await res.json()) as ProductsPage
    if (!json.data) throw new Error(`Shopify products query failed: ${JSON.stringify(json.errors)}`)
    const page = json.data.products
    for (const node of page.nodes) {
      products.push({
        handle: node.handle,
        vendor: node.vendor,
        title: node.title,
        images: node.media.nodes.flatMap((media) => (media.image ? [media.image.url] : [])),
      })
    }
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null
  } while (after)
  return products
}

function fromSnapshot(): ShopifyProduct[] {
  return snapshot.products.map((product) => ({
    ...product,
    images: product.images.map((path) => SNAPSHOT_CDN + path),
  }))
}

export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = domain ? await accessToken(domain) : null
  if (!domain || !token) return fromSnapshot()

  try {
    return await fetchLive(domain, token)
  } catch (error) {
    // A failed build shouldn't take the page down; at runtime, throwing keeps
    // the last good version cached instead of swapping in the old snapshot.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.error("Virtual Store: Shopify unavailable, using snapshot", error)
      return fromSnapshot()
    }
    throw error
  }
}
