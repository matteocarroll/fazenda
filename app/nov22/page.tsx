import { cookies } from "next/headers"
import type { Metadata } from "next"

import WalkingBuffalo from "@/components/WalkingBuffalo"

import Gate from "./Gate"
import Rsvp from "./Rsvp"

// ---- Edit these ----
const KICKER = "By Invitation Only"
const INVITATION =
  "As a token of appreciation for your support during Fazenda’s first few months, we’re opening the doors this Sunday for a private afternoon with friends and family."
const DETAIL =
  "Enjoy Friends & Family pricing across the store, plus coffee from the café."
const EVENT_DAY = "Sunday November 22"
const EVENT_TIME = "12 – 5PM"
const EVENT_ADDRESS = "177 Mott Street, New York"
/* Becomes the tab name in the RSVP sheet, so keep it stable once guests start replying. */
const EVENT_KEY = "Friends & Family - Nov 22"
const INK = "#000000"
// --------------------

export const metadata: Metadata = {
  title: "Friends & Family",
  /* Private page: keep it out of search results and link previews. */
  robots: { index: false, follow: false },
}

export default async function Nov22() {
  const unlocked = (await cookies()).get("gate_nov22")?.value === "1"

  return (
    <main className="ff">
      <style>{`
        /* Neue Haas Unica is licensed, so this is the chain the invite pages
           fall back to — near-identical on Mac and iOS. */
        .ff, .ff input, .ff button {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        /* Set on the document too, so iOS overscroll does not reveal grey. */
        html, body { background: #fff; }
        .ff {
          background: #fff;
          color: ${INK};
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 72px 20px 96px;
          -webkit-font-smoothing: antialiased;
        }
        .ff-inner { width: 100%; max-width: 27rem; text-align: center; }

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
        .detail {
          font-size: 13px; line-height: 20px; margin: 16px auto 0; max-width: 23rem;
        }
        .details {
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          line-height: 20px; margin: 32px 0 0;
        }

        .gate { margin-top: 64px; }
        .gate-label {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          margin: 0 0 20px;
        }
        .gate form { max-width: 14rem; margin: 0 auto; }
        .gate input { text-align: center; letter-spacing: 0.3em; }

        .rsvp { margin-top: 56px; text-align: left; }
        .rsvp h2 {
          font-weight: 400; font-size: 11px; letter-spacing: 0.22em;
          text-transform: uppercase; margin: 0 0 20px; text-align: center;
        }
        .field { margin-bottom: 20px; }
        .ff label {
          display: block; font-size: 11px; letter-spacing: 0.08em; margin-bottom: 4px;
        }
        .ff input {
          display: block; width: 100%; box-sizing: border-box;
          height: 32px; padding: 0;
          border: 0; border-bottom: 1px solid ${INK}; border-radius: 0;
          background: transparent; color: ${INK};
          font: inherit; font-size: 13px; text-align: left; outline: none;
        }
        .ff input:focus { border-bottom-width: 2px; }
        .ff input:-webkit-autofill { -webkit-text-fill-color: ${INK}; transition: background-color 9999s; }
        .ff button {
          width: 100%; height: 40px; margin-top: 28px;
          border: 1px solid ${INK}; border-radius: 0;
          background: ${INK}; color: #fff;
          font: inherit; font-size: 11px; letter-spacing: 0.08em;
          cursor: pointer; transition: background-color 0.15s, color 0.15s;
        }
        .ff button:hover { background: #fff; color: ${INK}; }
        .ff button:disabled { opacity: 0.45; cursor: default; background: ${INK}; color: #fff; }
        .msg { font-size: 13px; line-height: 20px; margin-top: 20px; text-align: center; }
      `}</style>

      <div className="ff-inner">
        <WalkingBuffalo className="scene" />
        <div className="wordmark" role="img" aria-label="Fazenda" />

        {unlocked ? (
          <>
            <p className="kicker">{KICKER}</p>
            <p className="invitation">{INVITATION}</p>
            <p className="detail">{DETAIL}</p>

            <p className="details">
              {EVENT_DAY}
              <br />
              {EVENT_TIME}
              <br />
              {EVENT_ADDRESS}
            </p>

            <Rsvp eventKey={EVENT_KEY} />
          </>
        ) : (
          <Gate />
        )}
      </div>
    </main>
  )
}
