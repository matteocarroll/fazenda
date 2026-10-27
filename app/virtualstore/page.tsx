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
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Arial, Helvetica, sans-serif" }}>

      {/* Page header */}
      <div style={{ borderBottom: "1px solid #e5e5e5", padding: "2rem 1.5rem 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", marginBottom: "1.25rem", textAlign: "center" }}>
            177 Mott Street, New York ·{" "}
            <a href="https://wa.me/19298408626" target="_blank" rel="noopener noreferrer" style={{ color: "#999", textDecoration: "underline" }}>
              WhatsApp
            </a>
          </p>

          {/* Brand filter tabs */}
          <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none" }}>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setBrandFilter(b)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: brandFilter === b ? "2px solid #111" : "2px solid transparent",
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  color: brandFilter === b ? "#111" : "#999",
                  whiteSpace: "nowrap",
                  fontWeight: brandFilter === b ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2rem 1rem",
        }}
          className="vs-grid"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", fontSize: "0.875rem", padding: "4rem 0" }}>
            No products found.
          </p>
        )}
      </div>
    </div>
  )
}
