import type { Metadata } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "DONAFLOR at Fazenda",
  description:
    "A private wine night at Fazenda with Jay Diniz (Donaflor) playing. RSVP required — 177 Mott Street, New York.",
}

export default function ByNightLayout({ children }: { children: React.ReactNode }) {
  return children
}
