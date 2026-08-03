import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between py-8 relative">
      <div className="absolute top-6 right-8 flex gap-6">
        <Link
          href="/about"
          className="text-[#5c3317] text-xs hover:opacity-70 transition-opacity"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          About
        </Link>
        <Link
          href="/collection-1"
          className="text-[#5c3317] text-xs hover:opacity-70 transition-opacity"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          Collection Primeira
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <Image
          src="/fazenda_logo_w2.png"
          alt="FAZENDA"
          width={400}
          height={83}
          className="w-auto h-auto max-w-[180px]"
          priority
        />
        <div className="flex flex-col items-center gap-1" style={{ fontFamily: "Arial, sans-serif" }}>
          <p className="text-[#5c3317] text-xs">177 Mott Street, 10022, New York</p>
          <p className="text-[#5c3317] text-xs">Opening Summer 2026</p>
        </div>
        <p className="text-[#5c3317] text-xs" style={{ fontFamily: "Arial, sans-serif" }}>
          For product requests/help, please{" "}
          <a
            href="https://wa.me/19298408626"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-70 transition-opacity"
          >
            send us a WhatsApp
          </a>
        </p>
      </div>
      <footer className="pb-4">
        <p className="text-[#5c3317] text-xs" style={{ fontFamily: "Arial, sans-serif" }}>support@fazendacompany.com</p>
      </footer>
    </main>
  )
}
