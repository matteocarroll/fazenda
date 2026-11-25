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

    const userFile = await toFile(
      new Blob([await userPhoto.arrayBuffer()], { type: userPhoto.type || "image/jpeg" }),
      "person.jpg",
      { type: userPhoto.type || "image/jpeg" }
    )

    // Fetch product image
    const productRes = await fetch(productImageUrl)
    if (!productRes.ok) {
      return NextResponse.json({ error: "Could not fetch product image" }, { status: 400 })
    }
    const productBlob = await productRes.blob()
    const productFile = await toFile(productBlob, "product.jpg", { type: "image/jpeg" })

    const prompt = `You are given a photo of a person and a product garment image. Generate a photorealistic image showing that exact person wearing the garment. The garment is: ${productDescription || "the clothing item shown"}. Keep the person's face, skin tone, hair, and body proportions exactly the same. Only change the clothing.`

    // Try multi-image edit (gpt-image-1 supports array of images)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (openai.images.edit as any)({
      model: "gpt-image-1",
      image: [userFile, productFile],
      prompt,
      n: 1,
      size: "1024x1024",
    })

    const imageData = response.data?.[0]
    if (!imageData) {
      return NextResponse.json({ error: "No image returned" }, { status: 500 })
    }

    if (imageData.b64_json) {
      return NextResponse.json({ image: `data:image/png;base64,${imageData.b64_json}` })
    }
    if (imageData.url) {
      return NextResponse.json({ image: imageData.url })
    }

    return NextResponse.json({ error: "Unexpected response format" }, { status: 500 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    // Also try to extract OpenAI API error details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiErr = (err as any)?.error?.message || (err as any)?.message || msg
    console.error("Try-on error:", apiErr)
    return NextResponse.json({ error: apiErr }, { status: 500 })
  }
}
