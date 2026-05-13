import { NextResponse } from "next/server"

const SHEET_URL = "https://script.google.com/macros/s/AKfycbwQLOptugSKePrrr64882NR8e1BmrkcoeCeOIjAKi0x79dnRyqbRqHPslvnND20Sm6x/exec"

export async function POST(req: Request) {
  const { name, email, phone } = await req.json()

  await fetch(SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone }),
  })

  return NextResponse.json({ success: true })
}
