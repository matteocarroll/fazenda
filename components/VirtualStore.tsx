"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Image from "next/image"
import ProductCard from "@/components/ProductCard"
import { CATEGORIES, type Product, type CollectionItem } from "@/lib/virtualstore"

const STORAGE_KEY = "fazenda_collection"

function loadCollection(): CollectionItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
  } catch {
    return []
  }
}

export default function VirtualStore({ products }: { products: Product[] }) {
  const [category, setCategory] = useState("All")
  const [brandFilter, setBrandFilter] = useState("All")
  const [collection, setCollection] = useState<CollectionItem[]>([])
  const [showCollection, setShowCollection] = useState(false)

  useEffect(() => {
    setCollection(loadCollection())
  }, [])

  const saveItem = useCallback((item: CollectionItem) => {
    setCollection((prev) => {
      const next = prev.some((c) => c.productId === item.productId && c.tryOnImage === item.tryOnImage)
        ? prev
        : [item, ...prev]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const removeItem = useCallback((productId: string, tryOnImage: string) => {
    setCollection((prev) => {
      const next = prev.filter((c) => !(c.productId === productId && c.tryOnImage === tryOnImage))
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const isSaved = useCallback(
    (productId: string, tryOnImage: string | null) =>
      !!tryOnImage && collection.some((c) => c.productId === productId && c.tryOnImage === tryOnImage),
    [collection]
  )

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

      {/* Nav */}
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

          {/* Right: collection + brand filter */}
          <div className="ml-auto flex items-center gap-4">
            {collection.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCollection(true)}
                className="text-[13px] transition-opacity hover:opacity-50"
              >
                Collection ({collection.length})
              </button>
            )}
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
            <ProductCard
              key={product.id}
              product={product}
              checkSaved={(tryOnImage) => isSaved(product.id, tryOnImage)}
              onSave={saveItem}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>No products</p>
        )}
      </section>

      {/* Collection modal */}
      {showCollection && (
        <div
          role="dialog"
          aria-modal
          aria-label="Your collection"
          onClick={() => setShowCollection(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-white"
        >
          <div onClick={(e) => e.stopPropagation()} className="min-h-full">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white">
              <div className="relative flex h-11 items-center px-4 sm:px-6">
                <span className="text-[13px]">Collection ({collection.length})</span>
                <button
                  type="button"
                  onClick={() => setShowCollection(false)}
                  className="absolute right-4 text-[13px] opacity-40 hover:opacity-70 transition-opacity"
                >
                  Close
                </button>
              </div>
              <div className="h-px bg-black/10" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-4">
              {collection.map((item) => (
                <figure key={`${item.productId}-${item.savedAt}`} className="group flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.tryOnImage}
                      alt={`${item.brand} ${item.name} try-on`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="py-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[11px] leading-snug">
                        {item.name}{item.color ? ` — ${item.color}` : ""}
                      </span>
                      <span className="shrink-0 text-[11px] opacity-40">{item.brand}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.tryOnImage)}
                      className="mt-1 text-[10px] opacity-30 hover:opacity-60 transition-opacity underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
