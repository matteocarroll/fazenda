const TOBACCO = "#43150E"
const LIMESTONE = "#F7E5C0"
const NAPLES = "#E0C991"

/* Mockup — invented figures. */
const PEOPLE = [
  { name: "Maggie", coffees: 23 },
  { name: "Matteo", coffees: 19 },
  { name: "Joelle", coffees: 17 },
  { name: "Cassio D.", coffees: 12 },
  { name: "Mimi R.", coffees: 9 },
  { name: "Neil A.", coffees: 8 },
  { name: "Demetra K.", coffees: 6 },
  { name: "Seth M.", coffees: 4 },
  { name: "Alex H.", coffees: 3 },
  { name: "Carlo B.", coffees: 1 },
]

const RANKED = [...PEOPLE].sort((a, b) => b.coffees - a.coffees)

/* A bundle of five: four uprights struck through. Partial bundles just drop
   the strike and the unused uprights. */
function Bundle({ n }: { n: number }) {
  const W = 11 + 5 * 4
  return (
    <svg width={W} height="26" viewBox={`0 0 ${W} 26`} fill="none" aria-hidden>
      {Array.from({ length: Math.min(n, 4) }).map((_, i) => (
        <line
          key={i}
          x1={4 + i * 5}
          y1="3"
          x2={4 + i * 5}
          y2="23"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ))}
      {n === 5 && (
        <line x1="1" y1="21" x2={W - 2} y2="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  )
}

function Tally({ count }: { count: number }) {
  const bundles = Array.from({ length: Math.floor(count / 5) }, () => 5)
  const rest = count % 5
  if (rest) bundles.push(rest)
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {bundles.map((n, i) => (
        <Bundle key={i} n={n} />
      ))}
    </span>
  )
}

export default function Leaderboard() {
  return (
    <main
      className="leaderboard min-h-screen px-6 py-16"
      style={{ backgroundColor: TOBACCO, color: LIMESTONE }}
    >
      <style>{`
        .leaderboard { font-family: "Times New Roman", Times, serif; }
        .row { border-top: 1px solid rgba(247, 229, 192, 0.15); }
        .row:last-child { border-bottom: 1px solid rgba(247, 229, 192, 0.15); }
      `}</style>

      <div className="mx-auto w-full max-w-xl">
        <header className="text-center">
          <h1
            className="tracking-wide"
            style={{ fontSize: "clamp(1.5rem, 6vw, 2.25rem)", color: NAPLES }}
          >
            Coffee Leaderboard
          </h1>
          <p className="mt-2 tracking-wide" style={{ fontSize: "0.6875rem", opacity: 0.6 }}>
            MOST COFFEES AT FAZENDA
          </p>
        </header>

        <ol className="mt-10">
          {RANKED.map((p, i) => (
            <li key={p.name} className="row flex items-center gap-4 py-3">
              <span
                style={{
                  minWidth: "1.4em",
                  textAlign: "center",
                  opacity: i < 3 ? 1 : 0.45,
                  color: i < 3 ? NAPLES : LIMESTONE,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "1rem", minWidth: "6.5em" }}>{p.name}</span>
              <span className="flex-1" style={{ color: i < 3 ? NAPLES : LIMESTONE, opacity: i < 3 ? 1 : 0.8 }}>
                <Tally count={p.coffees} />
              </span>
              <span
                className="tabular-nums"
                style={{ fontSize: "1rem", opacity: 0.75, minWidth: "1.8em", textAlign: "right" }}
              >
                {p.coffees}
              </span>
            </li>
          ))}
        </ol>

        <footer className="mt-10 text-center" style={{ fontSize: "0.6875rem", opacity: 0.5 }}>
          Mockup — sample figures.
        </footer>
      </div>
    </main>
  )
}
