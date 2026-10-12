import Link from "next/link"
import type { Metadata } from "next"

import JsonLd from "@/components/JsonLd"

const BROWN = "#5c3317"
const WHATSAPP = "https://wa.me/19298408626"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions we get asked at Fazenda: where we are, which brands we carry, how to buy, and how to reach us.",
}

/**
 * Every answer here has to be true, because it is also published as FAQPage
 * markup. Anything we cannot state accurately yet — opening hours, returns,
 * shipping — is left out rather than guessed at.
 */
const FAQS: { q: string; a: string }[] = [
  {
    q: "Where is Fazenda?",
    a: "177 Mott Street, New York, NY 10012, in Nolita between Broome and Kenmare.",
  },
  {
    q: "What is Fazenda?",
    a: "A multibrand menswear store and coffee shop in the same room. You can buy a jacket and a coffee in one visit, and plenty of people come in for one and leave with both.",
  },
  {
    q: "Which brands do you carry?",
    a: "Altea, Barena, Blue Blue Japan, Cale, Ciota, Deadwood, Erevan, Handred, Husbands Paris, Kota Gushiken, Kuro, Labo Art, Massimo Alba, Misci, Osklen, Purple Mountain Observatory, Valstar and Wax London. Baziszt, District Vision, RANRA, Sunflower and Suntosons are arriving soon.",
  },
  {
    q: "Can I buy online?",
    a: "There is no checkout on the site yet. The virtual store shows what is currently on the rail, and the fastest way to buy or reserve something is to message us on WhatsApp — every product has a link that opens a message with the item already filled in.",
  },
  {
    q: "Can you check whether something is in stock, or in my size?",
    a: "Yes. Message us on WhatsApp with the piece you are after and we will check and reply. If we do not have your size we can usually tell you whether it is coming.",
  },
  {
    q: "Do you serve coffee?",
    a: "Yes. The café runs alongside the store, and you are welcome to sit with a coffee without buying clothes.",
  },
  {
    q: "Do you host events?",
    a: "Regularly — opening nights, wine nights and other evenings in the store. Details and RSVPs go on the events page.",
  },
  {
    q: "How do I get in touch?",
    a: "WhatsApp is quickest, on +1 929 840 8626. For anything else, support@fazenda.com.",
  },
]

export default function Faq() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />

      <div className="mx-auto max-w-2xl">
        <h1
          className="mb-12 text-center"
          style={{
            color: BROWN,
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
          }}
        >
          Frequently Asked Questions
        </h1>

        <dl className="flex flex-col gap-8">
          {FAQS.map(({ q, a }) => (
            <div key={q}>
              <dt
                className="mb-1"
                style={{
                  color: BROWN,
                  fontFamily: '"Times New Roman", Times, serif',
                  fontSize: "1rem",
                }}
              >
                {q}
              </dt>
              <dd className="text-xs leading-relaxed opacity-80" style={{ color: BROWN }}>
                {a}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-16 text-center text-xs" style={{ color: BROWN }}>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-70"
          >
            Message us on WhatsApp
          </a>
          {" · "}
          <Link href="/journal" className="underline hover:opacity-70">
            Journal
          </Link>
          {" · "}
          <Link href="/virtualstore" className="underline hover:opacity-70">
            Virtual store
          </Link>
        </p>
      </div>
    </main>
  )
}
