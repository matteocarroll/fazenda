// Server-only: guest names come from the RSVP sheet, drink counts from Redis.

import { createHash } from "crypto"

export type DrinkType = "beer" | "wine"
export type Drinker = { id: string; name: string; beer: number; wine: number }

/* Only column B (Name) is requested, so emails and phones never reach us. */
const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/1ETM3X-rgNK3t0uDacpn7j_F-UwzSelsgYAiCOdWBPik/gviz/tq?tqx=out:csv&gid=584292939&tq=select%20B"

const KEY: Record<DrinkType, string> = { beer: "bynight:beer", wine: "bynight:wine" }

function shortName(full: string): string {
  const [first, ...rest] = full.split(" ")
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1)
  const last = rest.at(-1)
  return last ? `${cap(first)} ${last[0].toUpperCase()}.` : cap(first)
}

/* A stable id per guest that doesn't reveal their full name. */
function idFor(full: string): string {
  return createHash("sha1").update(full.toLowerCase()).digest("hex").slice(0, 10)
}

/* Guests in sheet order, duplicate RSVPs folded into one. */
export async function getGuests(): Promise<{ id: string; name: string }[]> {
  const res = await fetch(SHEET_CSV, { next: { revalidate: 30 } })
  const text = await res.text()
  /* Google sometimes answers with an HTML page instead of CSV; treat that as
     a failed read rather than an empty guest list. */
  if (!res.ok || !text.startsWith('"Name"')) throw new Error(`sheet ${res.status}`)
  const lines = text.split("\n").slice(1)
  const seen = new Set<string>()
  const guests: { id: string; name: string }[] = []
  for (const line of lines) {
    const full = line.replace(/^"|"$/g, "").replace(/""/g, '"').trim().replace(/\s+/g, " ")
    const id = full && idFor(full)
    if (!id || seen.has(id)) continue
    seen.add(id)
    guests.push({ id, name: shortName(full) })
  }
  return guests
}

async function redis<T>(command: (string | number)[]): Promise<T> {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error("Redis not configured")
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
    cache: "no-store",
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result as T
}

/* HGETALL comes back as a flat [field, value, field, value, ...] list. */
async function counts(type: DrinkType): Promise<Map<string, number>> {
  const flat = await redis<string[]>(["HGETALL", KEY[type]])
  const map = new Map<string, number>()
  for (let i = 0; i < flat.length; i += 2) map.set(flat[i], Number(flat[i + 1]) || 0)
  return map
}

export async function getDrinkers(): Promise<Drinker[]> {
  const [guests, beer, wine] = await Promise.all([getGuests(), counts("beer"), counts("wine")])
  return guests.map((g) => ({ ...g, beer: beer.get(g.id) ?? 0, wine: wine.get(g.id) ?? 0 }))
}

/* Atomic add that never lets a count drop below zero. */
const ADD_FLOORED = `
local v = redis.call('HINCRBY', KEYS[1], ARGV[1], ARGV[2])
if v < 0 then redis.call('HSET', KEYS[1], ARGV[1], 0) v = 0 end
return v`

export async function addDrink(id: string, type: DrinkType, delta: 1 | -1): Promise<number> {
  return redis<number>(["EVAL", ADD_FLOORED, 1, KEY[type], id, delta])
}
