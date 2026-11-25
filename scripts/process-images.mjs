/**
 * Photoroom image processor for Fazenda product images.
 *
 * For each active Shopify product:
 *   1. Downloads each image
 *   2. Sends it to Photoroom (background removal + #f6f6f6 fill)
 *   3. Uploads the result back to Shopify via staged uploads
 *   4. Deletes the original media
 *
 * Run: node scripts/process-images.mjs
 * Dry run (no changes): node scripts/process-images.mjs --dry-run
 * Single product: node scripts/process-images.mjs --handle barena-venezia-giacca
 */

import { readFileSync } from "fs"
import { resolve } from "path"

// Load .env.local
try {
  const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf8")
  for (const line of env.split("\n")) {
    const [k, ...rest] = line.split("=")
    if (k && rest.length) process.env[k.trim()] = rest.join("=").trim()
  }
} catch {}

const PHOTOROOM_KEY = process.env.PHOTOROOM_API_KEY
const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET
const API_VERSION = "2026-10"
const BG_COLOR = "f6f6f6"

let _token = null
async function getToken() {
  if (_token && _token.expires > Date.now()) return _token.value
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: SHOPIFY_CLIENT_ID, client_secret: SHOPIFY_CLIENT_SECRET }),
  })
  if (!res.ok) throw new Error(`Token request failed: ${res.status}`)
  const { access_token, expires_in } = await res.json()
  _token = { value: access_token, expires: Date.now() + (expires_in - 300) * 1000 }
  return _token.value
}

const DRY_RUN = process.argv.includes("--dry-run")
const HANDLE_FILTER = (() => {
  const i = process.argv.indexOf("--handle")
  return i !== -1 ? process.argv[i + 1] : null
})()
const BG_OVERRIDE = (() => {
  const i = process.argv.indexOf("--bg")
  return i !== -1 ? process.argv[i + 1].replace(/^#/, "") : null
})()

if (!PHOTOROOM_KEY) { console.error("Missing PHOTOROOM_API_KEY"); process.exit(1) }
if (!SHOPIFY_DOMAIN || !SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET) { console.error("Missing SHOPIFY_STORE_DOMAIN, SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET"); process.exit(1) }

const GQL_URL = `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`

async function gql(query, variables = {}) {
  const token = await getToken()
  const res = await fetch(GQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

// Fetch all active products with their media
async function fetchProducts() {
  const products = []
  let after = null
  do {
    const data = await gql(`
      query Products($after: String) {
        products(first: 50, after: $after, query: "status:active") {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            handle
            title
            media(first: 10) {
              nodes {
                id
                mediaContentType
                ... on MediaImage {
                  image { url width height }
                }
              }
            }
          }
        }
      }
    `, { after })
    const page = data.products
    for (const p of page.nodes) {
      if (HANDLE_FILTER && p.handle !== HANDLE_FILTER) continue
      products.push(p)
    }
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null
  } while (after)
  return products
}

// Send image URL through Photoroom (retries on 429)
async function processImage(imageUrl, retries = 8) {
  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`)
  const imgBuffer = await imgRes.arrayBuffer()

  for (let attempt = 0; attempt <= retries; attempt++) {
    const form = new FormData()
    form.append("imageFile", new Blob([imgBuffer], { type: "image/jpeg" }), "product.jpg")
    form.append("background.color", BG_OVERRIDE ?? BG_COLOR)
    form.append("outputSize", "originalImage")
    form.append("padding", "0.15")
    form.append("format", "jpg")

    const res = await fetch("https://image-api.photoroom.com/v2/edit", {
      method: "POST",
      headers: { "x-api-key": PHOTOROOM_KEY },
      body: form,
    })

    if (res.ok) return Buffer.from(await res.arrayBuffer())

    const err = await res.text()
    if (res.status === 429 && attempt < retries) {
      // Parse "Expected available in N second(s)" or fall back to exponential backoff
      const match = err.match(/(\d+)\s+second/)
      const wait = match ? (parseInt(match[1]) + 1) * 1000 : Math.min(2000 * 2 ** attempt, 60000)
      process.stdout.write(`(rate limited, waiting ${Math.round(wait/1000)}s) `)
      await new Promise(r => setTimeout(r, wait))
      continue
    }
    throw new Error(`Photoroom error ${res.status}: ${err}`)
  }
}

// Stage a file upload with Shopify
async function stageUpload(filename, fileSize, mimeType) {
  const data = await gql(`
    mutation StageUpload($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters { name value }
        }
        userErrors { field message }
      }
    }
  `, {
    input: [{
      filename,
      mimeType,
      fileSize: String(fileSize),
      resource: "IMAGE",
      httpMethod: "POST",
    }]
  })
  const errs = data.stagedUploadsCreate.userErrors
  if (errs.length) throw new Error(errs.map(e => e.message).join(", "))
  return data.stagedUploadsCreate.stagedTargets[0]
}

// Upload processed buffer to Shopify's staged URL
async function uploadToStaged(target, buffer, mimeType) {
  const form = new FormData()
  for (const { name, value } of target.parameters) form.append(name, value)
  form.append("file", new Blob([buffer], { type: mimeType }))
  const res = await fetch(target.url, { method: "POST", body: form })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Staged upload failed ${res.status}: ${text.slice(0, 200)}`)
  }
  return target.resourceUrl
}

