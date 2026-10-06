"use client"

import { useEffect, useState } from "react"

import WalkingBuffalo from "@/components/WalkingBuffalo"

const TOBACCO = "#43150E"
const LIMESTONE = "#F7E5C0"
const NAPLES = "#E0C991"

type Drinker = { id: string; name: string; beer: number; wine: number }

/* Thursday Oct 8, 7pm New York (EDT, UTC−4). Until then the page is a
   countdown; at 7pm it turns into the leaderboard on its own. */
const STARTS_AT = Date.parse("2026-10-08T19:00:00-04:00")

function Countdown({ now }: { now: number }) {
  const left = Math.max(0, Math.floor((STARTS_AT - now) / 1000))
  const parts: [number, string][] = [
    [Math.floor(left / 86400), "Days"],
    [Math.floor((left % 86400) / 3600), "Hours"],
    [Math.floor((left % 3600) / 60), "Min"],
    [left % 60, "Sec"],
  ]
  return (
    <div className="mt-10 flex flex-col items-center">
      {/* The artwork is crimson; recolor it Naples so it reads on tobacco. */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <filter id="bynight-tint">
          <feFlood floodColor={NAPLES} />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </svg>
      <WalkingBuffalo className="w-[240px] sm:w-[340px] lg:w-[480px] max-w-full" style={{ filter: "url(#bynight-tint)" }} />

      <p className="mt-8" style={{ fontSize: "clamp(0.75rem, 1.6vw, 1.25rem)", letterSpacing: "0.16em" }}>
        Thursday, October 8 · 7 PM
      </p>

      <div className="mt-6 flex gap-5 sm:gap-10">
        {parts.map(([n, label]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="tabular-nums" style={{ fontSize: "clamp(2rem, 7vw, 5.5rem)", lineHeight: 1, color: NAPLES }}>
              {String(n).padStart(2, "0")}
            </span>
            <span className="mt-2" style={{ fontSize: "clamp(0.5625rem, 1.1vw, 0.875rem)", letterSpacing: "0.16em", opacity: 0.6 }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-10" style={{ fontSize: "clamp(0.625rem, 1.2vw, 0.9375rem)", letterSpacing: "0.14em", opacity: 0.6 }}>
        177 Mott Street, New York
      </p>

      <p className="mt-6" style={{ fontSize: "clamp(0.6875rem, 1.3vw, 1rem)", letterSpacing: "0.14em" }}>
        Haven&apos;t RSVP&apos;d yet?{" "}
        <a
          href="/events"
          className="underline underline-offset-4 hover:opacity-70 transition-opacity"
          style={{ color: NAPLES }}
        >
          RSVP here
        </a>
      </p>
    </div>
  )
}

/* Rows are absolutely placed (by --row, which grows with the screen) so
   overtakes slide instead of jumping. */

export default function ByNight() {
  const [people, setPeople] = useState<Drinker[] | null>(null)
  /* Unknown until mounted, so the server render and first client render match. */
  const [now, setNow] = useState<number | null>(null)
  const live = now !== null && now >= STARTS_AT

  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!live) return
    let alive = true
    const load = async () => {
      try {
        const res = await fetch("/api/bynight", { cache: "no-store" })
        const data = await res.json()
        if (alive && data.people) setPeople(data.people)
      } catch {
        /* keep showing the last board until the next poll */
      }
    }
    /* Background tabs skip polls; coming back refreshes at once. */
    const poll = () => !document.hidden && load()
    load()
    const t = setInterval(poll, 1500)
    document.addEventListener("visibilitychange", poll)
    return () => {
      alive = false
      clearInterval(t)
      document.removeEventListener("visibilitychange", poll)
    }
  }, [live])

  const ranked = (people ?? [])
    .map((p) => ({ ...p, total: p.beer + p.wine }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))

  /* Ties share a rank: 1, 2, 2, 4. */
  const rankOf = ranked.map((p, i) => ranked.findIndex((q) => q.total === p.total) + 1)

  return (
    <main
      className="bynight min-h-screen px-4 py-12"
      style={{ backgroundColor: TOBACCO, color: LIMESTONE }}
    >
      <style>{`
        .bynight { --row: clamp(52px, 8vh, 96px); font-family: "Times New Roman", Times, serif; text-transform: uppercase; }
        .row { border-top: 1px solid rgba(247, 229, 192, 0.15); transition: transform 600ms cubic-bezier(.2,.8,.2,1); }
      `}</style>

      <div className="mx-auto w-full max-w-2xl lg:max-w-4xl">
        <header className="text-center">
          <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 4rem)", letterSpacing: "0.12em", color: NAPLES }}>
            Fazenda By Night
          </h1>
          {live && (
            <p className="mt-2" style={{ fontSize: "clamp(0.625rem, 1.4vw, 1.125rem)", letterSpacing: "0.16em", opacity: 0.6 }}>
              Most drinks tonight · Beer + Wine
            </p>
          )}
        </header>

        {now !== null && !live && <Countdown now={now} />}

        {live && ranked.length > 0 && (
          <>
            <div
              className="mt-10 flex items-center gap-3 pb-2"
              style={{ fontSize: "clamp(0.625rem, 1.2vw, 1rem)", letterSpacing: "0.14em", opacity: 0.5 }}
            >
              <span style={{ minWidth: "2em" }} />
              <span className="flex-1" />
              <span className="w-12 lg:w-24 text-center">Beer</span>
              <span className="w-12 lg:w-24 text-center">Wine</span>
              <span className="w-14 lg:w-28 text-right">Total</span>
            </div>
            <ol className="relative" style={{ height: `calc(${ranked.length} * var(--row))` }}>
              {ranked.map((p, i) => {
                const top3 = p.total > 0 && rankOf[i] <= 3
                return (
                  <li
                    key={p.id}
                    className="row absolute inset-x-0 flex items-center gap-3"
                    style={{ height: "var(--row)", transform: `translateY(calc(${i} * var(--row)))` }}
                  >
                    <span
                      className="tabular-nums text-center"
                      style={{
                        minWidth: "2em",
                        fontSize: "clamp(0.875rem, 2.4vw, 2rem)",
                        color: top3 ? NAPLES : LIMESTONE,
                        opacity: top3 ? 1 : 0.45,
                      }}
                    >
                      {p.total > 0 ? rankOf[i] : "–"}
                    </span>
                    <span
                      className="flex-1 truncate"
                      style={{ fontSize: "clamp(0.9375rem, 2.8vw, 2.5rem)", letterSpacing: "0.04em", color: top3 ? NAPLES : LIMESTONE }}
                    >
                      {p.name}
                    </span>
                    <span className="w-12 lg:w-24 text-center tabular-nums" style={{ opacity: 0.75, fontSize: "clamp(0.875rem, 2vw, 1.75rem)" }}>
                      {p.beer}
                    </span>
                    <span className="w-12 lg:w-24 text-center tabular-nums" style={{ opacity: 0.75, fontSize: "clamp(0.875rem, 2vw, 1.75rem)" }}>
                      {p.wine}
                    </span>
                    <span
                      className="w-14 lg:w-28 text-right tabular-nums"
                      style={{ fontSize: "clamp(1.125rem, 3.2vw, 3rem)", color: top3 ? NAPLES : LIMESTONE }}
                    >
                      {p.total}
                    </span>
                  </li>
                )
              })}
            </ol>
          </>
        )}

        {live && (
          <footer className="mt-10 text-center" style={{ fontSize: "0.625rem", letterSpacing: "0.14em", opacity: 0.5 }}>
            Live
          </footer>
        )}
      </div>
    </main>
  )
}
