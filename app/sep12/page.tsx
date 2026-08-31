"use client"

import { useEffect, useState } from "react"

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
        @media (prefers-reduced-motion: reduce) { .caret { animation: none } }
      `}</style>

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
    </main>
  )
}
