import Link from "next/link"

const brands = [
  "Massimo Alba",
  "Barena",
  "Altea",
  "Valstar",
  "Erevan",
  "Labo Art",
  "Husbands Paris",
  "Handred",
  "Misci",
  "Ciota",
  "Cale",
  "Kota Gushiken",
  "Kuro",
  "Wax London",
  "Deadwood",
  "Purple Mountain Observatory",
]

export default function Brands() {
  return (
    <main className="min-h-screen bg-white py-12 px-6" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-[#5c3317] text-xs hover:opacity-70 transition-opacity">
            ← Back
          </Link>
          <h1 className="text-[#5c3317] text-xs">
            Brands
          </h1>
          <div className="w-10" />
        </div>

        <div className="flex flex-col items-center gap-1">
          {brands.map((brand) => (
            <p key={brand} className="text-[#5c3317] text-xs">
              {brand}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}
