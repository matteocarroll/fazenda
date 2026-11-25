"use client"

import { useState } from "react"

type Status = "idle" | "sending" | "done" | "error"

export default function Rsvp({ eventKey }: { eventKey: string }) {
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
        body: JSON.stringify({ ...form, event: eventKey }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error()
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section className="rsvp">
      <h2>RSVP</h2>

      {status === "done" ? (
        <p className="msg">
          Thank you, {form.name.split(" ")[0]}. You&rsquo;re on the list — see you Sunday.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field">
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
          </div>

          <div className="field">
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
          </div>

          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={update}
            />
          </div>

          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "RSVP"}
          </button>

          {status === "error" && (
            <p className="msg">That didn&rsquo;t go through. Check your connection and try again.</p>
          )}
        </form>
      )}
    </section>
  )
}
