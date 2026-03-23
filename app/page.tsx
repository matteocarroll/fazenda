import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-between py-8">
      <div className="flex-1 flex items-center justify-center">
        <Image
          src="/fazenda-text-logo.png"
          alt="FAZENDA"
          width={200}
          height={27}
          className="w-auto h-auto max-w-[40vw]"
          priority
        />
      </div>
      <footer className="pb-4">
        <p className="text-[#5c3317] text-xs font-mono">support@fazendacompany.com</p>
      </footer>
    </main>
  )
}
