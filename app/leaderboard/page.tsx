const TOBACCO = "#43150E"
const LIMESTONE = "#F7E5C0"
const NAPLES = "#E0C991"

/* Mockup — invented figures. */
const PEOPLE = [
  { name: "Maggie", coffees: 64 },
  { name: "Matteo", coffees: 58 },
  { name: "Joelle", coffees: 51 },
  { name: "Cassio D.", coffees: 37 },
  { name: "Mimi R.", coffees: 29 },
  { name: "Neil A.", coffees: 24 },
  { name: "Demetra K.", coffees: 18 },
  { name: "Seth M.", coffees: 15 },
  { name: "Alex H.", coffees: 11 },
  { name: "Carlo B.", coffees: 7 },
]

const RANKED = [...PEOPLE].sort((a, b) => b.coffees - a.coffees)
const MOST = RANKED[0].coffees

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

      <div className="mx-auto w-full max-w-md">
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
            <li key={p.name} className="row relative flex items-center gap-4 px-3 py-3">
              {/* a quiet bar behind each row, in proportion to the leader */}
              <span
                aria-hidden
                className="absolute left-0 top-0 bottom-0"
                style={{
                  width: `${(p.coffees / MOST) * 100}%`,
                  backgroundColor: "rgba(224, 201, 145, 0.10)",
                }}
              />
              <span
                className="relative"
                style={{ minWidth: "1.5em", textAlign: "center", opacity: i < 3 ? 1 : 0.5, color: i < 3 ? NAPLES : LIMESTONE }}
              >
                {i + 1}
              </span>
              <span className="relative flex-1" style={{ fontSize: "1rem" }}>
                {p.name}
              </span>
              <span
                className="relative tabular-nums"
                style={{ fontSize: "1.125rem", color: i < 3 ? NAPLES : LIMESTONE }}
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
