"use client"

import { useState } from "react"

// ---- Edit these ----
const HEADLINE = "Happy Hour"
const HOSTS = "with Clayton, Zac and Kirk"
const EVENT_DATE = "THURSDAY, NOVEMBER 12 2026"
const EVENT_TIME = "5 – 7PM"
const EVENT_ADDRESS = "177 Mott Street, New York"
/* Becomes the tab name in the RSVP sheet, so keep it stable once guests start replying. */
const EVENT_KEY = "Happy Hour with Clayton, Zac and Kirk - Nov 12"
const BROWN = "#5c3317"
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
        /* Set on the inputs and button too — browsers give form controls their
           own font otherwise. */
        .hh, .hh input, .hh button {
          font-family: "Times New Roman", Times, serif;
        }
        .hh {
          background: #fff;
          color: ${BROWN};
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 56px 16px 80px;
        }
        .hh-inner { width: 100%; max-width: 32rem; text-align: center; }

        /* The artwork is painted as a background colour showing through its own
           alpha, so the mark renders from a single asset in the brand colour. */
        .scene, .wordmark {
          width: 100%;
          background-color: ${BROWN};
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          -webkit-mask-position: center; mask-position: center;
          -webkit-mask-size: contain; mask-size: contain;
          margin-inline: auto;
        }
        .scene {
          max-width: 270px;
          aspect-ratio: 1101 / 460;
          -webkit-mask-image: url(/fazenda-scene-mask.png);
          mask-image: url(/fazenda-scene-mask.png);
        }
        .wordmark {
          max-width: 180px;
          aspect-ratio: 1446 / 182;
          margin-top: 12px;
          -webkit-mask-image: url(/fazenda-w2-mask.png);
          mask-image: url(/fazenda-w2-mask.png);
        }

        .hh h1 {
          font-weight: 400; font-size: clamp(1.75rem, 7vw, 2.5rem);
          letter-spacing: 0.02em; margin: 44px 0 0;
        }
        .hosts { font-size: clamp(1rem, 4vw, 1.25rem); margin: 10px 0 0; }
        .when { font-size: clamp(0.875rem, 3.4vw, 1rem); letter-spacing: 0.06em; margin: 36px 0 0; }
        .time { font-size: clamp(1.25rem, 5.5vw, 1.75rem); letter-spacing: 0.04em; margin: 8px 0 0; }
        .address { font-size: clamp(0.875rem, 3.4vw, 1rem); margin: 20px 0 0; }

        .rsvp { margin-top: 56px; }
        .rsvp h2 {
          font-weight: 400; font-size: 1.25rem; letter-spacing: 0.14em;
          text-transform: uppercase; margin: 0 0 24px;
        }
        .hh form { max-width: 20rem; margin: 0 auto; text-align: left; }
        .field { margin-bottom: 26px; }
        .hh label {
          display: block; font-size: 0.6875rem; letter-spacing: 0.16em;
          text-transform: uppercase; opacity: 0.5; margin-bottom: 2px;
        }
        .hh input {
          display: block; width: 100%; box-sizing: border-box;
          height: 40px; padding: 0;
          border: 0; border-bottom: 1px solid rgba(92, 51, 23, 0.25); border-radius: 0;
          background: transparent; color: ${BROWN};
          font: inherit; font-size: 1.0625rem; text-align: left; outline: none;
          transition: border-color 0.2s ease;
        }
        .hh input:focus { border-bottom-color: ${BROWN}; }
        .hh input:-webkit-autofill { -webkit-text-fill-color: ${BROWN}; transition: background-color 9999s; }
        .hh button {
          width: 100%; height: 52px; margin-top: 14px;
          border: 1px solid ${BROWN}; border-radius: 0;
          background: ${BROWN}; color: #fff;
          font: inherit; font-size: 0.8125rem; letter-spacing: 0.2em;
          text-transform: uppercase; cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .hh button:hover { background: transparent; color: ${BROWN}; }
        .hh button:disabled { opacity: 0.45; cursor: default; background: ${BROWN}; color: #fff; }
        .msg { font-size: 1rem; line-height: 1.5; margin-top: 20px; }
      `}</style>

      <div className="hh-inner">
        <div className="scene" role="img" aria-label="Fazenda farmhouse" />
        <div className="wordmark" role="img" aria-label="Fazenda" />

        <h1>{HEADLINE}</h1>
        <p className="hosts">{HOSTS}</p>

        <p className="when">{EVENT_DATE}</p>
        <p className="time">{EVENT_TIME}</p>
        <p className="address">{EVENT_ADDRESS}</p>

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
                {status === "sending" ? "Sending..." : "RSVP"}
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
