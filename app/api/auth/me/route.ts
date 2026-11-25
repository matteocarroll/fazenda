import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { findCustomerByEmail } from "@/lib/shopify-customer"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json(null)

  const customer = session.shopifyCustomerId
    ? await findCustomerByEmail(session.email)
    : null

  return NextResponse.json({ session, customer })
}
