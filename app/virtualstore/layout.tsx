import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Virtual Store",
  description:
    "Browse what is on the rail at Fazenda: Barena, Cale, Kota Gushiken, Misci, Valstar, Blue Blue Japan, Labo Art and Purple Mountain Observatory. Message us on WhatsApp with any questions, or come and see it at 177 Mott Street.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
