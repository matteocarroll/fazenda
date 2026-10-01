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
  const W = 8 + 4 * 4
  return (
    <svg width={W} height="19" viewBox={`0 0 ${W} 19`} fill="none" aria-hidden>
      {Array.from({ length: Math.min(n, 4) }).map((_, i) => (
        <line
          key={i}
          x1={3 + i * 4}
          y1="2.5"
          x2={3 + i * 4}
          y2="16.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      ))}
      {n === 5 && (
        <line x1="0.5" y1="15" x2={W - 1.5} y2="4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      )}
    </svg>
  )
}

function Tally({ count }: { count: number }) {
  const bundles = Array.from({ length: Math.floor(count / 5) }, () => 5)
  const rest = count % 5
  if (rest) bundles.push(rest)
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
      {bundles.map((n, i) => (
        <Bundle key={i} n={n} />
      ))}
    </span>
  )
}

export default function Leaderboard() {
  return (
    <main
      className="leaderboard min-h-screen px-6 py-12"
      style={{ backgroundColor: TOBACCO, color: LIMESTONE }}
    >
      <style>{`
        .leaderboard {
          font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          text-transform: uppercase;
        }
        .row { border-top: 1px solid rgba(247, 229, 192, 0.15); }
        .row:last-child { border-bottom: 1px solid rgba(247, 229, 192, 0.15); }
      `}</style>

      <div className="mx-auto w-full max-w-md">
        <header className="text-center">
          <h1
            style={{ fontSize: "clamp(1rem, 3.4vw, 1.25rem)", letterSpacing: "0.1em", color: NAPLES }}
          >
            Coffee Leaderboard
          </h1>
          <p className="mt-2" style={{ fontSize: "0.5625rem", letterSpacing: "0.14em", opacity: 0.6 }}>
            MOST COFFEES AT FAZENDA
          </p>
        </header>

        <ol className="mt-8">
          {RANKED.map((p, i) => (
            <li key={p.name} className="row flex items-center gap-3 py-2">
              <span
                style={{
                  fontSize: "0.75rem",
                  minWidth: "1.3em",
                  textAlign: "center",
                  opacity: i < 3 ? 1 : 0.45,
                  color: i < 3 ? NAPLES : LIMESTONE,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.04em", minWidth: "6em" }}>{p.name}</span>
              <span className="flex-1" style={{ color: i < 3 ? NAPLES : LIMESTONE, opacity: i < 3 ? 1 : 0.8 }}>
                <Tally count={p.coffees} />
              </span>
              <span
                className="tabular-nums"
                style={{ fontSize: "0.8125rem", opacity: 0.75, minWidth: "1.8em", textAlign: "right" }}
              >
                {p.coffees}
              </span>
            </li>
          ))}
        </ol>

        <footer className="mt-8 text-center" style={{ fontSize: "0.625rem", opacity: 0.5 }}>
          Mockup — sample figures.
        </footer>
      </div>
    </main>
  )
}
