import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { toFile } from "openai"

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

  const openai = new OpenAI({ apiKey })

  // Fetch product image and convert to File for OpenAI
  const productRes = await fetch(productImageUrl)
  if (!productRes.ok) {
    return NextResponse.json({ error: "Failed to fetch product image" }, { status: 400 })
  }
  const productBlob = await productRes.blob()
  const productFile = await toFile(productBlob, "product.jpg", { type: "image/jpeg" })

  const userFile = await toFile(
    new Blob([await userPhoto.arrayBuffer()], { type: userPhoto.type }),
    "person.jpg",
    { type: userPhoto.type }
  )

  const prompt = productDescription
    ? `Show the person in the first image wearing this garment: ${productDescription}. Keep the person's face, hairstyle, and body proportions identical. Only change the clothing to show them wearing the described item. Maintain a natural, photorealistic result.`
    : `Show the person wearing the garment from the reference image. Keep the person's face, hairstyle, and body proportions identical. Only change the clothing. Maintain a natural, photorealistic result.`

  const response = await openai.images.edit({
    model: "gpt-image-1",
    image: [userFile, productFile],
    prompt,
    n: 1,
    size: "1024x1024",
  })

  const imageData = response.data?.[0]
  if (!imageData) {
    return NextResponse.json({ error: "No image returned from OpenAI" }, { status: 500 })
  }

  // gpt-image-1 returns b64_json
  const b64 = imageData.b64_json
  if (b64) {
    return NextResponse.json({ image: `data:image/png;base64,${b64}` })
  }
  if (imageData.url) {
    return NextResponse.json({ image: imageData.url })
  }

  return NextResponse.json({ error: "Unexpected response format from OpenAI" }, { status: 500 })
}
