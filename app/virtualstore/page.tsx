import VirtualStoreClient from "./VirtualStoreClient"
import { getVirtualStoreProducts } from "@/lib/shopify"

// Re-check Shopify at most every 5 minutes; product webhooks refresh it sooner.
export const revalidate = 300

export default async function VirtualStore() {
  const products = await getVirtualStoreProducts()
  return <VirtualStoreClient products={products} />
}
