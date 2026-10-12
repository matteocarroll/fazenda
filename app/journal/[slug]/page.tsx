import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import JsonLd from "@/components/JsonLd"
import { POSTS, getPost } from "@/lib/journal"

const BROWN = "#5c3317"

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated,
    },
  }
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

export default async function JournalPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const url = `https://www.fazenda.com/journal/${post.slug}`

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: post.published,
          ...(post.updated ? { dateModified: post.updated } : {}),
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          url,
          image: "https://www.fazenda.com/og.jpg",
          author: { "@type": "Organization", name: "Fazenda" },
          publisher: { "@type": "Organization", name: "Fazenda" },
        }}
      />

      <article className="mx-auto max-w-2xl">
        <h1
          className="mb-2"
          style={{
            color: BROWN,
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: "1.25rem",
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h1>
        <time
          dateTime={post.published}
          className="mb-10 block text-[0.625rem] opacity-50"
          style={{ color: BROWN }}
        >
          {formatDate(post.published)}
        </time>

        <div className="flex flex-col gap-5">
          {post.body.map((block, i) => {
            if (block.t === "h2") {
              return (
                <h2
                  key={i}
                  className="mt-4"
                  style={{
                    color: BROWN,
                    fontFamily: '"Times New Roman", Times, serif',
                    fontSize: "1rem",
                  }}
                >
                  {block.text}
                </h2>
              )
            }
            if (block.t === "ul") {
              return (
                <ul key={i} className="flex list-disc flex-col gap-2 pl-5">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="text-xs leading-relaxed"
                      style={{ color: BROWN }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )
            }
            return (
              <p key={i} className="text-xs leading-relaxed" style={{ color: BROWN }}>
                {block.text}
              </p>
            )
          })}
        </div>

        <p className="mt-16 text-center text-xs" style={{ color: BROWN }}>
          <Link href="/journal" className="underline hover:opacity-70">
            More from the journal
          </Link>
          {" · "}
          <Link href="/virtualstore" className="underline hover:opacity-70">
            Virtual store
          </Link>
        </p>
      </article>
    </main>
  )
}
