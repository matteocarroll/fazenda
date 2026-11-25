import { NextRequest, NextResponse } from "next/server"
import OpenAI, { toFile } from "openai"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
  }

  const form = await req.formData()
  const userPhoto = form.get("userPhoto") as File | null
  const productImageUrl = form.get("productImageUrl") as string | null
  const productDescription = form.get("productDescription") as string | null

  if (!userPhoto || !productImageUrl) {
    return NextResponse.json({ error: "Missing userPhoto or productImageUrl" }, { status: 400 })
  }

  try {
    const openai = new OpenAI({ apiKey })

    // Convert user photo to JPEG (handles HEIC from iPhone)
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

    // Convert to square 1024x1024 PNG with alpha for DALL-E edit
    const { default: sharp } = await import("sharp")
    const squarePng = await sharp(Buffer.from(await userBlob.arrayBuffer()))
      .resize(1024, 1024, { fit: "cover" })
      .png()
      .toBuffer()
    const squareFile = await toFile(new Blob([new Uint8Array(squarePng)], { type: "image/png" }), "person.png", { type: "image/png" })

    const desc = productDescription || "the garment"
    const prompt = `Photorealistic image of this person wearing ${desc}. Preserve the person's face, skin tone, hair, and body. Only change the outfit.`

    const response = await openai.images.edit({
      model: "dall-e-2",
      image: squareFile,
      prompt,
      n: 1,
      size: "1024x1024",
    })

    const imageData = response.data?.[0]
    if (!imageData) return NextResponse.json({ error: "No image returned" }, { status: 500 })

    if (imageData.b64_json) {
      return NextResponse.json({ image: `data:image/png;base64,${imageData.b64_json}` })
    }
    if (imageData.url) {
      return NextResponse.json({ image: imageData.url })
    }

    return NextResponse.json({ error: "Unexpected response format" }, { status: 500 })
  } catch (err: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = (err as any)?.error?.message || (err as any)?.message || String(err)
    console.error("Try-on error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
