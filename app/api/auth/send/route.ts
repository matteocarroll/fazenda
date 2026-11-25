import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { signMagicToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: "Email not configured" }, { status: 500 })

  const token = await signMagicToken(email.toLowerCase().trim())
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://fazenda.com"
  const link = `${appUrl}/api/auth/verify?token=${encodeURIComponent(token)}`

  const resend = new Resend(resendKey)
  const { error } = await resend.emails.send({
    from: "Fazenda <hello@fazenda.com>",
    to: email,
    subject: "Sign in to Fazenda",
    html: `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#000">
        <p style="font-size:13px;margin:0 0 32px">FAZENDA</p>
        <p style="font-size:16px;margin:0 0 24px">Click the link below to sign in. It expires in 15 minutes.</p>
        <a href="${link}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:12px 24px;font-size:13px;border-radius:4px">Sign in to Fazenda</a>
        <p style="font-size:11px;color:#999;margin:32px 0 0">If you didn't request this, you can safely ignore it.</p>
      </div>
    `,
  })

  if (error) {
    console.error("Resend error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
