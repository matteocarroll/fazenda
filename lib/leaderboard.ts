// Server-only: reads Valtrix with VALTRIX_API_KEY. Never import from a client component.

export type LeaderboardEntry = { customerId: string; name: string; orders: number }

/* Guests are shown by phone number for now, masked to the last four digits
   since the page is public. */
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

async function readLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
  const { valtrix } = await import("@/valtrix/client")
  const counts = new Map<string, number>()
  for await (const order of valtrix.records.order.iterate({
    where: { customer_id: { not: null }, status: { neq: "cancelled" } },
    select: ["customer_id"],
    limit: 200,
  })) {
    const id = order.customer_id!
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
  if (top.length === 0) return []

  const customers = await valtrix.records.customer.findMany({
    where: { _record_id: { in: top.map(([id]) => id) } },
    select: ["phone"],
    limit: 200,
  })
  const phoneById = new Map(customers.map((c) => [c._record_id, c.phone]))

  return top.map(([customerId, orders]) => ({
    customerId,
    name: maskPhone(phoneById.get(customerId)),
    orders,
  }))
}
