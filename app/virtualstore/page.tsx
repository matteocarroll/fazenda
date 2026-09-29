import Image from "next/image"

// Product shots from the shop floor, backgrounds removed and set on the site's white.
// Add a name/price to any entry and it will show under the photo.
const PRODUCTS: { src: string; name?: string; price?: string }[] = [
  { src: "/virtualstore/IMG_0919.jpg" },
  { src: "/virtualstore/IMG_0920.jpg" },
  { src: "/virtualstore/IMG_0921.jpg" },
  { src: "/virtualstore/IMG_0923.jpg" },
  { src: "/virtualstore/IMG_0924.jpg" },
  { src: "/virtualstore/IMG_0925.jpg" },
  { src: "/virtualstore/IMG_0926.jpg" },
  { src: "/virtualstore/IMG_0927.jpg" },
  { src: "/virtualstore/IMG_0928.jpg" },
  { src: "/virtualstore/IMG_0929.jpg" },
  { src: "/virtualstore/IMG_0931.jpg" },
  { src: "/virtualstore/IMG_0932.jpg" },
  { src: "/virtualstore/IMG_0934.jpg" },
  { src: "/virtualstore/IMG_0935.jpg" },
  { src: "/virtualstore/IMG_0936.jpg" },
  { src: "/virtualstore/IMG_0937.jpg" },
  { src: "/virtualstore/IMG_0938.jpg" },
  { src: "/virtualstore/IMG_0939.jpg" },
  { src: "/virtualstore/IMG_0940.jpg" },
  { src: "/virtualstore/IMG_0941.jpg" },
  { src: "/virtualstore/IMG_0942.jpg" },
  { src: "/virtualstore/IMG_0943.jpg" },
  { src: "/virtualstore/IMG_0944.jpg" },
  { src: "/virtualstore/IMG_0945.jpg" },
  { src: "/virtualstore/IMG_0946.jpg" },
  { src: "/virtualstore/IMG_0947.jpg" },
  { src: "/virtualstore/IMG_0948.jpg" },
  { src: "/virtualstore/IMG_0949.jpg" },
  { src: "/virtualstore/IMG_0950.jpg" },
  { src: "/virtualstore/IMG_0951.jpg" },
  { src: "/virtualstore/IMG_0952.jpg" },
  { src: "/virtualstore/IMG_0953.jpg" },
  { src: "/virtualstore/IMG_0954.jpg" },
  { src: "/virtualstore/IMG_0955.jpg" },
  { src: "/virtualstore/IMG_0956.jpg" },
  { src: "/virtualstore/IMG_0957.jpg" },
  { src: "/virtualstore/IMG_0958.jpg" },
  { src: "/virtualstore/IMG_0959.jpg" },
  { src: "/virtualstore/IMG_0960.jpg" },
  { src: "/virtualstore/IMG_0961.jpg" },
  { src: "/virtualstore/IMG_0962.jpg" },
  { src: "/virtualstore/IMG_0964.jpg" },
  { src: "/virtualstore/IMG_0965.jpg" },
  { src: "/virtualstore/IMG_0966.jpg" },
  { src: "/virtualstore/IMG_0967.jpg" },
  { src: "/virtualstore/IMG_0968.jpg" },
  { src: "/virtualstore/IMG_0969.jpg" },
  { src: "/virtualstore/IMG_0970.jpg" },
  { src: "/virtualstore/IMG_0971.jpg" },
  { src: "/virtualstore/IMG_0973.jpg" },
  { src: "/virtualstore/IMG_0974.jpg" },
  { src: "/virtualstore/IMG_0975.jpg" },
  { src: "/virtualstore/IMG_0976.jpg" },
  { src: "/virtualstore/IMG_0977.jpg" },
  { src: "/virtualstore/IMG_0978.jpg" },
  { src: "/virtualstore/IMG_0979.jpg" },
  { src: "/virtualstore/IMG_0982.jpg" },
  { src: "/virtualstore/IMG_0983.jpg" },
  { src: "/virtualstore/IMG_0984.jpg" },
  { src: "/virtualstore/IMG_0985.jpg" },
  { src: "/virtualstore/IMG_0986.jpg" },
  { src: "/virtualstore/IMG_0987.jpg" },
  { src: "/virtualstore/IMG_0988.jpg" },
  { src: "/virtualstore/IMG_0989.jpg" },
  { src: "/virtualstore/IMG_0990.jpg" },
  { src: "/virtualstore/IMG_0991.jpg" },
  { src: "/virtualstore/IMG_0992.jpg" },
  { src: "/virtualstore/IMG_0993.jpg" },
  { src: "/virtualstore/IMG_0994.jpg" },
  { src: "/virtualstore/IMG_0996.jpg" },
  { src: "/virtualstore/IMG_0997.jpg" },
  { src: "/virtualstore/IMG_0998.jpg" },
  { src: "/virtualstore/IMG_0999.jpg" },
  { src: "/virtualstore/IMG_1001.jpg" },
  { src: "/virtualstore/IMG_1002.jpg" },
  { src: "/virtualstore/IMG_1003.jpg" },
  { src: "/virtualstore/IMG_1004.jpg" },
  { src: "/virtualstore/IMG_1005.jpg" },
  { src: "/virtualstore/IMG_1006.jpg" },
  { src: "/virtualstore/IMG_1007.jpg" },
  { src: "/virtualstore/IMG_1008.jpg" },
]

export default function VirtualStore() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <h1
        className="mb-2 text-[#5c3317] text-center tracking-wide"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
        }}
      >
        Virtual Store
      </h1>
      <p className="mb-10 text-[#5c3317] text-xs text-center">
        See something you like?{" "}
        <a
          href="https://wa.me/19298408626"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-70 transition-opacity"
        >
          Send us a WhatsApp
        </a>
      </p>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {PRODUCTS.map((product, i) => (
          <figure key={product.src}>
            <Image
              src={product.src}
              alt={product.name ?? "Product available at Fazenda"}
              width={1200}
              height={1500}
              priority={i < 4}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 280px"
              className="w-full h-auto"
            />
            {(product.name || product.price) && (
              <figcaption className="mt-2 text-center text-[#5c3317] text-xs">
                {product.name}
                {product.price && <span className="block opacity-70">{product.price}</span>}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </main>
  )
}
