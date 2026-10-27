import { createHmac, timingSafeEqual } from "node:crypto"
import { revalidatePath, revalidateTag } from "next/cache"
import { SHOPIFY_TAG } from "@/lib/shopify"

/**
 * Shopify product webhooks (create / update / delete) POST here.
 * We check Shopify's signature, then clear the cached catalogue so
 * /virtualstore shows the change on the next visit.
 *
 * Env: SHOPIFY_WEBHOOK_SECRET — the signing secret shown under
 * Shopify admin → Settings → Notifications → Webhooks.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) return new Response("Not configured", { status: 500 })

  const body = await request.text()
  const received = request.headers.get("x-shopify-hmac-sha256") ?? ""
  const expected = createHmac("sha256", secret).update(body, "utf8").digest("base64")

  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return new Response("Invalid signature", { status: 401 })
  }

  revalidateTag(SHOPIFY_TAG)
  revalidatePath("/virtualstore")
  return Response.json({ revalidated: true })
}
