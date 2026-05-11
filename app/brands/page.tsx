"use client"

import Link from "next/link"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

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

const markers = [
  { name: "Italy",   coordinates: [12.57,  41.87] },
  { name: "France",  coordinates: [2.21,   46.23] },
  { name: "England", coordinates: [-1.5,   52.5]  },
  { name: "Japan",   coordinates: [138.25, 36.20] },
  { name: "Brazil",  coordinates: [-51.93, -14.24]},
]

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

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

        {/* Brand list */}
        <div className="flex flex-col items-center gap-3 mb-16">
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

        {/* World map */}
        <div className="w-full">
          <ComposableMap
            projectionConfig={{ scale: 140 }}
            style={{ width: "100%", height: "auto" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#e8e0d5"
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover:   { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {markers.map(({ name, coordinates }) => (
              <Marker key={name} coordinates={coordinates as [number, number]}>
                <circle r={5} fill="#4a90d9" stroke="#ffffff" strokeWidth={1.5} />
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>
    </main>
  )
}
