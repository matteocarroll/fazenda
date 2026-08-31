"use client"

import { useEffect, useState } from "react"
import { BUFFALO, GAIT, type Buffalo } from "./buffalo"

/* One buffalo: the original artwork with its real legs cut out and re-hung
   at the hip, so each leg swings as the herd crosses the page. */
function Buffalo({
  data,
  width,
  duration,
  stride,
  delay,
  bottom,
}: {
  data: Buffalo
  width: number
  duration: number
  /* seconds per full leg cycle — tuned to the crossing speed so hooves
     don't skate along the ground */
  stride: number
  delay: number
  bottom: number
}) {
  const s = width / data.w

  return (
    <div
      className="buf"
      style={{
        bottom,
        width,
        height: data.h * s,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        className="buf-bob"
        style={{ animationDuration: `${stride / 2}s`, animationDelay: `${delay}s` }}
      >
        {data.legs.map((leg, i) => (
          <img
            key={leg.src}
            src={leg.src}
            alt=""
            className="buf-leg"
            style={{
              left: leg.x * s,
              top: leg.y * s,
              width: leg.w * s,
              height: leg.h * s,
              transformOrigin: `${leg.px * s}px ${leg.py * s}px`,
              animationDuration: `${stride}s`,
              animationDelay: `${delay + GAIT[i] * stride}s`,
            }}
          />
        ))}
        <img src={data.body} alt="" className="buf-body" style={{ width }} />
      </div>
    </div>
  )
}

const HEAD = ["September 12 2026", "Opening Day Event", "RSVP for DJ, Drinks, and Special Guests"]
const BODY =
  "Please join us for the Fazenda opening event! We'll be open starting 8am, please stop by for a morning coffee or come later in the day for some more coffee or snacks."

const FULL = HEAD.join("\n") + "\n\n" + BODY

export default function Sep12() {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (n >= FULL.length) return
    const gap = FULL[n] === "\n" ? 130 : 22
    const t = setTimeout(() => setN((c) => c + 1), gap)
    return () => clearTimeout(t)
  }, [n])

  const typed = FULL.slice(0, n)
  const [headTyped, bodyTyped = ""] = typed.split("\n\n")
  const headLines = headTyped.split("\n")
  const done = n >= FULL.length

  return (
    <main className="min-h-screen bg-white overflow-hidden relative flex items-center justify-center px-6">
      <style>{`
        @keyframes buf-cross {
          from { transform: translateX(-46vw); }
          to   { transform: translateX(112vw); }
        }
        @keyframes buf-step {
          0%   { transform: rotate(-15deg); }
          50%  { transform: rotate(15deg); }
          100% { transform: rotate(-15deg); }
        }
        @keyframes buf-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        @keyframes caret { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }

        .buf {
          position: absolute;
          left: 0;
          animation-name: buf-cross;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .buf-bob {
          position: relative;
          width: 100%;
          height: 100%;
          animation-name: buf-bob;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .buf-leg {
          position: absolute;
          animation-name: buf-step;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .buf-body { position: absolute; left: 0; top: 0; height: auto; }
        .caret { animation: caret 1s step-end infinite; }

        @media (prefers-reduced-motion: reduce) {
          .buf, .buf-bob, .buf-leg, .caret { animation: none !important; }
        }
      `}</style>

      {/* Event details, centred in the viewport */}
      <div className="flex flex-col items-center gap-6 text-[#5c3317] text-xs text-center leading-relaxed w-full max-w-sm -mt-10">
        <div className="flex flex-col gap-1.5 min-h-[64px]">
          {headLines.map((line, i) => (
            <p key={i} className="font-semibold text-sm tracking-wide">
              {line}
              {!done && bodyTyped === "" && i === headLines.length - 1 && (
                <span className="caret">|</span>
              )}
            </p>
          ))}
        </div>
        <p className="min-h-[48px]">
          {bodyTyped}
          {!done && bodyTyped !== "" && <span className="caret">|</span>}
        </p>
      </div>

      {/* The herd walks along the foot of the page */}
      <div className="absolute inset-x-0 bottom-10 h-[130px] pointer-events-none select-none">
        <Buffalo data={BUFFALO.lead} width={210} duration={30} stride={1.45} delay={0} bottom={0} />
        <Buffalo data={BUFFALO.baby} width={116} duration={30} stride={0.85} delay={-8} bottom={0} />
        <Buffalo data={BUFFALO.rear} width={196} duration={30} stride={1.4} delay={-16} bottom={0} />
      </div>
    </main>
  )
}
