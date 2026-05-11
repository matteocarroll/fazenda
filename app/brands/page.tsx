import Link from "next/link"

const brands = [
  "MASSIMO ALBA",
  "BARENA",
  "ALTEA",
  "VALSTAR",
  "EREVAN",
  "LABO ART",
  "HUSBANDS PARIS",
  "HANDRED",
  "MISCI",
  "CIOTA",
  "CALE",
  "KOTA GUSHIKEN",
  "KURO",
  "EDWIN",
  "WAX LONDON",
  "DEADWOOD",
  "PURPLE MOUNTAIN OBSERVATORY",
]

export default function Brands() {
  return (
    <main className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-[#5c3317] text-xs hover:opacity-70 transition-opacity" style={{ fontFamily: "Arial, sans-serif" }}>
            ← Back
          </Link>
          <h1 className="text-[#5c3317] text-xs tracking-widest" style={{ fontFamily: "Arial, sans-serif" }}>
            BRANDS
          </h1>
          <div className="w-10" />
        </div>

        <div className="flex flex-col items-center gap-4">
          {brands.map((brand) => (
            <p
              key={brand}
              className="text-[#5c3317] text-xs tracking-widest"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {brand}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}
