"use client"

import { useState } from "react"

import WalkingBuffalo from "@/components/WalkingBuffalo"

// ---- Edit these ----
const EVENT_TITLE = "RSVP"
const EVENT_NAME = "Fazenda's Wine Night - 1st Edition"
const EVENT_DATE = "Thursday October 8th at 7pm"
const EVENT_DETAILS = "177 Mott Street, New York"
const BURGUNDY = "#5D0A21" // brazilwood, from the Fazenda palette
// --------------------

type Status = "idle" | "sending" | "done" | "error"

export default function Thursdays() {
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
        body: JSON.stringify({ ...form, event: EVENT_NAME }),
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
          color: ${BURGUNDY};
          font-family: "Times New Roman", Times, serif;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 96px 24px;
        }
        .rsvp-inner { width: 100%; max-width: 420px; text-align: center; }
        .rsvp .buffalo { margin: 0 auto 28px; width: 160px; max-width: 100%; }
        .rsvp h1 { font-weight: inherit; font-size: 1.75rem; margin: 0 0 8px; }
        .rsvp .event-name { font-weight: inherit; font-size: 1rem; margin: 0 0 6px; }
        .rsvp .event-date { margin: 0 0 6px; }
        .rsvp p { margin: 0 0 40px; line-height: 1.5; }
        .rsvp label { display: block; font-size: 1rem; margin-bottom: 6px; }
        .rsvp input { text-align: center; }
        .rsvp input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          font: inherit;
          color: ${BURGUNDY};
          background: #fff;
          border: none;
          border-bottom: 1px solid ${BURGUNDY};
          border-radius: 0;
          padding: 8px 0;
          margin-bottom: 28px;
        }
        .rsvp input:focus { outline: none; border-bottom-width: 2px; padding-bottom: 7px; }
        .rsvp button {
          font: inherit;
          width: 100%;
          padding: 14px;
          margin-top: 8px;
          background: ${BURGUNDY};
          color: #fff;
          border: none;
          border-radius: 0;
          cursor: pointer;
        }
        .rsvp button:disabled { opacity: 0.6; cursor: default; }
        .rsvp button:focus-visible { outline: 2px solid ${BURGUNDY}; outline-offset: 3px; }
        .rsvp .msg { margin-top: 16px; font-size: 1rem; }
      `}</style>

      <div className="rsvp-inner">
        <WalkingBuffalo className="buffalo" />

        <h1>{EVENT_TITLE}</h1>
        <h2 className="event-name">{EVENT_NAME}</h2>
        <p className="event-date">{EVENT_DATE}</p>
        <p>{EVENT_DETAILS}</p>

        {status === "done" ? (
          <p>Thank you, {form.name.split(" ")[0]}. You&apos;re on the list — see you there.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={update} />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update} />

            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={update} />

            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "RSVP"}
            </button>

            {status === "error" && (
              <p className="msg">That didn&apos;t go through. Check your connection and try again.</p>
            )}
          </form>
        )}
      </div>
    </main>
  )
}
