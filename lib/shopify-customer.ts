/**
 * Shopify Admin API — customer lookup and metafield helpers.
 * Uses the same credentials as lib/shopify.ts.
 */

const API_VERSION = "2026-10"

function endpoint() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_ADMIN_TOKEN
  if (!domain || !token) return null
  return { url: `https://${domain}/admin/api/${API_VERSION}/graphql.json`, token }
}

async function gql<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  const ep = endpoint()
  if (!ep) return null
  const res = await fetch(ep.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": ep.token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  })
  if (!res.ok) return null
  const json = await res.json()
  return json.data ?? null
}

// ----- types -----

export type ShopifyCustomer = {
  id: string
  displayName: string
  email: string
  ordersCount: number
  orders: { id: string; name: string; processedAt: string; totalPrice: { amount: string; currencyCode: string }; lineItems: { title: string; quantity: number }[] }[]
}

// ----- queries -----

const CUSTOMER_BY_EMAIL = `
  query CustomerByEmail($email: String!) {
    customers(first: 1, query: $email) {
      nodes {
        id
        displayName
        email
        numberOfOrders
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          nodes {
            id
            name
            processedAt
            totalPriceSet { shopMoney { amount currencyCode } }
            lineItems(first: 5) { nodes { title quantity } }
          }
        }
      }
    }
  }
`

type CustomerQueryResult = {
  customers: {
    nodes: {
      id: string
      displayName: string
      email: string
      numberOfOrders: number
      orders: {
        nodes: {
          id: string
          name: string
          processedAt: string
          totalPriceSet: { shopMoney: { amount: string; currencyCode: string } }
          lineItems: { nodes: { title: string; quantity: number }[] }
        }[]
      }
    }[]
  }
}

export async function findCustomerByEmail(email: string): Promise<ShopifyCustomer | null> {
  const data = await gql<CustomerQueryResult>(CUSTOMER_BY_EMAIL, { email: `email:${email}` })
  const node = data?.customers?.nodes?.[0]
  if (!node) return null
  return {
    id: node.id,
    displayName: node.displayName,
    email: node.email,
    ordersCount: node.numberOfOrders,
    orders: node.orders.nodes.map((o) => ({
      id: o.id,
      name: o.name,
      processedAt: o.processedAt,
      totalPrice: o.totalPriceSet.shopMoney,
      lineItems: o.lineItems.nodes,
    })),
  }
}

// ----- collection metafield -----

const METAFIELD_NAMESPACE = "fazenda_app"
const METAFIELD_KEY = "collection"

const GET_COLLECTION_METAFIELD = `
  query GetCollection($customerId: ID!) {
    customer(id: $customerId) {
      metafield(namespace: "${METAFIELD_NAMESPACE}", key: "${METAFIELD_KEY}") {
        value
      }
    }
  }
`

const SET_COLLECTION_METAFIELD = `
  mutation SetCollection($customerId: ID!, $value: String!) {
    customerUpdate(input: {
      id: $customerId
      metafields: [{ namespace: "${METAFIELD_NAMESPACE}", key: "${METAFIELD_KEY}", value: $value, type: "json" }]
    }) {
      userErrors { field message }
    }
  }
`

type MetafieldResult = { customer: { metafield: { value: string } | null } }
type MutationResult = { customerUpdate: { userErrors: { field: string; message: string }[] } }

export async function getCustomerCollection(customerId: string): Promise<unknown[]> {
  const data = await gql<MetafieldResult>(GET_COLLECTION_METAFIELD, { customerId })
  try {
    return JSON.parse(data?.customer?.metafield?.value ?? "[]")
  } catch {
    return []
  }
}

export async function setCustomerCollection(customerId: string, collection: unknown[]): Promise<void> {
  await gql<MutationResult>(SET_COLLECTION_METAFIELD, {
    customerId,
    value: JSON.stringify(collection),
  })
}
