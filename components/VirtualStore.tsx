"use client"

import { useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { CATEGORIES, type Product } from "@/lib/virtualstore"

export default function VirtualStore({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("All")
  const [brandFilter, setBrandFilter] = useState("All")

  const tabs = useMemo(
    () => ["All", ...CATEGORIES.filter((c) => products.some((p) => p.category === c))],
    [products]
  )

  const inCategory = useMemo(
    () => (category === "All" ? products : products.filter((p) => p.category === category)),
    [category, products]
  )

  const brands = useMemo(() => {
    const set = new Set(inCategory.map((p) => p.brand).filter(Boolean))
    return ["All", ...Array.from(set).sort()]
  }, [inCategory])

  const selectCategory = (next: string) => {
    setCategory(next)
    const stocked = next === "All" || products.some((p) => p.category === next && p.brand === brandFilter)
    if (!stocked) setBrandFilter("All")
  }

  const filtered = useMemo(
    () => (brandFilter === "All" ? inCategory : inCategory.filter((p) => p.brand === brandFilter)),
    [inCategory, brandFilter]
  )

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "Helvetica, Arial, sans-serif", color: "#000" }}>

      {/* Nav — Bode style: white, no border, centered wordmark, left nav links */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="relative flex h-11 items-center px-4 sm:px-6">
          {/* Left: category tabs */}
          <nav aria-label="Categories" className="flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => selectCategory(tab)}
                aria-current={category === tab}
                className="whitespace-nowrap text-[13px] transition-opacity"
                style={{ opacity: category === tab ? 1 : 0.4 }}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Center: wordmark */}
          <span
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-sm tracking-widest"
            style={{ fontFamily: "Helvetica, Arial, sans-serif", letterSpacing: "0.18em" }}
          >
            FAZENDA
          </span>

          {/* Right: brand filter */}
          <div className="ml-auto">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="bg-transparent text-[13px] focus:outline-none"
              style={{ color: brandFilter === "All" ? "rgba(0,0,0,0.4)" : "#000" }}
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === "All" ? "Brand" : b}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="h-px bg-black/10" />
      </div>

      {/* Grid */}
      <section className="px-4 py-6 sm:px-6">
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>No products</p>
        )}
      </section>
    </main>
  )
}
