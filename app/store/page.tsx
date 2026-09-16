import Image from "next/image"

const PHOTOS = [
  { src: "/store/store-1.jpg", width: 1800, height: 2700, alt: "The café bar at Fazenda" },
  { src: "/store/store-2.jpg", width: 1800, height: 1200, alt: "Racks and shelving at Fazenda" },
  { src: "/store/store-3.jpg", width: 1800, height: 1200, alt: "Jackets on the rail at Fazenda" },
  { src: "/store/store-4.jpg", width: 1800, height: 1200, alt: "Counter seating at Fazenda" },
  { src: "/store/store-5.jpg", width: 1800, height: 1200, alt: "The azulejo wall at Fazenda" },
]

export default function Store() {
  return (
    <main className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {PHOTOS.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-auto"
          />
        ))}
      </div>
    </main>
  )
}
