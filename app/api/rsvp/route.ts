import { NextResponse } from "next/server"

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

export async function POST(req: Request) {
  let name = ""
  let email = ""
  let phone = ""

  try {
    ;({ name = "", email = "", phone = "" } = await req.json())
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!name.trim() || !email.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
  }

  /* Never let one destination failing lose the RSVP from the other. */
  const [sheet, folk] = await Promise.allSettled([
    fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, source: SOURCE }),
    }),
    addToFolk(name, email, phone),
  ])

  const folkOk = folk.status === "fulfilled" && folk.value.ok
  if (!folkOk) {
    console.error(
      "RSVP: Folk sync failed —",
      folk.status === "fulfilled" ? folk.value.reason : folk.reason,
    )
  }

  /* fetch only rejects on network errors, so an error status still needs checking. */
  const sheetOk = sheet.status === "fulfilled" && sheet.value.ok
  if (!sheetOk) {
    console.error(
      "RSVP: sheet write failed —",
      sheet.status === "fulfilled" ? `HTTP ${sheet.value.status}` : sheet.reason,
    )
  }

  /* The guest is confirmed as long as one destination captured them. */
  if (!sheetOk && !folkOk) {
    return NextResponse.json({ error: "Could not save RSVP" }, { status: 502 })
  }

  return NextResponse.json({ success: true, folk: folkOk })
}
