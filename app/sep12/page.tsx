import Link from "next/link"

export default function Sep12() {
  return (
    <main className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-[#5c3317] text-xs hover:opacity-70 transition-opacity">
            ← Back
          </Link>
          <div className="w-10" />
        </div>

        <div className="flex flex-col gap-6 text-[#5c3317] text-xs leading-relaxed">
          <p className="font-semibold text-sm">Opening Event — September 12</p>
          <p>
            Please join us for the Fazenda opening event! We&apos;ll be open starting 8am, please stop by for a morning coffee or come later in the day for some more coffee or snacks.
          </p>
        </div>
      </div>
    </main>
  )
}
