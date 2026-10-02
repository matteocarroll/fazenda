import { NextResponse } from "next/server"

/* Apps Script web app behind the Fazenda RSVP sheet. Kept server-side: posting
   to it from the browser is a cross-origin request that Apps Script answers
   with a redirect, so the reply often can't be read even when the row is
   written — which would show the guest an error after a successful RSVP. */
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxSgcFg4qCP8_tqppOHZy3MWdSQf95dzZ_hnUnuZhikJvz2jpMfwaRfmfxPWKDjlh8w/exec"

export async function POST(req: Request) {
  let name = ""
  let email = ""
  let phone = ""
  let event = ""

  try {
    ;({ name = "", email = "", phone = "", event = "" } = await req.json())
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }

  if (!name.trim() || !email.trim() || !phone.trim()) {
    return NextResponse.json(
      { ok: false, error: "Name, email and phone are required" },
      { status: 400 },
    )
  }

  try {
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name, email, phone, event }),
    })
    if (!res.ok) {
      console.error("Thursdays RSVP: sheet returned", res.status)
      return NextResponse.json({ ok: false, error: "Could not save RSVP" }, { status: 502 })
    }
  } catch (err) {
    console.error("Thursdays RSVP: sheet write failed —", err)
    return NextResponse.json({ ok: false, error: "Could not save RSVP" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
