"use client"

import { useState } from "react"

/* Password form shown until the cookie is set. The page content is rendered
   server-side only after that, so it is never in the HTML of this view. */
export default function Gate() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(false)
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gate: "nov22", password }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error()
      /* Reload so the server component picks up the cookie. */
      window.location.reload()
    } catch {
      setError(true)
      setSending(false)
    }
  }

  return (
    <section className="gate">
      <p className="gate-label">Password</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          autoComplete="off"
          autoCapitalize="off"
          autoFocus
          aria-label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={sending || !password}>
          {sending ? "Checking…" : "Enter"}
        </button>
        {error && <p className="msg">That&rsquo;s not it. Try again.</p>}
      </form>
    </section>
  )
}
