import { createHmac, timingSafeEqual } from "node:crypto"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { SHOPIFY_TAG } from "@/lib/shopify"

/* Shopify product webhooks (create, update, delete) land here and refresh the
   Virtual Store straight away instead of waiting for its 60-second revalidate.
   Shopify signs each delivery with the key shown under Settings → Notifications
   → Webhooks; that key is SHOPIFY_WEBHOOK_SECRET. */

export const runtime = "nodejs"

function signedByShopify(body: string, signature: string | null, secret: string) {
  if (!signature) return false
  const expected = createHmac("sha256", secret).update(body, "utf8").digest()
  const received = Buffer.from(signature, "base64")
  return received.length === expected.length && timingSafeEqual(received, expected)
}

export async function POST(req: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Webhook secret not configured" }, { status: 500 })
  }

  // The signature covers the raw bytes, so read the body before parsing anything.
  const body = await req.text()
  if (!signedByShopify(body, req.headers.get("x-shopify-hmac-sha256"), secret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 })
  }

  revalidateTag(SHOPIFY_TAG)
  revalidatePath("/virtualstore")
  return NextResponse.json({ ok: true, topic: req.headers.get("x-shopify-topic") })
}
