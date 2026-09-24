import Image from "next/image"

const PHOTOS = [
  { src: "/store/store-7.jpg", w: 1200, h: 1797, alt: "The Fazenda storefront on Mott Street" },
  { src: "/store/store-1.jpg", w: 1200, h: 1800, alt: "The café bar at Fazenda" },
  { src: "/store/store-2.jpg", w: 1800, h: 1200, alt: "Racks and shelving at Fazenda" },
  { src: "/store/store-3.jpg", w: 1800, h: 1200, alt: "Jackets on the rail at Fazenda" },
  { src: "/store/store-4.jpg", w: 1800, h: 1200, alt: "Counter seating at Fazenda" },
  { src: "/store/store-5.jpg", w: 1800, h: 1200, alt: "The azulejo wall at Fazenda" },
  { src: "/store/store-6.jpg", w: 1200, h: 1797, alt: "Inside Fazenda on opening day" },
  { src: "/store/store-8.jpg", w: 1024, h: 683, alt: "The espresso bar at Fazenda" },
]

export default function Store() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <h1
        className="mb-8 text-[#5c3317] text-center tracking-wide"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
        }}
      >
        Store Pictures
      </h1>

      {/* CSS columns rather than a grid: the photos are a mix of portrait and
          landscape, and a grid would align rows and leave gaps under the
          shorter ones. Columns let each image keep its own height. */}
      <div className="mx-auto w-full max-w-3xl columns-1 sm:columns-2 gap-4">
        {PHOTOS.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.w}
            height={photo.h}
            priority={i < 2}
            sizes="(max-width: 640px) 90vw, 380px"
            className="mb-4 w-full h-auto break-inside-avoid"
          />
        ))}
      </div>
    </main>
  )
}
