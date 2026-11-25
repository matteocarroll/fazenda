"use client"

import Image, { type ImageLoader } from "next/image"
import { useRef, useState, useEffect, useCallback, type ChangeEvent } from "react"
import type { Product } from "@/lib/virtualstore"

// Shopify's CDN resizes on its own, so skip Next's optimiser and ask it for the width.
// Our own photos in /public still go through Next.
const shopifyLoader: ImageLoader = ({ src, width }) =>
  `${src}${src.includes("?") ? "&" : "?"}width=${width}`

const WHATSAPP = "19298408626"

export default function ProductCard({ product }: { product: Product }) {
  const scroller = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const [tryOnLoading, setTryOnLoading] = useState(false)
  const [tryOnError, setTryOnError] = useState<string | null>(null)
  const { images } = product
  const count = images.length

  const handleTryOn = async (file: File) => {
    if (images.length === 0) return
    setTryOnLoading(true)
    setTryOnError(null)
    setTryOnResult(null)
    try {
      // Map product category to Fashn.ai category
      const fashnCategory =
        product.category === "Trousers" ? "bottoms" : "tops"

      const form = new FormData()
      form.append("userPhoto", file)
      form.append("productImageUrl", images[0])
      form.append("category", fashnCategory)

      const res = await fetch("/api/tryon", { method: "POST", body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Try-on failed")
      }
      const data = await res.json()
      setTryOnResult(data.image)
      setLightbox(-1)
    } catch (e) {
      setTryOnError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setTryOnLoading(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleTryOn(file)
    e.target.value = ""
  }

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
  const lbNext = useCallback(() => setLightbox((i) => (i !== null && i >= 0 && i < count - 1 ? i + 1 : i)), [count])
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
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Ask on WhatsApp
            </a>
            {count > 0 && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
                {tryOnResult ? (
                  <button
                    type="button"
                    onClick={() => setLightbox(-1)}
                    className="text-xs underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    View try-on
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={tryOnLoading}
                    className="text-xs underline underline-offset-2 hover:opacity-70 transition-opacity disabled:opacity-40"
                  >
                    {tryOnLoading ? "Generating…" : "Try on"}
                  </button>
                )}
                {tryOnError && (
                  <span className="text-[0.625rem] text-red-500">{tryOnError}</span>
                )}
              </>
            )}
          </div>
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
            {lightbox === -1 && tryOnResult ? (
              /* Try-on result */
              <>
                <div className="relative w-full" style={{ aspectRatio: "1/1", maxHeight: "90vh" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tryOnResult} alt={`Try-on: ${label}`} className="h-full w-full object-contain" />
                </div>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs">
                  AI try-on · results may vary
                </span>
              </>
            ) : lightbox >= 0 ? (
              /* Regular image */
              <>
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
                {count > 1 && (
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs">
                    {lightbox + 1} / {count}
                  </span>
                )}
              </>
            ) : null}

            {/* Close */}
            <button
              type="button"
              onClick={lbClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
