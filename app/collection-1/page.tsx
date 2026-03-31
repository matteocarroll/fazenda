import Image from "next/image"
import Link from "next/link"

const items = [
  { src: "/black-fazenda-1.jpg", alt: "Black" },
  { src: "/green-fazenda-1.jpg", alt: "Green" },
  { src: "/lavender-fazenda-1.jpg", alt: "Lavender" },
  { src: "/beige-fazenda-1.jpg", alt: "Beige" },
  { src: "/crimson-fazenda-1.jpg", alt: "Crimson" },
  { src: "/off-white-fazenda-1.jpg", alt: "Off White" },
  { src: "/brown-fazenda-1.jpg", alt: "Brown" },
  { src: "/blue-fazenda-1.jpg", alt: "Blue" },
]

export default function Collection1() {
  return (
    <main className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-[#5c3317] text-xs hover:opacity-70 transition-opacity" style={{ fontFamily: "Arial, sans-serif" }}>
            ← Back
          </Link>
          <h1 className="text-[#5c3317] text-xs tracking-widest" style={{ fontFamily: "Arial, sans-serif" }}>
            COLLECTION PRIMEIRA
          </h1>
          <div className="w-10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.src} className="w-full">
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={800}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
