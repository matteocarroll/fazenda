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

// The still is the thumbnail and the first slide. A handful of products have no
// still yet, so fall back to whatever image comes first.
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
    <figure className="flex flex-col">
      <div className="relative">
        <div
          ref={scroller}
          onScroll={onScroll}
          className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => (
            <div key={image.src} className="relative aspect-[2/3] w-full flex-none snap-center">
              <Image
                src={image.src}
                alt={`${label} — image ${i + 1} of ${count}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                className="object-contain"
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
              className="absolute left-1 top-1/2 hidden -translate-y-1/2 px-2 py-1 text-[#5c3317] text-xs hover:opacity-70 disabled:opacity-20 sm:block"
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index === count - 1}
              aria-label="Next image"
              className="absolute right-1 top-1/2 hidden -translate-y-1/2 px-2 py-1 text-[#5c3317] text-xs hover:opacity-70 disabled:opacity-20 sm:block"
            >
              &#8594;
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 w-1.5 rounded-full bg-[#5c3317] transition-opacity ${
                i === index ? "opacity-100" : "opacity-25"
              }`}
            />
          ))}
        </div>
      )}

      <figcaption className="mt-2 text-center text-[#5c3317] text-xs">
        <span className="block">{product.brand}</span>
        <span className="block opacity-70">{product.name}</span>
        {product.color && <span className="block opacity-70">{product.color}</span>}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block underline hover:opacity-70 transition-opacity"
        >
          Ask on WhatsApp
        </a>
      </figcaption>
    </figure>
  )
}
