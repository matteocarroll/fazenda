"use client"

import { useState, useMemo } from "react"
import ProductCard, { type Product } from "@/components/ProductCard"
import products from "@/data/virtualstore-products.json"

const PRODUCTS = products as Product[]

export default function VirtualStore() {
  const [brandFilter, setBrandFilter] = useState("All")

  const brands = useMemo(() => {
    const set = new Set(PRODUCTS.map((p) => p.brand).filter(Boolean))
    return ["All", ...Array.from(set).sort()]
  }, [])

  const filtered = useMemo(
    () => brandFilter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.brand === brandFilter),
    [brandFilter]
  )

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-8">
      <h1
        className="mb-3 text-center text-[#5c3317]"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
        }}
      >
        Virtual Store
      </h1>
      <p className="mb-6 text-[#5c3317] text-xs text-center">
        See something you like?{" "}
        <a
          href="https://wa.me/19298408626"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-70 transition-opacity"
        >
          Send us a WhatsApp
        </a>
      </p>

      {/* Brand filter */}
      <div className="mx-auto mb-10 max-w-5xl flex flex-wrap gap-2 justify-center">
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setBrandFilter(b)}
            className="vb-pill"
            style={
              brandFilter === b
                ? { background: "#1c1917", color: "#fff", borderColor: "#1c1917" }
                : undefined
            }
          >
            {b}
          </button>
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}
