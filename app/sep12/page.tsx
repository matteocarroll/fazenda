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

const HEAD = [
  "SEPTEMBER 12 2026",
  "OPENING DAY EVENT",
  "OPEN STARTING 8AM CLOTHING, COFFEE, SNACKS",
  "VINYL STARTING 5PM",
  "RSVP FOR DJ, DRINKS, AND SPECIAL GUESTS",
  "MULTIBRAND MENSWEAR STORE",
]
const BODY = [
  "Hello! Please join us for the Fazenda opening event on September 12th. Please stop by. We'll have some special guests and will be later joined by dj and vinyl. We hope to see you soon.",
  "It'll be a closed list starting 4pm so please make sure to rsvp. Please share to those interested!",
]

const FULL = [HEAD.join("\n"), ...BODY].join("\n\n")

export default function Sep12() {
  const [n, setN] = useState(0)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? "done" : "error")
    } catch {
      setStatus("error")
    }
  }

  useEffect(() => {
    if (n >= FULL.length) return
    const gap = FULL[n] === "\n" ? 220 : 42
    const t = setTimeout(() => setN((c) => c + 1), gap)
    return () => clearTimeout(t)
  }, [n])

  const typed = FULL.slice(0, n)
  const [headTyped, ...bodyTyped] = typed.split("\n\n")
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
          <div className="flex flex-col gap-1.5 min-h-[222px]">
            {headLines.map((line, i) => (
              <p key={i} className="font-semibold text-base tracking-wide">
                {line}
                {!done && bodyTyped.length === 0 && i === headLines.length - 1 && (
                  <span className="caret">|</span>
                )}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-4 min-h-[114px]">
            {bodyTyped.map((para, i) => (
              <p key={i}>
                {para}
                {!done && i === bodyTyped.length - 1 && <span className="caret">|</span>}
              </p>
            ))}
          </div>

        <div className="w-full max-w-xs flex flex-col items-center gap-3">
            {status === "done" ? (
              <p className="text-[#5c3317] text-xs leading-relaxed">
                Obrigado — you&apos;re on the list. See you on the 12th.
              </p>
            ) : (
              <form onSubmit={submit} className="w-full flex flex-col items-center gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-b border-[#5c3317]/40 bg-transparent text-[#5c3317] text-xs py-1.5 outline-none placeholder-[#5c3317]/50 text-center focus:border-[#5c3317] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border-b border-[#5c3317]/40 bg-transparent text-[#5c3317] text-xs py-1.5 outline-none placeholder-[#5c3317]/50 text-center focus:border-[#5c3317] transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border-b border-[#5c3317]/40 bg-transparent text-[#5c3317] text-xs py-1.5 outline-none placeholder-[#5c3317]/50 text-center focus:border-[#5c3317] transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-3 text-[#5c3317] text-xs tracking-wide font-semibold hover:opacity-70 transition-opacity disabled:opacity-40"
                >
                  {status === "sending" ? "SENDING..." : "RSVP"}
                </button>
                {status === "error" && (
                  <p className="text-[#5c3317] text-xs opacity-70">
                    Something went wrong — please try again.
                  </p>
                )}
              </form>
            )}
        </div>
        </div>
      </div>
    </main>
  )
}
