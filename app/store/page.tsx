import Image from "next/image"
import Link from "next/link"

const images = [
  { src: "/store-full-look.png",      alt: "Fazenda | Full Look"      },
  { src: "/store-bar-wall.png",       alt: "Fazenda | Bar Wall"       },
  { src: "/store-changing-room.png",  alt: "Fazenda | Changing Room"  },
]

export default function Store() {
  return (
    <main className="min-h-screen bg-white py-12 px-6" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-[#5c3317] text-xs hover:opacity-70 transition-opacity">
            ← Back
          </Link>
          <h1 className="text-[#5c3317] text-xs">Store</h1>
          <div className="w-10" />
        </div>

        <div className="flex flex-col gap-6">
          {images.map((img) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          ))}
        </div>
      </div>
    </main>
  )
}
