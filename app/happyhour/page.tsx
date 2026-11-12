"use client"

import { useState } from "react"

import WalkingBuffalo from "@/components/WalkingBuffalo"

// ---- Edit these ----
const KICKER = "Invite Only"
const INVITATION =
  "We’d love for you to join happy hour Friday November 12 with our friends and family."
const HOSTS = "Hosted by Clayton Chambers, Kirk Chambers, and Zac Chambers at Fazenda"
const EVENT_TIME = "5 – 7PM"
const EVENT_ADDRESS = "177 Mott Street, New York"
/* Becomes the tab name in the RSVP sheet, so keep it stable once guests start replying. */
const EVENT_KEY = "Happy Hour with Clayton, Kirk and Zac Chambers - Nov 12"
const INK = "#000000"
// --------------------

type Status = "idle" | "sending" | "done" | "error"

export default function HappyHour() {
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
    <main className="hh">
      <style>{`
        /* Neue Haas Unica is licensed, so this is the chain Bode's own stack
           falls back to — near-identical on Mac and iOS. */
        .hh, .hh input, .hh button {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        /* Set on the document too, so iOS overscroll does not reveal grey. */
        html, body { background: #fff; }
        .hh {
          background: #fff;
          color: ${INK};
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 72px 20px 96px;
          -webkit-font-smoothing: antialiased;
        }
        .hh-inner { width: 100%; max-width: 27rem; text-align: center; }

        /* The herd artwork is burgundy (#5D0A21); brightness(0) takes it to
           black while leaving its alpha and edge fade intact. */
        .scene {
          width: 100%; max-width: 210px; margin-inline: auto;
          filter: brightness(0);
        }
        /* The wordmark is painted as a background colour showing through its own
           alpha, so it renders in black from a single asset. */
        .wordmark {
          width: 100%;
          background-color: ${INK};
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          -webkit-mask-position: center; mask-position: center;
          -webkit-mask-size: contain; mask-size: contain;
          margin-inline: auto;
          max-width: 132px;
          aspect-ratio: 1446 / 182;
          margin-top: 14px;
          -webkit-mask-image: url(/fazenda-w2-mask.png);
          mask-image: url(/fazenda-w2-mask.png);
        }

        .kicker {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          margin: 56px 0 0;
        }
        .invitation {
          font-size: 13px; line-height: 20px; margin: 20px auto 0; max-width: 23rem;
        }
        .hosts {
          font-size: 12px; line-height: 20px; margin: 16px auto 0; max-width: 23rem;
          opacity: 0.65;
        }
        .details {
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          line-height: 20px; margin: 32px 0 0;
        }

        .rsvp { margin-top: 56px; text-align: left; }
        .rsvp h2 {
          font-weight: 400; font-size: 11px; letter-spacing: 0.22em;
          text-transform: uppercase; margin: 0 0 20px; text-align: center;
        }
        .field { margin-bottom: 20px; }
        .hh label {
          display: block; font-size: 11px; letter-spacing: 0.08em; margin-bottom: 4px;
        }
        .hh input {
          display: block; width: 100%; box-sizing: border-box;
          height: 32px; padding: 0;
          border: 0; border-bottom: 1px solid ${INK}; border-radius: 0;
          background: transparent; color: ${INK};
          font: inherit; font-size: 13px; text-align: left; outline: none;
        }
        .hh input:focus { border-bottom-width: 2px; }
        .hh input:-webkit-autofill { -webkit-text-fill-color: ${INK}; transition: background-color 9999s; }
        .hh button {
          width: 100%; height: 40px; margin-top: 28px;
          border: 1px solid ${INK}; border-radius: 0;
          background: ${INK}; color: #fff;
          font: inherit; font-size: 11px; letter-spacing: 0.08em;
          cursor: pointer; transition: background-color 0.15s, color 0.15s;
        }
        .hh button:hover { background: #fff; color: ${INK}; }
        .hh button:disabled { opacity: 0.45; cursor: default; background: ${INK}; color: #fff; }
        .msg { font-size: 13px; line-height: 20px; margin-top: 20px; text-align: center; }
      `}</style>

      <div className="hh-inner">
        <WalkingBuffalo className="scene" />
        <div className="wordmark" role="img" aria-label="Fazenda" />

        <p className="kicker">{KICKER}</p>
        <p className="invitation">{INVITATION}</p>
        <p className="hosts">{HOSTS}</p>

        <p className="details">
          {EVENT_TIME}
          <br />
          {EVENT_ADDRESS}
        </p>

        <section className="rsvp">
          <h2>RSVP</h2>

          {status === "done" ? (
            <p className="msg">
              Thank you, {form.name.split(" ")[0]}. You&rsquo;re on the list — see you there.
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
                <p className="msg">
                  That didn&rsquo;t go through. Check your connection and try again.
                </p>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
