import type { Metadata } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Booch X Fazenda Preview Night",
  description:
    "RSVP for Booch X Fazenda Preview Night, Friday October 23rd, 7–10pm, 177 Mott Street, New York.",
}

export default function BoochBagsLayout({ children }: { children: React.ReactNode }) {
  return children
}
