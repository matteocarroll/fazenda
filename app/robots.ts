import type { MetadataRoute } from "next"

const BASE = "https://www.fazenda.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal or unlinked pages, kept out of search results.
      disallow: ["/barista", "/bynight", "/collection-1", "/journey", "/leaderboard", "/visual"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
