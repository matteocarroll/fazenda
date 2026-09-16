"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

const PHOTOS = [
  { src: "/store/store-7.jpg", alt: "The Fazenda storefront on Mott Street" },
  { src: "/store/store-1.jpg", alt: "The café bar at Fazenda" },
  { src: "/store/store-2.jpg", alt: "Racks and shelving at Fazenda" },
  { src: "/store/store-3.jpg", alt: "Jackets on the rail at Fazenda" },
  { src: "/store/store-4.jpg", alt: "Counter seating at Fazenda" },
  { src: "/store/store-5.jpg", alt: "The azulejo wall at Fazenda" },
  { src: "/store/store-6.jpg", alt: "Inside Fazenda on opening day" },
  { src: "/store/store-8.jpg", alt: "The espresso bar at Fazenda" },
]

export default function Store() {
  const [index, setIndex] = useState(0)

  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + PHOTOS.length) % PHOTOS.length),
    [],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {/* Fixed-height frame with object-contain: the photos are a mix of
          portrait and landscape, so this keeps the arrows from jumping
          around as you step through them. */}
      <div
        className="relative w-full max-w-lg"
        style={{ height: "clamp(240px, 52vh, 460px)" }}
      >
        {/* The fade lives on a wrapper, not on Image itself: a filled
            next/image manages its own inline styles and overwrites an
            opacity passed straight to it. */}
        {PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            aria-hidden={i !== index}
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: i === index ? 1 : 0, pointerEvents: "none" }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-contain"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-8 text-[#5c3317] text-xs tracking-wide">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photo"
          className="text-base leading-none hover:opacity-60 transition-opacity"
        >
          ←
        </button>
        <span className="tabular-nums">
          {index + 1} / {PHOTOS.length}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photo"
          className="text-base leading-none hover:opacity-60 transition-opacity"
        >
          →
        </button>
      </div>
    </main>
  )
}
