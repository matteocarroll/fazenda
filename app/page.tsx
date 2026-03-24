import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between py-8">
      <div className="flex flex-col items-center gap-6 pt-16">
        <Image
          src="/fazenda-text-logo.png"
          alt="FAZENDA"
          width={140}
          height={19}
          className="w-auto h-auto max-w-[30vw]"
          priority
        />
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
