// Server-only: reads Valtrix with VALTRIX_API_KEY. Never import from a client component.

export type LeaderboardEntry = { rank: number; name: string; orders: number }

/* The page is public: a named guest shows as first name and last initial,
   anyone else by phone number masked to the last four digits. */
function shortName(name: string | null | undefined): string | null {
  const [first, ...rest] = (name ?? "").trim().split(/\s+/).filter(Boolean)
  if (!first) return null
  const last = rest.at(-1)
  return last ? `${first} ${last[0]}.` : first
}

function maskPhone(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "")
  return digits.length >= 4 ? `•••-${digits.slice(-4)}` : "Guest"
}

/* An empty board, not a broken page, when Valtrix is unreachable or the key
   is not configured. The generated client throws on import without a key. */
export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  try {
    return await readLeaderboard(limit)
  } catch (error) {
    console.error("leaderboard: Valtrix read failed", error)
    return []
  }
}

/* Ranks guestbook guests by the visit count the point of sale keeps on each
   guest. Guestbook entries sharing a phone number are one person, so their
   visits are added together and any name on one of them is used. Full numbers never leave this function, so
   they stay out of the page and its payload. */
async function readLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
  const { valtrix } = await import("@/valtrix/client")
  const visitsByPhone = new Map<string, number>()
  const nameByPhone = new Map<string, string>()
  for await (const guest of valtrix.records.customer.iterate({
    where: { visit_count: { gt: 0 }, phone: { not: null } },
    select: ["phone", "visit_count", "name"],
    limit: 200,
  })) {
    const phone = guest.phone!.replace(/\D/g, "")
    visitsByPhone.set(phone, (visitsByPhone.get(phone) ?? 0) + (guest.visit_count ?? 0))
    const name = shortName(guest.name)
    if (name && !nameByPhone.has(phone)) nameByPhone.set(phone, name)
  }

  return [...visitsByPhone.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([phone, orders], i) => ({ rank: i + 1, name: nameByPhone.get(phone) ?? maskPhone(phone), orders }))
}
