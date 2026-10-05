"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const TOBACCO = "#43150E"
const LIMESTONE = "#F7E5C0"
const NAPLES = "#E0C991"

type Drinker = { id: string; name: string; beer: number; wine: number }
type DrinkType = "beer" | "wine"

const PIN_KEY = "bynight-pin"

export default function Tally() {
  const [pin, setPin] = useState<string | null>(null)
  const [pinInput, setPinInput] = useState("")
  const [people, setPeople] = useState<Drinker[]>([])
  const [query, setQuery] = useState("")
  const [error, setError] = useState("")
  const pending = useRef(0)

  useEffect(() => {
    try {
      setPin(localStorage.getItem(PIN_KEY))
    } catch {
      /* private mode: ask for the PIN each visit */
    }
  }, [])

  /* Picks up taps from other staff phones. Skipped while our own taps are
     in flight so a stale read doesn't undo them on screen. */
  const load = useCallback(async () => {
    if (pending.current > 0) return
    try {
      const res = await fetch("/api/bynight", { cache: "no-store" })
      const data = await res.json()
      if (data.people && pending.current === 0) setPeople(data.people)
    } catch {
      /* next poll will retry */
    }
  }, [])

  useEffect(() => {
    if (!pin) return
    load()
    const t = setInterval(load, 3000)
    return () => clearInterval(t)
  }, [pin, load])

  const bump = async (id: string, type: DrinkType, delta: 1 | -1) => {
    setError("")
    setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, [type]: Math.max(0, p[type] + delta) } : p)))
    pending.current++
    try {
      const res = await fetch("/api/bynight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, delta, pin }),
      })
      const data = await res.json()
      if (res.status === 401) {
        try {
          localStorage.removeItem(PIN_KEY)
        } catch {}
        setPin(null)
        setError("Wrong PIN")
        return
      }
      if (!res.ok) throw new Error(data.error)
      setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, [type]: data.count } : p)))
    } catch {
      setError("Couldn't save — check connection and tap again")
    } finally {
      pending.current--
      if (pending.current === 0) load()
    }
  }

  const savePin = (e: React.FormEvent) => {
    e.preventDefault()
    const p = pinInput.trim()
    if (!p) return
    try {
      localStorage.setItem(PIN_KEY, p)
    } catch {}
    setPin(p)
    setError("")
  }

  const shown = people.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <main className="tally min-h-screen px-4 py-8" style={{ backgroundColor: TOBACCO, color: LIMESTONE }}>
      <style>{`
        .tally { font-family: "Times New Roman", Times, serif; }
        .tally input { background: transparent; border: 1px solid rgba(247,229,192,.3); color: ${LIMESTONE}; outline: none; }
        .tally input:focus { border-color: ${NAPLES}; }
        .btn { width: 44px; height: 44px; border: 1px solid rgba(247,229,192,.3); font-size: 1.25rem; line-height: 1;
               -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .btn:active { background: rgba(224,201,145,.25); }
        .plus { border-color: ${NAPLES}; color: ${NAPLES}; }
      `}</style>

      <div className="mx-auto w-full max-w-md">
        <h1 className="text-center uppercase" style={{ letterSpacing: "0.12em", color: NAPLES }}>
          By Night · Tally
        </h1>

        {error && (
          <p className="mt-4 text-center text-sm" style={{ color: "#F2A48A" }}>
            {error}
          </p>
        )}

        {!pin ? (
          <form onSubmit={savePin} className="mt-10 flex flex-col items-center gap-3">
            <label className="text-xs uppercase" style={{ letterSpacing: "0.14em", opacity: 0.7 }}>
              Staff PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-40 px-3 py-2 text-center text-lg"
            />
            <button type="submit" className="btn plus" style={{ width: 160 }}>
              Enter
            </button>
          </form>
        ) : (
          <>
            <input
              type="search"
              placeholder="Search name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-6 w-full px-3 py-2 text-base"
            />
            <ul className="mt-4">
              {shown.map((p) => (
                <li key={p.id} className="py-3" style={{ borderTop: "1px solid rgba(247,229,192,.15)" }}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate uppercase" style={{ letterSpacing: "0.04em" }}>
                      {p.name}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums" style={{ opacity: 0.5 }}>
                      {p.beer + p.wine} total
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    {(["beer", "wine"] as const).map((type) => (
                      <span key={type} className="flex items-center gap-1.5">
                        <span className="w-6 text-lg" aria-hidden>
                          {type === "beer" ? "🍺" : "🍷"}
                        </span>
                        <button className="btn" aria-label={`Remove ${type} from ${p.name}`} onClick={() => bump(p.id, type, -1)}>
                          −
                        </button>
                        <span className="w-7 text-center tabular-nums text-lg">{p[type]}</span>
                        <button className="btn plus" aria-label={`Add ${type} for ${p.name}`} onClick={() => bump(p.id, type, 1)}>
                          +
                        </button>
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            {people.length > 0 && shown.length === 0 && (
              <p className="mt-6 text-center text-sm" style={{ opacity: 0.6 }}>
                No one matches “{query}”
              </p>
            )}
          </>
        )}
      </div>
    </main>
  )
}
