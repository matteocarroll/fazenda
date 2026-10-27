import type { Metadata } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Side Eye at Fazenda",
  description:
    "RSVP for Introducing Side Eye at Fazenda, Thursday November 5th, 6–8pm, 177 Mott St, New York.",
}

export default function SideEyeLayout({ children }: { children: React.ReactNode }) {
  return children
}
