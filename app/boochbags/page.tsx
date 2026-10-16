"use client"

import { useState } from "react"

// ---- Edit these ----
const EVENT_NAME = "Booch X Fazenda Preview Night"
const EVENT_DATE = "Friday October 23rd, 7–10pm"
const EVENT_DETAILS = "177 Mott Street, New York"
/* Becomes the tab name in the RSVP sheet, so keep it stable once guests start replying. */
const EVENT_KEY = "Booch X Fazenda Preview Night - Oct 23"
const FAZENDA = "#551322"
// --------------------

type Status = "idle" | "sending" | "done" | "error"

export default function BoochBags() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [status, setStatus] = useState<Status>("idle")

  const update = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, event: EVENT_KEY }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error()
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  return (
    <main className="rsvp">
      <style>{`
        .rsvp {
          background: #fff;
          color: ${FAZENDA};
          min-height: 100vh;
          font-family: "Times New Roman", Times, serif;
        }
        .rsvp-inner { max-width: 560px; margin: 0 auto; padding: 50px 16px 80px; text-align: center; }
        .rsvp .collab {
          display: flex; align-items: center; justify-content: center;
          gap: 22px; flex-wrap: nowrap; min-height: 110px;
        }
        .rsvp .logo-fazenda { height: 26px; width: auto; }
        .rsvp .logo-booch   { height: 56px; width: auto; }
        .rsvp .sep { font-size: 24px; }
        @media (max-width: 480px) {
          .rsvp .collab { gap: 12px; }
          .rsvp .logo-fazenda { height: 18px; }
          .rsvp .logo-booch   { height: 40px; }
          .rsvp .sep { font-size: 18px; }
        }
        .rsvp h1 { font-weight: 400; font-size: 24px; letter-spacing: 0.08em; margin: 34px 0 18px; }
        .rsvp p  { font-size: 20px; margin: 0 0 16px; }
        .rsvp form { margin-top: 50px; }
        .rsvp label { display: block; font-size: 20px; margin-bottom: 0; }
        .rsvp input {
          display: block; width: 100%; box-sizing: border-box;
          height: 66px; margin-bottom: 40px;
          border: 0; border-bottom: 1px solid ${FAZENDA};
          background: transparent; color: ${FAZENDA};
          font: inherit; font-size: 20px; text-align: center; outline: none;
        }
        .rsvp button {
          width: 100%; height: 70px; margin-top: 8px;
          border: 0; background: ${FAZENDA}; color: #fff;
          font: inherit; font-size: 20px; cursor: pointer;
        }
        .rsvp button:disabled { opacity: 0.6; cursor: default; }
        .rsvp .msg { margin-top: 24px; font-size: 18px; }
        @media (max-width: 480px) { .rsvp h1 { font-size: 20px; } }
      `}</style>

      <div className="rsvp-inner">
        <div className="collab">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-booch" src="/boochbags/booch.png" alt="Booch" />
          <span className="sep">at</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-fazenda" src="/boochbags/fazenda.png" alt="Fazenda" />
        </div>

        <h1>RSVP</h1>
        <p>{EVENT_NAME}</p>
        <p>{EVENT_DATE}</p>
        <p>{EVENT_DETAILS}</p>

        {status === "done" ? (
          <p className="msg">
            Thank you, {form.name.split(" ")[0]}. You&rsquo;re on the list — see you there.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={update}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={update}
            />

            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={update}
            />

            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "RSVP"}
            </button>

            {status === "error" && (
              <p className="msg">That didn&rsquo;t go through. Check your connection and try again.</p>
            )}
          </form>
        )}
      </div>
    </main>
  )
}
