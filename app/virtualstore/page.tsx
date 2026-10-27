"use client"

import { useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { CATEGORIES, PRODUCTS } from "@/lib/virtualstore"

export default function VirtualStore() {
  const [category, setCategory] = useState("All")
  const [brandFilter, setBrandFilter] = useState("All")

  // Only show tabs that have something in them.
  const tabs = useMemo(
    () => ["All", ...CATEGORIES.filter((c) => PRODUCTS.some((p) => p.category === c))],
    []
  )

  const inCategory = useMemo(
    () => (category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category]
  )

  // Brands follow the tab, so the list never offers an empty combination.
  const brands = useMemo(() => {
    const set = new Set(inCategory.map((p) => p.brand).filter(Boolean))
    return ["All", ...Array.from(set).sort()]
  }, [inCategory])

  // Keep the brand across tabs when the new tab has it, otherwise drop it.
  const selectCategory = (next: string) => {
    setCategory(next)
    const stocked = next === "All" || PRODUCTS.some((p) => p.category === next && p.brand === brandFilter)
    if (!stocked) setBrandFilter("All")
  }

  const filtered = useMemo(
    () => (brandFilter === "All" ? inCategory : inCategory.filter((p) => p.brand === brandFilter)),
    [inCategory, brandFilter]
  )

  return (
    <main className="min-h-screen bg-white text-[#5c3317]">
      <header className="mx-auto max-w-6xl px-4 pt-10 sm:px-8">
        <h1
          className="text-center"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
          }}
        >
          Fazenda Online Store
        </h1>
        <p className="mt-2 text-center text-xs opacity-70">For existing clients only.</p>
      </header>

      <div className="sticky top-0 z-10 mt-8 border-b border-[#5c3317]/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 sm:px-8">
          {/* Category tabs */}
          <nav
            aria-label="Categories"
            className="-mb-px flex flex-1 gap-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => selectCategory(tab)}
                aria-current={category === tab}
                className={`whitespace-nowrap border-b-2 py-3.5 text-sm transition-colors ${
                  category === tab
                    ? "border-[#5c3317] text-[#5c3317]"
                    : "border-transparent text-[#5c3317]/50 hover:text-[#5c3317]"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Brand filter */}
          <label className="flex shrink-0 items-center gap-2 text-xs">
            <span className="hidden opacity-60 sm:inline">Brand</span>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="max-w-[9rem] rounded-full border border-[#5c3317]/20 bg-transparent px-3 py-1.5 text-xs text-[#5c3317] focus:border-[#5c3317] focus:outline-none sm:max-w-none"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === "All" ? "All brands" : b}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <p className="mb-6 text-xs opacity-60">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
