import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/react"

import JsonLd from "@/components/JsonLd"
import { BRANDS } from "@/lib/brands"
import "./globals.css"

const DESCRIPTION =
  "A multibrand menswear store and coffee shop at 177 Mott Street, New York. Barena, Cale, Kota Gushiken, Misci, Valstar, Blue Blue Japan and more."

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fazenda.com"),
  title: {
    default: "Fazenda — Multibrand Menswear Store, New York",
    template: "%s | Fazenda",
  },
  description: DESCRIPTION,
  alternates: { canonical: "./" },
  // No title/description here on purpose: each page's own ones are used,
  // so a shared link shows that page rather than always the homepage.
  openGraph: {
    type: "website",
    siteName: "Fazenda",
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "The Fazenda storefront on Mott Street, New York",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ClothingStore",
            name: "Fazenda",
            description: DESCRIPTION,
            url: "https://www.fazenda.com",
            image: "https://www.fazenda.com/og.jpg",
            email: "support@fazenda.com",
            telephone: "+1-929-840-8626",
            address: {
              "@type": "PostalAddress",
              streetAddress: "177 Mott Street",
              addressLocality: "New York",
              addressRegion: "NY",
              postalCode: "10012",
              addressCountry: "US",
            },
            brand: BRANDS.map((name) => ({ "@type": "Brand", name })),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
