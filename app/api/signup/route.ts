import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, email, phone } = await req.json()
  console.log("New signup:", { name, email, phone, date: new Date().toISOString() })
  return NextResponse.json({ success: true })
}
