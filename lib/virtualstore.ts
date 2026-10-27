import snapshot from "@/data/shopify-products.json"
import localPhotos from "@/data/local-photos.json"
import { BRANDS } from "@/lib/brands"

/**
 * The Virtual Store reads the Shopify catalogue: every active product with
 * inventory above zero. lib/shopify.ts fetches it live (cached, refreshed by
 * the Shopify product webhooks hitting /api/revalidate). If that isn't
 * configured or fails, the page falls back to the committed snapshot in
 * data/shopify-products.json.
 *
 * Shopify's photos come first, so the lead image is whatever is first in
 * Shopify admin. data/local-photos.json maps handles to our own shoots in
 * public/virtualstore-products; those are only used when Shopify has none.
 */

const LOCAL_PHOTOS: Record<string, string[]> = localPhotos

const CDN = "https://cdn.shopify.com/s/files/1/0781/2762/8515/files/"

export const CATEGORIES = [
  "Outerwear",
  "Shirts",
  "Knitwear",
  "Tops",
  "Trousers",
  "Accessories",
  "More",
] as const

export type Category = (typeof CATEGORIES)[number]

export type Product = {
  id: string
  brand: string
  name: string
  color: string
  style_code?: string
  category: Category
  images: string[]
}

// Shopify has no product types set, so the category comes from the title.
// Order matters: "knit tie" is an accessory, "polo shirt" is a top, and
// "overshirt" is outerwear rather than a shirt.
const RULES: [Category, RegExp][] = [
  ["Accessories", /\b(cap|belt|tie|scarf|bandana|stole)\b/i],
  ["Outerwear", /\b(jacket|coat|peacoat|blazer|giacca|veste|puffer|parka|shell|vest|capospalla|overshirt|coverall)\b/i],
  ["Tops", /\b(t-shirt|polo|sweatshirt|sweat)\b/i],
  ["Knitwear", /\b(knit\w*|sweater|cardigan|maglia|crew|crewneck|turtleneck|pullover|vareuse)\b/i],
  ["Shirts", /\b(shirt|camicia|camisa|chemise|blouse)\b/i],
  ["Trousers", /\b(trousers?|pants?|pantalon|pantaloni|panta|calca|slacks|shorts?)\b/i],
]

// Titles that don't say what the piece is.
const CATEGORY_OVERRIDES: Record<string, Category> = {
  "basica-ls-cocache-atlantic": "Knitwear",
  "basica-ls-cocache-cacao": "Knitwear",
  "silk-long-sleeve-oversized-marinho-navy": "Shirts",
  "silk-long-sleeve-oversized-verde-green": "Shirts",
  "dense-vw001-faded-indigo-963506": "Trousers",
}

function categorise(handle: string, name: string): Category {
  if (CATEGORY_OVERRIDES[handle]) return CATEGORY_OVERRIDES[handle]
  return RULES.find(([, pattern]) => pattern.test(name))?.[0] ?? "More"
}

// Most of the catalogue is typed in capitals; show it in title case.
function tidy(text: string) {
  if (text !== text.toUpperCase()) return text
  return text
    .toLowerCase()
    .replace(/(^|[\s/(-])(\p{L})/gu, (_, gap, letter) => gap + letter.toUpperCase())
    .replace(/\bSs\b/g, "SS")
}

// Match vendors to the names on the brands page ("BARENA VENEZIA" -> "Barena").
function brandName(vendor: string) {
  const lower = vendor.toLowerCase()
  const known = BRANDS.find((brand) => lower === brand.toLowerCase() || lower.startsWith(brand.toLowerCase() + " "))
  return known ?? tidy(vendor)
}

// Titles look like "Name — Colour - STYLE-CODE"; the colour and code are optional.
function parseTitle(title: string) {
  let rest = title.trim()
  let style_code: string | undefined
  const code = rest.match(/\s-\s([A-Z0-9][A-Z0-9._-]*)$/)
  if (code) {
    style_code = code[1]
    rest = rest.slice(0, code.index).trim()
  }
  const [name, color = ""] = rest.split(" — ")
  return { name: tidy(name.trim()), color: tidy(color.trim()), style_code }
}

// A product as it comes from Shopify. Images are either full CDN URLs (live)
// or paths relative to the store's CDN folder (snapshot).
export type ShopifyProduct = {
  handle: string
  vendor: string
  title: string
  images: string[]
}

export function toProducts(raw: ShopifyProduct[]): Product[] {
  return raw.map((product) => {
    const { name, color, style_code } = parseTitle(product.title)
    const shopify = product.images.map((src) => (src.startsWith("https://") ? src : CDN + src))
    const local = LOCAL_PHOTOS[product.handle] ?? []
    return {
      id: product.handle,
      brand: brandName(product.vendor),
      name,
      color,
      style_code,
      category: categorise(product.handle, name),
      images: shopify.length > 0 ? shopify : local,
    }
  })
}

export const SNAPSHOT_PRODUCTS: Product[] = toProducts(snapshot.products)
