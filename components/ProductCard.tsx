"use client"

import Image, { type ImageLoader } from "next/image"
import { useRef, useState, useEffect, useCallback } from "react"
import type { Product } from "@/lib/virtualstore"

// Shopify's CDN resizes on its own, so skip Next's optimiser and ask it for the width.
// Our own photos in /public still go through Next.
const shopifyLoader: ImageLoader = ({ src, width }) =>
  `${src}${src.includes("?") ? "&" : "?"}width=${width}`

const WHATSAPP = "19298408626"

export default function ProductCard({ product }: { product: Product }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const { images } = product
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

  const lbPrev = useCallback(() => setLightbox((i) => (i !== null && i > 0 ? i - 1 : i)), [])
  const lbNext = useCallback(() => setLightbox((i) => (i !== null && i < count - 1 ? i + 1 : i)), [count])
  const lbClose = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") lbClose()
      if (e.key === "ArrowLeft") lbPrev()
      if (e.key === "ArrowRight") lbNext()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightbox, lbClose, lbPrev, lbNext])

  const label = [product.brand, product.name, product.color].filter(Boolean).join(" ")
  const message = `Hi Fazenda, I'm interested in the ${label}.`
  const href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`

  return (
    <>
      <figure className="group flex flex-col">
        <div className="relative overflow-hidden rounded-sm bg-[#f4f1ec]">
          {count === 0 ? (
            <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-1.5 px-4 text-center text-[#5c3317]">
              <span className="text-[0.625rem] uppercase tracking-[0.18em] opacity-60">{product.brand}</span>
              <span className="text-sm leading-snug">{product.name}</span>
            </div>
          ) : (
            <div
              ref={scroller}
              onScroll={onScroll}
              className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightbox(i)}
                  aria-label={`Zoom image ${i + 1}`}
                  className="relative aspect-[4/5] w-full flex-none snap-center cursor-zoom-in"
                >
                  <Image
                    loader={src.startsWith("https://") ? shopifyLoader : undefined}
                    src={src}
                    alt={`${label} — image ${i + 1} of ${count}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Previous image"
                className="absolute left-1.5 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#5c3317] text-xs opacity-0 transition-opacity group-hover:opacity-100 disabled:!opacity-0 sm:flex"
              >
                &#8592;
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === count - 1}
                aria-label="Next image"
                className="absolute right-1.5 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#5c3317] text-xs opacity-0 transition-opacity group-hover:opacity-100 disabled:!opacity-0 sm:flex"
              >
                &#8594;
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to image ${i + 1}`}
                    aria-current={i === index}
                    className={`pointer-events-auto h-1.5 w-1.5 rounded-full bg-[#5c3317] transition-opacity ${
                      i === index ? "opacity-90" : "opacity-25"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <figcaption className="mt-3 flex flex-col gap-0.5 text-[#5c3317]">
          <span className="text-[0.625rem] uppercase tracking-[0.18em] opacity-60">{product.brand}</span>
          <span className="text-sm leading-snug">{product.name}</span>
          {product.color && <span className="text-xs opacity-60">{product.color}</span>}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 self-start text-xs underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            Ask on WhatsApp
          </a>
        </figcaption>
      </figure>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal
          aria-label={label}
          onClick={lbClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-screen max-w-3xl w-full items-center justify-center p-4"
          >
            <div className="relative w-full" style={{ aspectRatio: "4/5", maxHeight: "90vh" }}>
              <Image
                loader={images[lightbox].startsWith("https://") ? shopifyLoader : undefined}
                src={images[lightbox]}
                alt={`${label} — image ${lightbox + 1} of ${count}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={lbClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              ✕
            </button>

            {/* Prev */}
            {lightbox > 0 && (
              <button
                type="button"
                onClick={lbPrev}
                aria-label="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                ←
              </button>
            )}

            {/* Next */}
            {lightbox < count - 1 && (
              <button
                type="button"
                onClick={lbNext}
                aria-label="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                →
              </button>
            )}

            {/* Counter */}
            {count > 1 && (
              <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs">
                {lightbox + 1} / {count}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  )
}
