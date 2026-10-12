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
    a: "No — we do not sell online, and there is no checkout on the site. The virtual store is there so you can see what is on the rail before you come in. First purchases happen in the store.",
  },
  {
    q: "So how does buying work?",
    a: "Come to Mott Street and buy in person. Once you have, you are a client, and from then on we can look after you remotely — we will find pieces for you, hold things back, and sort out a purchase over WhatsApp, iMessage or email without you coming in each time.",
  },
  {
    q: "Can you check whether something is in stock, or in my size?",
    a: "Yes, and you do not need to be a client to ask. Message us on WhatsApp with the piece you are after and we will check and reply. If we do not have your size we can usually tell you whether it is coming.",
  },
  {
    q: "Do you accept returns?",
    a: "We do not take returns, but we are happy to exchange. Bring the piece back unworn and with its tags, and we will swap it for another size or something else in the store. If you are unsure whether something qualifies, message us before you come in.",
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
    a: "WhatsApp is quickest, on +1 929 840 8626. We are also on iMessage on the same number, and at support@fazenda.com.",
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
