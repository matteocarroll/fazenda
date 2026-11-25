import type { Metadata } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Sur Marina at Fazenda",
  description:
    "RSVP for an evening with Sur Marina at Fazenda, Thursday December 3rd, 7–10pm, 177 Mott Street, New York.",
}

export default function SurMarinaLayout({ children }: { children: React.ReactNode }) {
  return children
}
