"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import ProductCard from "@/components/ProductCard"
import AuthButton from "@/components/AuthButton"
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
    fetch("/api/collection")
      .then((r) => r.json())
      .then((items) => {
        if (Array.isArray(items) && items.length > 0) {
          setCollection(items as CollectionItem[])
        } else {
          setCollection(loadCollection())
        }
      })
      .catch(() => setCollection(loadCollection()))
  }, [])

  const syncToServer = useCallback((items: CollectionItem[]) => {
    fetch("/api/collection", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    }).catch(() => {})
  }, [])

  const saveItem = useCallback((item: CollectionItem) => {
    setCollection((prev) => {
      if (prev.some((c) => c.productId === item.productId && c.tryOnImage === item.tryOnImage)) return prev
      const next = [item, ...prev]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      syncToServer(next)
      return next
    })
  }, [syncToServer])

  const removeItem = useCallback((productId: string, tryOnImage: string) => {
    setCollection((prev) => {
      const next = prev.filter((c) => !(c.productId === productId && c.tryOnImage === tryOnImage))
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      syncToServer(next)
      return next
    })
  }, [syncToServer])

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

      {/* Nav — two rows on mobile, one row on desktop */}
      <div className="sticky top-0 z-10 bg-white">

        {/* Mobile top row: wordmark + auth */}
        <div className="relative flex h-11 items-center px-4 sm:hidden">
          <span
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-sm"
            style={{ letterSpacing: "0.18em" }}
          >
            FAZENDA
          </span>
          <div className="ml-auto flex items-center gap-3">
            {collection.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCollection(true)}
                className="text-[13px] transition-opacity active:opacity-50"
              >
                ({collection.length})
              </button>
            )}
            <AuthButton />
          </div>
        </div>

        {/* Mobile second row: category tabs + brand filter */}
        <div className="flex h-10 items-center gap-4 px-4 sm:hidden">
          <nav
            aria-label="Categories"
            className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => selectCategory(tab)}
                aria-current={category === tab}
                className="whitespace-nowrap text-[12px] transition-opacity"
                style={{ opacity: category === tab ? 1 : 0.4 }}
              >
                {tab}
              </button>
            ))}
          </nav>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="shrink-0 bg-transparent text-[12px] focus:outline-none"
            style={{ color: brandFilter === "All" ? "rgba(0,0,0,0.4)" : "#000" }}
          >
            {brands.map((b) => (
              <option key={b} value={b}>{b === "All" ? "Brand" : b}</option>
            ))}
          </select>
        </div>

        {/* Desktop single row */}
        <div className="relative hidden h-11 items-center px-6 sm:flex">
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

          <span
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-sm"
            style={{ letterSpacing: "0.18em" }}
          >
            FAZENDA
          </span>

          <div className="ml-auto flex items-center gap-4">
            <AuthButton />
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
                <option key={b} value={b}>{b === "All" ? "Brand" : b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-px bg-black/10" />
      </div>

      {/* Grid */}
      <section className="px-3 py-4 sm:px-6 sm:py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
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
          <p className="py-20 text-center text-xs opacity-40">No products</p>
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
            <div className="sticky top-0 z-10 bg-white">
              <div className="relative flex h-11 items-center px-4 sm:px-6">
                <span className="text-[13px]">Collection ({collection.length})</span>
                <button
                  type="button"
                  onClick={() => setShowCollection(false)}
                  className="absolute right-4 text-[13px] opacity-40 active:opacity-70"
                >
                  Close
                </button>
              </div>
              <div className="h-px bg-black/10" />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-6 lg:grid-cols-4">
              {collection.map((item) => (
                <figure key={`${item.productId}-${item.savedAt}`} className="flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.tryOnImage}
                      alt={`${item.brand} ${item.name} try-on`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="py-2">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="min-w-0 truncate text-[11px] leading-snug">
                        {item.name}{item.color ? ` — ${item.color}` : ""}
                      </span>
                      <span className="shrink-0 text-[11px] opacity-40">{item.brand}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.tryOnImage)}
                      className="mt-1 text-[10px] opacity-30 underline underline-offset-2 active:opacity-60"
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
