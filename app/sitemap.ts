import type { MetadataRoute } from "next"

import { POSTS } from "@/lib/journal"

const BASE = "https://www.fazenda.com"

// Public pages only. The internal and unlinked ones — /barista, /collection-1,
// /journey, /leaderboard, /visual — are deliberately left out.
const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/virtualstore", priority: 0.9 },
  { path: "/brands", priority: 0.8 },
  { path: "/store", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/faq", priority: 0.7 },
  { path: "/journal", priority: 0.6 },
  { path: "/events", priority: 0.6 },
  { path: "/openingevent", priority: 0.4 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...ROUTES.map(({ path, priority }) => ({
      url: `${BASE}${path}`,
      priority,
    })),
    ...POSTS.map((post) => ({
      url: `${BASE}/journal/${post.slug}`,
      lastModified: post.updated ?? post.published,
      priority: 0.5,
    })),
  ]
}
