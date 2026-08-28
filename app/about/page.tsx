"use client"

import Link from "next/link"
import { useState } from "react"

export default function About() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-white py-12 px-6" >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-[#5c3317] text-xs hover:opacity-70 transition-opacity">
            ← Back
          </Link>
          <h1 className="text-[#5c3317] text-xs">About</h1>
          <div className="w-10" />
        </div>

        <div className="flex flex-col items-center gap-10">
          <p className="text-[#5c3317] text-xs text-center max-w-sm leading-relaxed">
            Fazenda is a multibrand menswear store featuring premium international brands, opening this summer.
          </p>
          <p className="text-[#5c3317] text-xs text-center max-w-sm leading-relaxed">
            Sign up below to get notified once we open.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 text-center max-w-sm">
              <p className="text-[#5c3317] text-xs leading-relaxed">
                Obrigado and hope to see you soon.
              </p>
              <p className="text-[#5c3317] text-xs leading-relaxed">
                For product requests/help or to learn more, feel free to{" "}
                <a
                  href="https://wa.me/19298408626"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70 transition-opacity"
                >
                  send us a WhatsApp
                </a>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-full max-w-xs">
              <input
                type="text"
                placeholder="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-b border-[#5c3317] bg-transparent text-[#5c3317] text-xs py-1 outline-none placeholder-[#5c3317]/50 text-center"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-b border-[#5c3317] bg-transparent text-[#5c3317] text-xs py-1 outline-none placeholder-[#5c3317]/50 text-center"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border-b border-[#5c3317] bg-transparent text-[#5c3317] text-xs py-1 outline-none placeholder-[#5c3317]/50 text-center"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 text-[#5c3317] text-xs hover:opacity-70 transition-opacity disabled:opacity-40"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
