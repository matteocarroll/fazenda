import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { cache } from "react"

const SESSION_COOKIE = "fazenda_session"
const MAGIC_COOKIE = "fazenda_magic" // stores pending email during verify
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days
const MAGIC_MAX_AGE = 60 * 15 // 15 minutes

function secret() {
  const s = process.env.AUTH_SECRET
  if (!s) throw new Error("AUTH_SECRET is not set")
  return new TextEncoder().encode(s)
}

export type Session = {
  email: string
  name?: string
  shopifyCustomerId?: string
}

// ----- magic link token -----

export async function signMagicToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAGIC_MAX_AGE}s`)
    .sign(secret())
}

export async function verifyMagicToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return typeof payload.email === "string" ? payload.email : null
  } catch {
    return null
  }
}

// ----- session cookie -----

export async function createSession(session: Session): Promise<void> {
  const token = await new SignJWT(session as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret())

  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

export async function deleteSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

export const getSession = cache(async (): Promise<Session | null> => {
  try {
    const jar = await cookies()
    const token = jar.get(SESSION_COOKIE)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, secret())
    return payload as unknown as Session
  } catch {
    return null
  }
})
