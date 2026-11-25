import { NextRequest, NextResponse } from "next/server"
import { verifyMagicToken, createSession } from "@/lib/auth"
import { findCustomerByEmail } from "@/lib/shopify-customer"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://fazenda.com"

  if (!token) {
    return NextResponse.redirect(`${appUrl}/virtualstore?auth=invalid`)
  }

  const email = await verifyMagicToken(token)
  if (!email) {
    return NextResponse.redirect(`${appUrl}/virtualstore?auth=expired`)
  }

  // Look up Shopify customer — link silently if found
  const customer = await findCustomerByEmail(email)

  await createSession({
    email,
    name: customer?.displayName,
    shopifyCustomerId: customer?.id,
  })

  return NextResponse.redirect(`${appUrl}/virtualstore?auth=success`)
}
