"use client"

import { useState } from "react"

// ---- Edit these ----
const EVENT_NAME = "Sur Marina"
const EVENT_INTRO = "Fazenda is excited to host an evening with Sur Marina on Thursday, December 3rd."
const COLLECTION_URL = "https://surmarina.com/collections/all"
const EVENT_TIME = "7–10pm"
const EVENT_ADDRESS = "177 Mott Street, New York"
/* Becomes the tab name in the RSVP sheet, so keep it stable once guests start replying. */
const EVENT_KEY = "Sur Marina at Fazenda - Dec 3"
const FAZENDA = "#551322"
// --------------------

type Status = "idle" | "sending" | "done" | "error"

export default function SurMarina() {
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
        /* Set on the document too, so iOS overscroll does not reveal grey. */
        html, body { background: #fff; }
        .rsvp {
          background: #fff;
          color: ${FAZENDA};
          min-height: 100vh;
          font-family: "Times New Roman", Times, serif;
        }
        .rsvp-inner { max-width: 560px; margin: 0 auto; padding: 50px 16px 80px; text-align: center; }

        .rsvp .logo { display: block; width: 230px; height: auto; margin: 0 auto; }
        .rsvp .title { font-weight: 400; margin: 44px 0 46px; line-height: 1.1; }
        .rsvp .title span { display: block; }
        .rsvp .t-main {
          font-size: 34px; letter-spacing: 0.14em; padding-left: 0.14em; text-transform: uppercase;
        }
        .rsvp .t-at { font-size: 18px; font-style: italic; letter-spacing: 0.04em; margin: 22px 0 20px; }
        .rsvp .t-logo { display: block; height: 22px; width: auto; margin: 2px auto 0; }

        .rsvp a {
          color: inherit; text-decoration: underline;
          text-underline-offset: 3px; text-decoration-thickness: 1px;
        }
        .rsvp a:hover { opacity: .75; }

        .rsvp p { font-size: 20px; margin: 0 0 16px; }
        .rsvp .intro { max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.4; }
        .rsvp .intro + p:not(.intro) { margin-top: 38px; }

        .rsvp .form-title {
          font-weight: 700; font-size: 21px; letter-spacing: 0.14em;
          padding-left: 0.14em; margin: 84px 0 26px;
        }
        .rsvp form { margin-top: 0; }
        .rsvp label { display: block; font-size: 20px; }
        .rsvp input {
          display: block; width: 100%; box-sizing: border-box; height: 66px; margin-bottom: 40px;
          border: 0; border-bottom: 1px solid ${FAZENDA}; border-radius: 0;
          background: transparent; color: ${FAZENDA};
          font: inherit; font-size: 20px; text-align: center; outline: none;
        }
        .rsvp button {
          width: 100%; height: 70px; margin-top: 8px; border: 0; border-radius: 0;
          background: ${FAZENDA}; color: #fff; font: inherit; font-size: 20px; cursor: pointer;
        }
        .rsvp button:disabled { opacity: 0.6; cursor: default; }
        .rsvp .msg { margin-top: 24px; font-size: 18px; }

        @media (max-width: 480px) {
          .rsvp .logo { width: 190px; }
          .rsvp .t-main { font-size: 26px; }
          .rsvp .t-at { font-size: 16px; margin: 16px 0 14px; }
          .rsvp .t-logo { height: 18px; }
        }
      `}</style>

      <div className="rsvp-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logo" src="/fazenda-scene-brazilwood.png" alt="Fazenda" />

        <h1 className="title">
          <span className="t-main">{EVENT_NAME}</span>
          <span className="t-at">at</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="t-logo" src="/boochbags/fazenda.png" alt="Fazenda" />
        </h1>

        <p className="intro">{EVENT_INTRO}</p>
        <p className="intro">
          Come for drinks and an exclusive first look at their{" "}
          <a href={COLLECTION_URL} target="_blank" rel="noopener noreferrer">
            collection
          </a>
          .
        </p>
        <p>{EVENT_TIME}</p>
        <p>{EVENT_ADDRESS}</p>

        <p className="form-title">RSVP</p>

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
