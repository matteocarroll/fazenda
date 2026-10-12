import Link from "next/link"
import type { Metadata } from "next"

import JsonLd from "@/components/JsonLd"
import { POSTS } from "@/lib/journal"

const BROWN = "#5c3317"

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on menswear from Fazenda: how to buy a suede jacket, how to care for fine knitwear, and how trousers should fit.",
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

export default function Journal() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Fazenda Journal",
          url: "https://www.fazenda.com/journal",
          publisher: { "@type": "Organization", name: "Fazenda" },
          blogPost: POSTS.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.summary,
            datePublished: post.published,
            url: `https://www.fazenda.com/journal/${post.slug}`,
          })),
        }}
      />

      <div className="mx-auto max-w-2xl">
        <h1
          className="mb-2 text-center"
          style={{
            color: BROWN,
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
          }}
        >
          Journal
        </h1>
        <p className="mb-12 text-center text-xs" style={{ color: BROWN }}>
          Notes on what we sell and how to live with it.
        </p>

        <ul className="flex flex-col gap-10">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link href={`/journal/${post.slug}`} className="group block">
                <h2
                  className="mb-1 underline-offset-4 group-hover:underline"
                  style={{
                    color: BROWN,
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: "1rem",
                  }}
                >
                  {post.title}
                </h2>
                <p className="mb-1 text-xs leading-relaxed opacity-70" style={{ color: BROWN }}>
                  {post.summary}
                </p>
                <time
                  dateTime={post.published}
                  className="text-[0.625rem] opacity-50"
                  style={{ color: BROWN }}
                >
                  {formatDate(post.published)}
                </time>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-16 text-center text-xs" style={{ color: BROWN }}>
          <Link href="/faq" className="underline hover:opacity-70">
            Frequently asked questions
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
