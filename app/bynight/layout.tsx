import type { Metadata } from "next"
import { Courier_Prime } from "next/font/google"

/* Courier Prime is not a system font, so it is loaded here and exposed as a
   variable the page's own stylesheet can reference. */
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-courier-prime",
})

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "DONAFLOR at Fazenda",
  description:
    "A private wine night at Fazenda on Thursday October 22nd with João Diniz (Donaflor) playing. RSVP required — 177 Mott Street, New York.",
}

export default function ByNightLayout({ children }: { children: React.ReactNode }) {
  return <div className={courierPrime.variable}>{children}</div>
}
