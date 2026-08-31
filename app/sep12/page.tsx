"use client"

import { useEffect, useState } from "react"

/* The Fazenda palette, sampled from the wordmark artwork.
   bianco / limestone / white are omitted — they are invisible on white. */
const PALETTE = [
  "#43150E", // tobacco
  "#264D9D", // azulejo
  "#5D0A21", // brazilwood
  "#71973E", // chlorophyll
  "#B78FAC", // wisteria
  "#040707", // black
  "#6FA5A9", // turquoise
  "#5B321F", // cacao
  "#E0C991", // naples
  "#36602E", // terreverte
]

const HOLD = 3 // seconds each colour is held
const CYCLE = PALETTE.length * HOLD
const FADE = 1.6 // % of the cycle spent crossfading

/* Each colour holds its slot, then crossfades briefly into the next. */
const colourKeyframes = `@keyframes wordmark-cycle {\n${PALETTE.map((c, i) => {
  const at = (i * 100) / PALETTE.length
  return `  ${at}%, ${(at + 100 / PALETTE.length - FADE).toFixed(2)}% { background-color: ${c}; }`
}).join("\n")}\n  100% { background-color: ${PALETTE[0]}; }\n}`

const HEAD = ["SEPTEMBER 12 2026", "OPENING DAY EVENT", "RSVP FOR DJ, DRINKS, AND SPECIAL GUESTS"]
const BODY =
  "Please join us for the Fazenda opening event! We'll be open starting 8am, please stop by for a morning coffee or come later in the day for some more coffee or snacks."

const FULL = HEAD.join("\n") + "\n\n" + BODY

export default function Sep12() {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (n >= FULL.length) return
    const gap = FULL[n] === "\n" ? 220 : 42
    const t = setTimeout(() => setN((c) => c + 1), gap)
    return () => clearTimeout(t)
  }, [n])

  const typed = FULL.slice(0, n)
  const [headTyped, bodyTyped = ""] = typed.split("\n\n")
  const headLines = headTyped.split("\n")
  const done = n >= FULL.length

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <style>{`
        @keyframes caret { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
        .caret { animation: caret 1s step-end infinite; }

        ${colourKeyframes}

        /* The wordmark is painted as a background colour showing through the
           artwork's own alpha, so every brand colour renders from one asset. */
        .scene, .wordmark {
          width: 100%;
          background-color: ${PALETTE[0]};
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: contain;
          mask-size: contain;
          /* one shared animation, so both always show the same colour */
          animation: wordmark-cycle ${CYCLE}s linear infinite;
        }
        .scene {
          max-width: 270px;
          aspect-ratio: 1101 / 460;
          -webkit-mask-image: url(/fazenda-scene-mask.png);
          mask-image: url(/fazenda-scene-mask.png);
        }
        .wordmark {
          max-width: 220px;
          aspect-ratio: 1446 / 182;
          -webkit-mask-image: url(/fazenda-w2-mask.png);
          mask-image: url(/fazenda-w2-mask.png);
        }

        @media (prefers-reduced-motion: reduce) {
          .caret, .scene, .wordmark { animation: none }
        }
      `}</style>

      <div className="flex flex-col items-center gap-10 text-[#5c3317] text-xs text-center leading-relaxed w-full max-w-sm -mt-10">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="scene" role="img" aria-label="Fazenda farmhouse" />
          <div className="wordmark" role="img" aria-label="Fazenda" />
        </div>

        <div className="flex flex-col items-center gap-6 w-full">
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
      </div>
    </main>
  )
}
