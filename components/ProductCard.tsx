"use client"

import Image from "next/image"
import { useRef, useState } from "react"

export type Product = {
  id: string
  brand: string
  name: string
  color: string
  style_code?: string
  still?: string | null
  images: { src: string; type: string; generated?: boolean }[]
}

function orderImages(images: Product["images"]) {
  const still = images.find((image) => image.type === "still")
  if (!still) return images
  return [still, ...images.filter((image) => image !== still)]
}

const WHATSAPP = "19298408626"

export default function ProductCard({ product }: { product: Product }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const images = orderImages(product.images)
  const count = images.length

  const goTo = (i: number) => {
    const el = scroller.current
    if (!el) return
    const next = Math.max(0, Math.min(count - 1, i))
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" })
  }

  const onScroll = () => {
    const el = scroller.current
    if (!el || !el.clientWidth) return
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  const label = [product.brand, product.name, product.color].filter(Boolean).join(" ")
  const message = `Hi Fazenda, I'm interested in the ${label}.`
  const href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`

  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", background: "#f5f5f5" }}>
        {count === 0 ? (
          /* Placeholder for products with no images */
          <div style={{
            aspectRatio: "3/4",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
            padding: "1.5rem",
          }}>
            <span style={{ fontSize: "0.625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#999", textAlign: "center", lineHeight: 1.6 }}>
              {product.brand}<br />
              <span style={{ color: "#bbb" }}>{product.name}</span>
            </span>
          </div>
        ) : (
          <>
            <div
              ref={scroller}
              onScroll={onScroll}
              style={{
                display: "flex",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
              }}
            >
              {images.map((image, i) => (
                <div key={image.src} style={{ position: "relative", aspectRatio: "3/4", width: "100%", flexShrink: 0, scrollSnapAlign: "center" }}>
                  <Image
                    src={image.src}
                    alt={`${label} — image ${i + 1} of ${count}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  aria-label="Previous image"
                  style={{
                    position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer",
                    padding: "4px 8px", fontSize: "0.75rem", color: "#111", opacity: index === 0 ? 0.2 : 1,
                  }}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  disabled={index === count - 1}
                  aria-label="Next image"
                  style={{
                    position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.85)", border: "none", cursor: "pointer",
                    padding: "4px 8px", fontSize: "0.75rem", color: "#111", opacity: index === count - 1 ? 0.2 : 1,
                  }}
                >
                  →
                </button>
              </>
            )}
          </>
        )}
      </div>

      {count > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 8 }}>
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              style={{
                width: 5, height: 5, borderRadius: "50%", border: "none", cursor: "pointer",
                background: "#111", opacity: i === index ? 1 : 0.2, padding: 0,
              }}
            />
          ))}
        </div>
      )}

      <figcaption style={{ marginTop: 10, textAlign: "left" }}>
        <span style={{ display: "block", fontSize: "0.625rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", marginBottom: 2 }}>
          {product.brand}
        </span>
        <span style={{ display: "block", fontSize: "0.8125rem", color: "#111", lineHeight: 1.3 }}>
          {product.name}
        </span>
        {product.color && (
          <span style={{ display: "block", fontSize: "0.75rem", color: "#999", marginTop: 2 }}>
            {product.color}
          </span>
        )}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: 6, fontSize: "0.6875rem", color: "#111", textDecoration: "underline", letterSpacing: "0.04em" }}
        >
          Ask on WhatsApp →
        </a>
      </figcaption>
    </figure>
  )
}
