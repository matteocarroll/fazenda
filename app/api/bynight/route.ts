import { NextResponse } from "next/server"
import { addDrink, getDrinkers, type DrinkType } from "@/lib/bynight"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    /* Every open leaderboard polls this; a one-second CDN cache keeps Redis
       at about one read per second however many guests are watching. */
    return NextResponse.json(
      { people: await getDrinkers() },
      { headers: { "Cache-Control": "public, s-maxage=1, stale-while-revalidate=1" } },
    )
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

  /* Ids are checked by shape only, so a slow or flaky sheet read never
     blocks a tap. A stray id is harmless: nothing displays it. */
  if (typeof body.id !== "string" || !/^[0-9a-f]{10}$/.test(body.id)) {
    return NextResponse.json({ error: "Unknown guest" }, { status: 404 })
  }

  try {
    const count = await addDrink(body.id, type, body.delta)
    return NextResponse.json({ id: body.id, type, count })
  } catch (err) {
    console.error("bynight: write failed", err)
    return NextResponse.json({ error: "Unavailable" }, { status: 503 })
  }
}
