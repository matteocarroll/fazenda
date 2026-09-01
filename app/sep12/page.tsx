"use client"

import { useState } from "react"

/* Tobacco, sampled from the wordmark artwork. */
const LOGO_COLOUR = "#43150E"

const HEADLINE = "OPENING DAY EVENT"

const INTRO = [
  "Please join us for the Fazenda opening on Saturday, Sep 12. Food and drinks will be offered throughout the day.",
  "Please rsvp below as it is a listed event. We'll be open all day so stop by whenever suits. We hope to see you soon!",
  "Spend your Saturday at Fazenda :)",
]

/* Sits under the illustration, the way an invitation carries its details. */
const DETAILS = ["VINYL, FOOD, DRINKS, CLOTHES", "177 MOTT, 10012", "MULTIBRAND MENSWEAR STORE"]

export default function Sep12() {
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

  return (
    <main className="sep12 min-h-screen bg-white flex justify-center px-6 py-12">
      <style>{`
        /* Times New Roman, matching the rest of the site. Set on the page
           root so the form fields and button inherit it too — browsers give
           form controls their own font otherwise. */
        .sep12, .sep12 input, .sep12 button {
          font-family: "Times New Roman", Times, serif;
        }

        /* The artwork is painted as a background colour showing through its
           own alpha, so the mark renders from a single asset. */
        .scene, .wordmark {
          width: 100%;
          background-color: ${LOGO_COLOUR};
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-position: center;
          mask-position: center;
          -webkit-mask-size: contain;
          mask-size: contain;
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
      `}</style>

      <div className="my-auto flex flex-col items-center text-[#5c3317] text-xs text-center leading-relaxed w-full max-w-lg">
        {/* brand lockup */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="scene" role="img" aria-label="Fazenda farmhouse" />
          <div className="wordmark" role="img" aria-label="Fazenda" />
        </div>

        <h1 className="mt-12 text-2xl">{HEADLINE}</h1>

        <div className="mt-6 flex flex-col gap-3 max-w-sm">
          {INTRO.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>

        <p className="mt-12 text-xl">SEPTEMBER 12 2026</p>

        <div className="mt-5 flex flex-col gap-2">
          {DETAILS.map((line) => (
            <p key={line} className="tracking-wide">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 w-full">

        <div className="w-full max-w-xs flex flex-col items-center gap-3">
            {status === "done" ? (
              <p className="text-[#5c3317] text-xs leading-relaxed">
                Obrigado, you&apos;re on the list. See you on the 12th.
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
