import ProductCard, { type Product } from "@/components/ProductCard"
import products from "@/data/virtualstore-products.json"

const PRODUCTS = products as Product[]

export default function VirtualStore() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-8">
      <h1
        className="mb-3 text-center text-[#5c3317]"
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

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}
