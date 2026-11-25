import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60

async function toBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer()
  return Buffer.from(buf).toString("base64")
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.FASHN_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "FASHN_API_KEY not configured" }, { status: 500 })
  }

  const form = await req.formData()
  const userPhoto = form.get("userPhoto") as File | null
  const productImageUrl = form.get("productImageUrl") as string | null
  const category = (form.get("category") as string | null) || "tops"

  if (!userPhoto || !productImageUrl) {
    return NextResponse.json({ error: "Missing userPhoto or productImageUrl" }, { status: 400 })
  }

  try {
    // Convert user photo to JPEG if HEIC (iPhone format)
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

    const modelImage = `data:image/jpeg;base64,${await toBase64(userBlob)}`

    // Fetch garment image
    const garmentRes = await fetch(productImageUrl)
    if (!garmentRes.ok) return NextResponse.json({ error: "Could not fetch product image" }, { status: 400 })
    const garmentBlob = await garmentRes.blob()
    const garmentImage = `data:image/jpeg;base64,${await toBase64(garmentBlob)}`

    // Submit try-on job to Fashn.ai
    const runRes = await fetch("https://api.fashn.ai/v1/run", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_image: modelImage,
        garment_image: garmentImage,
        category, // "tops" | "bottoms" | "one-pieces"
      }),
    })

    if (!runRes.ok) {
      const err = await runRes.json().catch(() => ({}))
      return NextResponse.json({ error: err.detail || err.error || "Fashn.ai request failed" }, { status: 500 })
    }

    const { id, error: runError } = await runRes.json()
    if (runError) return NextResponse.json({ error: runError }, { status: 500 })

    // Poll for result (max ~50s)
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 2000))

      const statusRes = await fetch(`https://api.fashn.ai/v1/status/${id}`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      })
      if (!statusRes.ok) continue

      const { status, output, error: statusError } = await statusRes.json()

      if (status === "completed" && output?.[0]) {
        return NextResponse.json({ image: output[0] })
      }
      if (status === "failed") {
        return NextResponse.json({ error: statusError || "Try-on generation failed" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Timed out waiting for result" }, { status: 504 })
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = (err as any)?.message || String(err)
    console.error("Try-on error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
