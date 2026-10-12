import type { Metadata } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Events",
  description:
    "Events at Fazenda, 177 Mott Street, New York. RSVP for wine nights, openings and everything else we put on.",
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
