import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export const runtime = "nodejs"
export const maxDuration = 60

async function toBase64DataUri(blob: Blob, mime = "image/jpeg"): Promise<string> {
  const buf = await blob.arrayBuffer()
  return `data:${mime};base64,${Buffer.from(buf).toString("base64")}`
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.FASHN_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "FASHN_API_KEY not configured" }, { status: 500 })
  }

  const form = await req.formData()
  const userPhoto = form.get("userPhoto") as File | null
  const productImageUrl = form.get("productImageUrl") as string | null
  const category = (form.get("category") as string | null) || "auto"

  if (!userPhoto || !productImageUrl) {
    return NextResponse.json({ error: "Missing userPhoto or productImageUrl" }, { status: 400 })
  }

  try {
    // Convert user photo — handle HEIC (iPhone default)
    const userBuffer = await userPhoto.arrayBuffer()
    const mime = userPhoto.type || ""
    let userBlob: Blob
    if (mime.includes("heic") || mime.includes("heif") || userPhoto.name.match(/\.heic$/i)) {
      const { default: sharp } = await import("sharp")
      const jpegBuf = await sharp(Buffer.from(userBuffer)).jpeg({ quality: 90 }).toBuffer()
      userBlob = new Blob([new Uint8Array(jpegBuf)], { type: "image/jpeg" })
    } else {
      userBlob = new Blob([userBuffer], { type: mime || "image/jpeg" })
    }
    const modelImage = await toBase64DataUri(userBlob)

    // Fetch garment image
    const garmentRes = await fetch(productImageUrl)
    if (!garmentRes.ok) return NextResponse.json({ error: "Could not fetch product image" }, { status: 400 })
    const garmentBlob = await garmentRes.blob()
    const garmentImage = await toBase64DataUri(garmentBlob)

    // Submit to Fashn.ai — correct format per docs
    const runRes = await fetch("https://api.fashn.ai/v1/run", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_name: "tryon-max",
        inputs: {
          model_image: modelImage,
          product_image: garmentImage, // tryon-max uses product_image
        },
      }),
    })

    const runBody = await runRes.json()
    if (!runRes.ok || runBody.error) {
      const msg = runBody?.error?.message || runBody?.detail || JSON.stringify(runBody)
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    const { id } = runBody
    if (!id) return NextResponse.json({ error: "No job ID returned" }, { status: 500 })

    // Poll until completed or failed (max ~50s)
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 2000))

      const statusRes = await fetch(`https://api.fashn.ai/v1/status/${id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      if (!statusRes.ok) continue

      const { status, output, error: statusError } = await statusRes.json()

      if (status === "completed" && output?.[0]) {
        const fashnUrl: string = output[0]
        // Upload to Vercel Blob for permanent storage
        let imageUrl = fashnUrl
        try {
          const imgRes = await fetch(fashnUrl)
          if (imgRes.ok) {
            const blob = await imgRes.blob()
            const filename = `tryons/${id}.jpg`
            const { url } = await put(filename, blob, { access: "public", addRandomSuffix: false })
            imageUrl = url
          }
        } catch {
          // Fall back to Fashn URL if blob upload fails
        }
        return NextResponse.json({ image: imageUrl })
      }
      if (status === "failed") {
        const msg = statusError?.message || statusError || "Generation failed"
        return NextResponse.json({ error: msg }, { status: 500 })
      }
      // starting | in_queue | processing → keep polling
    }

    return NextResponse.json({ error: "Timed out — try again" }, { status: 504 })
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = (err as any)?.message || String(err)
    console.error("Try-on error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
