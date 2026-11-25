import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getCustomerCollection, setCustomerCollection } from "@/lib/shopify-customer"

export async function GET() {
  const session = await getSession()
  if (!session?.shopifyCustomerId) return NextResponse.json([])
  const collection = await getCustomerCollection(session.shopifyCustomerId)
  return NextResponse.json(collection)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.shopifyCustomerId) return NextResponse.json({ error: "Not signed in" }, { status: 401 })
  const collection = await req.json()
  await setCustomerCollection(session.shopifyCustomerId, collection)
  return NextResponse.json({ ok: true })
}
