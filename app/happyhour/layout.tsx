import type { Metadata } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Happy Hour at Fazenda",
  description:
    "Invite only. Join us for happy hour with our friends and family at Fazenda — November 13th, 5–7pm, 177 Mott Street, New York.",
}

export default function HappyHourLayout({ children }: { children: React.ReactNode }) {
  return children
}
