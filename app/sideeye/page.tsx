"use client"

import { useState } from "react"

// ---- Edit these ----
const EVENT_TITLE = ["Introducing Side Eye", "at Fazenda"]
const EVENT_DAY = "Thu. Nov 5"
const EVENT_TIME = "6-8PM"
/* Becomes the tab name in the RSVP sheet, so keep it stable once guests start replying. */
const EVENT_KEY = "Side Eye at Fazenda - Nov 5"
const BROWN = "#3F170D"
const CREAM = "#FFFFFF"
// --------------------

type Status = "idle" | "sending" | "done" | "error"

export default function SideEye() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" })
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
    <main className="page">
      <style>{`
        html, body { margin: 0; background: ${BROWN}; }
        .page {
          min-height: 100vh;
          background: ${BROWN};
          color: ${CREAM};
          /* Copperplate ships on iPhone and Mac, matching the flyer; elsewhere
             it falls back through the serifs below. */
          font-family: Copperplate, "Copperplate Gothic Light", "Copperplate Gothic", "Iowan Old Style", serif;
          -webkit-font-smoothing: antialiased;
        }
        .page-inner {
          max-width: 640px; margin: 0 auto;
          padding: clamp(56px, 11vw, 110px) 16px 90px;
          text-align: center;
        }
        .logo { display: block; width: clamp(140px, 30vw, 190px); height: auto; margin: 0 auto; }
        .page h1 {
          font-weight: 400; font-size: clamp(22px, 5.6vw, 34px);
          line-height: 1.05; letter-spacing: 0.03em; text-transform: uppercase;
          margin: clamp(48px, 10vw, 70px) 0 0;
        }
        .when {
          display: flex; justify-content: space-between;
          width: min(400px, 82%); margin: clamp(48px, 10vw, 66px) auto 0;
          font-size: clamp(16px, 3.8vw, 20px); letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .blurb {
          font-variant: small-caps; text-transform: lowercase;
          font-size: clamp(15px, 3.5vw, 18px); letter-spacing: 0.09em; line-height: 1.55;
          margin: clamp(44px, 9vw, 60px) auto 0; max-width: 470px;
        }
        .cap { text-transform: none; }
        .address {
          font-variant: small-caps;
          font-size: clamp(13px, 3vw, 15px); letter-spacing: 0.06em; line-height: 1.6;
          margin: clamp(36px, 7vw, 46px) 0 0;
        }
        .farmhouse { display: block; width: clamp(200px, 44vw, 270px); height: auto; margin: clamp(48px, 9vw, 60px) auto 0; }

        .rsvp { margin-top: clamp(56px, 11vw, 80px); }
        .rsvp h2 {
          font-weight: 400; font-size: 18px; letter-spacing: 0.18em;
          text-transform: uppercase; margin: 0 0 28px;
        }
        .page form { max-width: 440px; margin: 0 auto; }
        .page label {
          display: block; font-variant: small-caps; text-transform: lowercase;
          font-size: 16px; letter-spacing: 0.1em;
        }
        .page input {
          display: block; width: 100%; height: 48px; margin: 0 0 30px;
          border: 0; border-bottom: 1px solid rgba(255,255,255,.75); border-radius: 0;
          background: transparent; color: ${CREAM};
          font: inherit; font-size: 17px; letter-spacing: 0.04em; text-align: center; outline: none;
        }
        .page input:focus { border-bottom-color: ${CREAM}; }
        .page button {
          width: 100%; height: 56px; margin-top: 10px;
          border: 0; border-radius: 0; background: ${CREAM}; color: ${BROWN};
          font: inherit; font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer;
        }
        .page button:hover { opacity: .9; }
        .page button:disabled { opacity: .6; cursor: default; }
        .msg {
          font-variant: small-caps; text-transform: lowercase;
          font-size: 16px; letter-spacing: 0.08em; line-height: 1.5; margin-top: 24px;
        }
      `}</style>

      <div className="page-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logo" src="/sideeye/side-eye.png" alt="Side Eye New York" />

        <h1>
          {EVENT_TITLE[0]}
          <br />
          {EVENT_TITLE[1]}
        </h1>

        <div className="when">
          <span>{EVENT_DAY}</span>
          <span>{EVENT_TIME}</span>
        </div>

        <p className="blurb">
          <span className="cap">J</span>oin us for an intimate evening of drinks,
          <br />
          explore the collection, and discover <span className="cap">F</span>azenda
        </p>

        <p className="address">
          177 <span className="cap">M</span>ott <span className="cap">S</span>t
          <br />
          <span className="cap">N</span>ew <span className="cap">Y</span>ork, NY 10012
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="farmhouse" src="/sideeye/farmhouse.png" alt="Fazenda" />

        <section className="rsvp">
          <h2>RSVP</h2>

          {status === "done" ? (
            <p className="msg">
              <span className="cap">T</span>hank you, {form.name.split(" ")[0]}. You are on the
              list — see you there.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">
                <span className="cap">N</span>ame
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={update}
              />

              <label htmlFor="phone">
                <span className="cap">P</span>hone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={update}
              />

              <label htmlFor="email">
                <span className="cap">E</span>mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={update}
              />

              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "RSVP"}
              </button>

              {status === "error" && (
                <p className="msg">
                  <span className="cap">T</span>hat did not go through. Check your connection and
                  try again.
                </p>
              )}
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
