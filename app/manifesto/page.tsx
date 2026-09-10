const TOBACCO = "#43150E"
const INK = "#B78FAC" // wisteria, the pink in the Fazenda palette

export default function Manifesto() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: TOBACCO }}
    >
      <h1
        className="text-center tracking-wide"
        style={{
          color: INK,
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "clamp(2rem, 9vw, 3.5rem)",
        }}
      >
        Manifesto
      </h1>
    </main>
  )
}
