import { NextResponse, after } from "next/server"

/* Google Sheet keeps a durable record regardless of whether Folk is wired up. */
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwQLOptugSKePrrr64882NR8e1BmrkcoeCeOIjAKi0x79dnRyqbRqHPslvnND20Sm6x/exec"

const FOLK_GROUP_ID = "grp_237d5fe1-c0b1-4cc2-b24b-939979b3ecd2" // "Fazenda Clients"
const SOURCE = "Sep 12 RSVP"

async function addToFolk(name: string, email: string, phone?: string) {
  const key = process.env.FOLK_API_KEY
  if (!key) return { ok: false, reason: "FOLK_API_KEY not set" }

  const trimmed = name.trim()
  const cut = trimmed.indexOf(" ")

  const res = await fetch("https://api.folk.app/v1/people", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: trimmed,
      firstName: cut === -1 ? trimmed : trimmed.slice(0, cut),
      lastName: cut === -1 ? undefined : trimmed.slice(cut + 1),
      emails: [email],
      ...(phone ? { phones: [phone] } : {}),
      groups: [{ id: FOLK_GROUP_ID }],
      customFieldValues: { [FOLK_GROUP_ID]: { Source: SOURCE } },
    }),
  })

  if (!res.ok) {
    return { ok: false, reason: `Folk ${res.status}: ${(await res.text()).slice(0, 300)}` }
  }
  return { ok: true }
}

/* Diagnostic only: reports whether the Folk key reached this deployment.
   Returns a boolean, never the key itself. */
export async function GET() {
  return NextResponse.json({ folkConfigured: Boolean(process.env.FOLK_API_KEY) })
}

export async function POST(req: Request) {
  let name = ""
  let email = ""
  let phone = ""

  try {
    ;({ name = "", email = "", phone = "" } = await req.json())
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!name.trim() || !email.trim() || !phone.trim()) {
    return NextResponse.json(
      { error: "Name, email and phone are required" },
      { status: 400 },
    )
  }

  const writeSheet = () =>
    fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, source: SOURCE }),
    })

  /* Folk is the system of record and answers in a fraction of the time the
     Apps Script webhook takes, so the guest waits only for this. */
  let folk: { ok: boolean; reason?: string }
  try {
    folk = await addToFolk(name, email, phone)
  } catch (err) {
    folk = { ok: false, reason: String(err) }
  }

  if (folk.ok) {
    /* The sheet is only a backup copy — let it finish after the response has
       gone out rather than holding the guest on "SENDING...". */
    after(async () => {
      try {
        const res = await writeSheet()
        if (!res.ok) console.error("RSVP: sheet write failed —", `HTTP ${res.status}`)
      } catch (err) {
        console.error("RSVP: sheet write failed —", err)
      }
    })
    return NextResponse.json({ success: true, folk: true })
  }

  /* Folk did not take it, so the sheet is now the safety net and is worth
     waiting for. */
  console.error("RSVP: Folk sync failed —", folk.reason)
  try {
    const res = await writeSheet()
    if (res.ok) return NextResponse.json({ success: true, folk: false })
    console.error("RSVP: sheet write failed —", `HTTP ${res.status}`)
  } catch (err) {
    console.error("RSVP: sheet write failed —", err)
  }

  return NextResponse.json({ error: "Could not save RSVP" }, { status: 502 })
}
