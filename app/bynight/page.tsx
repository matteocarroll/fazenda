"use client"

import { useRef, useState } from "react"

// ---- Edit these ----
const EVENT_INTRO = [
  "Please join us for our wine night. We’re welcoming our dear friend João Diniz (Donaflor) who will be playing.",
  "This will be a private event. If you don’t RSVP you will not be allowed in.",
]
/* Shown large under the RSVP heading. Each entry is its own line. */
const EVENT_DATE = ["Oct 22nd", "7pm"]
const EVENT_DETAILS = "177 Mott Street, New York"
/* Becomes the tab name in the RSVP sheet, so keep it stable once guests start replying. */
const EVENT_KEY = "DONAFLOR at Fazenda"
const INK = "#000000"
const PURPLE = "#5B2C87"
// --------------------

type Status = "idle" | "sending" | "done" | "error"

export default function ByNight() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [status, setStatus] = useState<Status>("idle")
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  function toggleTrack() {
    const el = audio.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }

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
          color: ${INK};
          min-height: 100vh;
          font-family: "Times New Roman", Times, serif;
        }
        .rsvp-inner { max-width: 560px; margin: 0 auto; padding: 50px 16px 80px; text-align: center; }
        .rsvp .flower { width: 260px; max-width: 80%; height: auto; display: block; margin: 0 auto 28px; }
        .rsvp .collab {
          display: flex; align-items: center; justify-content: center;
          gap: 22px; flex-wrap: nowrap; min-height: 90px;
        }
        .rsvp .logo-donaflor { height: 42px; width: auto; }
        .rsvp .logo-fazenda  { height: 21px; width: auto; }
        .rsvp .sep { font-size: 24px; }
        @media (max-width: 480px) {
          .rsvp .flower { width: 190px; margin-bottom: 18px; }
          .rsvp .collab { gap: 12px; }
          .rsvp .logo-donaflor { height: 30px; }
          .rsvp .logo-fazenda  { height: 15px; }
          .rsvp .sep { font-size: 18px; }
        }
        .rsvp h1 { font-weight: 400; font-size: 38px; letter-spacing: 0.08em; margin: 34px 0 18px; }
        .rsvp .date { margin: 0 0 28px; text-transform: uppercase; }
        .rsvp .track { margin: 0 0 28px; }
        .rsvp .track button {
          width: auto; height: auto; margin: 0 auto;
          display: inline-block;
          background: none; color: ${PURPLE}; border: 0; padding: 10px 8px;
          font: inherit; font-size: 20px; font-weight: 700; cursor: pointer;
        }
        .rsvp .track button:hover { opacity: 0.6; }
        .rsvp .track .title { text-decoration: underline; text-underline-offset: 4px; }
        .rsvp .date span { display: block; font-size: 38px; line-height: 1.15; letter-spacing: 0.02em; }
        .rsvp p  { font-size: 17px; margin: 0 0 14px; }
        .rsvp form { margin-top: 50px; }
        .rsvp label { display: block; font-size: 20px; margin-bottom: 0; }
        .rsvp input {
          display: block; width: 100%; box-sizing: border-box;
          height: 66px; margin-bottom: 40px;
          border: 0; border-bottom: 1px solid ${INK};
          background: transparent; color: ${INK};
          font: inherit; font-size: 20px; text-align: center; outline: none;
        }
        .rsvp button {
          width: 100%; height: 70px; margin-top: 8px;
          border: 0; background: ${INK}; color: #fff;
          font: inherit; font-size: 20px; cursor: pointer;
        }
        .rsvp button:disabled { opacity: 0.6; cursor: default; }
        .rsvp .msg { margin-top: 24px; font-size: 17px; font-weight: 700; }
        @media (max-width: 480px) {
          .rsvp h1 { font-size: 28px; }
          .rsvp .date span { font-size: 28px; }
        }
      `}</style>

      <div className="rsvp-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="flower" src="/bynight/flower.png" alt="" aria-hidden="true" />

        <div className="collab">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-donaflor" src="/bynight/donaflor.png" alt="DONAFLOR" />
          <span className="sep">at</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo-fazenda" src="/bynight/fazenda.png" alt="Fazenda" />
        </div>

        <h1>RSVP</h1>
        <div className="date">
          {EVENT_DATE.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div className="track">
          <audio
            ref={audio}
            src="/bynight/brasil.m4a"
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
          <button type="button" onClick={toggleTrack} aria-pressed={playing}>
            <span className="title">Listen to Donaflor</span>
          </button>
        </div>
        {EVENT_INTRO.map((line) => (
          <p key={line}>{line}</p>
        ))}
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
