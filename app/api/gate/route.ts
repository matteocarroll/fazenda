import { NextResponse } from "next/server"

/* The invite pages are a soft gate, not a security boundary: the password is
   shared in a group chat and only keeps the page out of the hands of anyone who
   stumbles on the URL. Compared server-side so the word never ships to the
   browser. */
const PASSWORDS: Record<string, string> = {
  nov22: "thanksgiving",
}

export async function POST(req: Request) {
  let gate = ""
  let password = ""

  try {
    ;({ gate = "", password = "" } = await req.json())
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const expected = PASSWORDS[gate]
  if (!expected || password.trim().toLowerCase() !== expected) {
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(`gate_${gate}`, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
