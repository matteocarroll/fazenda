import Link from "next/link"

import { BRANDS, COMING_SOON } from "@/lib/brands"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Brands",
  description:
    "The brands we carry at Fazenda, from Altea and Barena to Valstar and Wax London, plus what is arriving soon.",
}


export default function Brands() {
  return (
    <main className="min-h-screen bg-white py-12 px-6" >
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
          {BRANDS.map((brand) => (
            <p key={brand} className="text-[#5c3317] text-xs">
              {brand}
            </p>
          ))}
        </div>

        <p className="text-[#5c3317] text-xs text-center mt-10 mb-4">Coming Soon</p>

        <div className="flex flex-col items-center gap-1">
          {COMING_SOON.map((brand) => (
            <p key={brand} className="text-[#5c3317] text-xs">
              {brand}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}
