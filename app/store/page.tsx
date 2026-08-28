import Image from "next/image"
import Link from "next/link"

const images = [
  { src: "/store-full-look.png",      alt: "Fazenda | Full Look"      },
  { src: "/store-bar-wall.png",       alt: "Fazenda | Bar Wall"       },
  { src: "/store-changing-room.png",  alt: "Fazenda | Changing Room"  },
]

export default function Store() {
  return (
    <main className="min-h-screen bg-white py-12 px-6" >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-[#5c3317] text-xs hover:opacity-70 transition-opacity">
            ← Back
          </Link>
          <h1 className="text-[#5c3317] text-xs">Store</h1>
          <div className="w-10" />
        </div>

        <div className="flex flex-col gap-4 text-[#5c3317] text-xs leading-relaxed mb-10">
          <a href="https://maps.app.goo.gl/BM4pyogg5gLuH4r7A" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">177 Mott Street, 10012</a>
          <p>Fazenda is a multibrand menswear store + cafe, opening summer 2026 (no ecommerce, in person only).</p>
          <p>We will showcase founder/family run brands, with little distribution in the US. The way we like to describe overall style are brands that have their own authentic and creative style, that attract the right kind of attention (neither flashy nor basic).</p>
          <p>You can see our current brands <Link href="/brands" className="underline hover:opacity-70 transition-opacity">here</Link>.</p>
          <p>Our store's design is Brazil-inspired. Matteo, the founder, is from Brazil. Fazenda means farm and fabric in portuguese.</p>
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
