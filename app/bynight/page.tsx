"use client"

import { useEffect, useState } from "react"

const TOBACCO = "#43150E"
const LIMESTONE = "#F7E5C0"
const NAPLES = "#E0C991"

type Drinker = { id: string; name: string; beer: number; wine: number }

/* Rows are absolutely placed (by --row, which grows with the screen) so
   overtakes slide instead of jumping. */

export default function ByNight() {
  const [people, setPeople] = useState<Drinker[] | null>(null)

  useEffect(() => {
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
  }, [])

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
          <p className="mt-2" style={{ fontSize: "clamp(0.625rem, 1.4vw, 1.125rem)", letterSpacing: "0.16em", opacity: 0.6 }}>
            Most drinks tonight · Beer + Wine
          </p>
        </header>

        {ranked.length > 0 && (
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

        <footer className="mt-10 text-center" style={{ fontSize: "0.625rem", letterSpacing: "0.14em", opacity: 0.5 }}>
          Live
        </footer>
      </div>
    </main>
  )
}
