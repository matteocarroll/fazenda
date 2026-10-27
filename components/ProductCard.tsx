"use client"

import Image, { type ImageLoader } from "next/image"
import { useRef, useState } from "react"
import type { Product } from "@/lib/virtualstore"

// Shopify's CDN resizes on its own, so skip Next's optimiser and ask it for the width.
// Our own photos in /public still go through Next.
const shopifyLoader: ImageLoader = ({ src, width }) =>
  `${src}${src.includes("?") ? "&" : "?"}width=${width}`

const WHATSAPP = "19298408626"

export default function ProductCard({ product }: { product: Product }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
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

  const label = [product.brand, product.name, product.color].filter(Boolean).join(" ")
  const message = `Hi Fazenda, I'm interested in the ${label}.`
  const href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`

  return (
    <figure className="group flex flex-col">
      <div className="relative overflow-hidden rounded-sm bg-[#f4f1ec]">
        {count === 0 ? (
          // No photos in Shopify yet: same footprint, just the brand and name.
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
              <div key={src} className="relative aspect-[4/5] w-full flex-none snap-center">
                <Image
                  loader={src.startsWith("https://") ? shopifyLoader : undefined}
                  src={src}
                  alt={`${label} — image ${i + 1} of ${count}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                  className="object-cover"
                />
              </div>
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
  )
}
