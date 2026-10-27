import VirtualStore from "@/components/VirtualStore"
import { getShopifyProducts } from "@/lib/shopify"
import { toProducts } from "@/lib/virtualstore"

// Re-check Shopify at most once a minute; the product webhook at
// /api/revalidate refreshes it straight away.
export const revalidate = 60

export default async function Page() {
  const products = toProducts(await getShopifyProducts())
  return <VirtualStore products={products} />
}
