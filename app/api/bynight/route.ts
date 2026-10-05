import { NextResponse } from "next/server"
import { addDrink, getDrinkers, getGuests, type DrinkType } from "@/lib/bynight"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return NextResponse.json({ people: await getDrinkers() })
  } catch (err) {
    console.error("bynight: read failed", err)
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}

/* Staff tally: { id, type: "beer" | "wine", delta: 1 | -1, pin } */
export async function POST(req: Request) {
  let body: { id?: string; type?: string; delta?: number; pin?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const pin = process.env.BYNIGHT_PIN
  if (!pin || body.pin !== pin) {
    return NextResponse.json({ error: "Wrong PIN" }, { status: 401 })
  }
  const type = body.type as DrinkType
  if (type !== "beer" && type !== "wine") {
    return NextResponse.json({ error: "Invalid drink" }, { status: 400 })
  }
  if (body.delta !== 1 && body.delta !== -1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
  }

  try {
    const guests = await getGuests()
    if (!guests.some((g) => g.id === body.id)) {
      return NextResponse.json({ error: "Unknown guest" }, { status: 404 })
    }
    const count = await addDrink(body.id!, type, body.delta)
    return NextResponse.json({ id: body.id, type, count })
  } catch (err) {
    console.error("bynight: write failed", err)
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}
