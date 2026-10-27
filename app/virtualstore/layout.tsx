import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Virtual Store",
  description:
    "Browse what is on the rail at Fazenda: Barena, Massimo Alba, Cale, Valstar, Blue Blue Japan, Husbands Paris, Purple Mountain Observatory and more. Message us on WhatsApp with any questions, or come and see it at 177 Mott Street.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
