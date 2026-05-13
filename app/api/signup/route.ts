import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: Request) {
  const { name, email, phone } = await req.json()
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: "Fazenda Signups <onboarding@resend.dev>",
    to: "matteo@fazendacompany.com",
    subject: "New signup — Fazenda",
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "—"}</p>
    `,
  })

  return NextResponse.json({ success: true })
}