// Attach a staged image to a product
async function attachMedia(productId, stagedUrl) {
  const data = await gql(`
    mutation CreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { id }
        userErrors { field message }
      }
    }
  `, {
    productId,
    media: [{ mediaContentType: "IMAGE", originalSource: stagedUrl }]
  })
  const errs = data.productCreateMedia.userErrors
  if (errs.length) throw new Error(errs.map(e => e.message).join(", "))
  return data.productCreateMedia.media[0]?.id
}

// Delete original media from product
async function deleteMedia(productId, mediaIds) {
  const data = await gql(`
    mutation DeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
        userErrors { field message }
      }
    }
  `, { productId, mediaIds })
  const errs = data.productDeleteMedia.userErrors
  if (errs.length) throw new Error(errs.map(e => e.message).join(", "))
}

// Wait for media to finish processing in Shopify
async function waitForMedia(productId, newMediaId, maxWait = 30000) {
  const start = Date.now()
  while (Date.now() - start < maxWait) {
    await new Promise(r => setTimeout(r, 2000))
    const data = await gql(`
      query MediaStatus($productId: ID!) {
        product(id: $productId) {
          media(first: 20) {
            nodes {
              id
              ... on MediaImage { status }
            }
          }
        }
      }
    `, { productId })
    const media = data.product?.media?.nodes ?? []
    const target = media.find(m => m.id === newMediaId)
    if (target?.status === "READY") return true
  }
  return false // timed out but continue anyway
}

// --- Main ---

async function run() {
  console.log(DRY_RUN ? "DRY RUN — no changes will be made\n" : "")
  if (HANDLE_FILTER) console.log(`Filtering to handle: ${HANDLE_FILTER}\n`)

  const products = await fetchProducts()
  console.log(`Found ${products.length} product(s)\n`)

  let processed = 0, skipped = 0, failed = 0

  for (const product of products) {
    const images = product.media.nodes.filter(m => m.mediaContentType === "IMAGE" && m.image?.url)
    if (images.length === 0) { console.log(`⬜ ${product.handle} — no images, skipping`); skipped++; continue }

    console.log(`📦 ${product.handle} (${images.length} image${images.length > 1 ? "s" : ""})`)

    for (let i = 0; i < images.length; i++) {
      const media = images[i]
      const url = media.image.url
      process.stdout.write(`   [${i + 1}/${images.length}] Processing… `)

      if (DRY_RUN) { console.log("(dry run)"); processed++; continue }

      try {
        // 1. Process via Photoroom
        const processedBuf = await processImage(url)
        process.stdout.write(`✓ Photoroom `)

        // 2. Stage upload with Shopify
        const filename = `${product.handle}-${i + 1}-processed.jpg`
        const target = await stageUpload(filename, processedBuf.byteLength, "image/jpeg")
        process.stdout.write(`✓ staged `)

        // 3. Upload to staged URL
        const resourceUrl = await uploadToStaged(target, processedBuf, "image/jpeg")
        process.stdout.write(`✓ uploaded `)

        // 4. Attach to product
        const newMediaId = await attachMedia(product.id, resourceUrl)
        process.stdout.write(`✓ attached `)

        // 5. Wait for Shopify to process it, then delete the old one
        if (newMediaId) {
          await waitForMedia(product.id, newMediaId)
          await deleteMedia(product.id, [media.id])
          process.stdout.write(`✓ replaced`)
        }

        console.log("")
        processed++

        // Brief pause to avoid rate limits
        await new Promise(r => setTimeout(r, 500))
      } catch (err) {
        console.log(`\n   ✗ ${err.message}`)
        failed++
      }
    }
  }

  console.log(`\nDone. ${processed} processed, ${skipped} skipped, ${failed} failed.`)
}

run().catch(err => { console.error(err); process.exit(1) })
