import type { Metadata } from "next"

import WalkingBuffalo from "@/components/WalkingBuffalo"

export const metadata: Metadata = {
  title: "Events",
  description:
    "Events at Fazenda, 177 Mott Street, New York — wine nights, openings and everything else we put on.",
}

export default function Events() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-6 py-12">
      <WalkingBuffalo className="w-[160px] max-w-full" />
      <p className="text-[#5c3317] text-xs">Next event soon</p>
    </main>
  )
}
