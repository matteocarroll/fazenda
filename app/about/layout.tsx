import type { Metadata } from "next"

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "About",
  description:
    "About Fazenda, a multibrand menswear store and coffee shop at 177 Mott Street, New York.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
