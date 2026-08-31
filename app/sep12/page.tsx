import Image from "next/image"

export default function Sep12() {
  return (
    <main className="min-h-screen bg-white overflow-hidden flex flex-col">
      <style>{`
        @keyframes walk1 {
          from { transform: translateX(-500px); }
          to   { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes walk2 {
          from { transform: translateX(-500px); }
          to   { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes walk3 {
          from { transform: translateX(-500px); }
          to   { transform: translateX(calc(100vw + 100px)); }
        }
        .buffalo-1 {
          animation: walk1 10s linear infinite;
          animation-delay: 0s;
        }
        .buffalo-2 {
          animation: walk2 10s linear infinite;
          animation-delay: -4s;
        }
        .buffalo-3 {
          animation: walk3 10s linear infinite;
          animation-delay: -7s;
        }
      `}</style>

      {/* Buffalo parade */}
      <div style={{ position: "relative", height: 220, flexShrink: 0 }}>
        <div className="buffalo-1" style={{ position: "absolute", bottom: 10 }}>
          <Image src="/LeadBuffalo_Black.png" alt="buffalo" width={280} height={210} style={{ width: 280, height: "auto" }} />
        </div>
        <div className="buffalo-2" style={{ position: "absolute", bottom: 10 }}>
          <Image src="/RearBuffalo_Black.png" alt="buffalo" width={260} height={195} style={{ width: 260, height: "auto" }} />
        </div>
        <div className="buffalo-3" style={{ position: "absolute", bottom: 10 }}>
          <Image src="/BabyBuffaloBlack.png" alt="baby buffalo" width={160} height={120} style={{ width: 160, height: "auto" }} />
        </div>
      </div>

      {/* Event text */}
      <div className="flex flex-col items-center gap-6 text-[#5c3317] text-xs text-center px-6 py-10 leading-relaxed max-w-xl mx-auto w-full">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm">September 12 2026</p>
          <p className="font-semibold text-sm">Opening Day Event</p>
          <p className="font-semibold text-sm">RSVP for DJ, Drinks, and Special Guests</p>
        </div>
        <p>
          Please join us for the Fazenda opening event! We&apos;ll be open starting 8am, please stop by for a morning coffee or come later in the day for some more coffee or snacks.
        </p>
      </div>
    </main>
  )
}
