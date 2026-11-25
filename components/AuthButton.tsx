"use client"

import { useState, useEffect } from "react"
import type { Session } from "@/lib/auth"
import type { ShopifyCustomer } from "@/lib/shopify-customer"

type MeResponse = { session: Session; customer: ShopifyCustomer | null } | null

export default function AuthButton() {
  const [me, setMe] = useState<MeResponse>(undefined as unknown as MeResponse)
  const [modal, setModal] = useState<"signin" | "account" | null>(null)
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "sent">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load session on mount + after auth redirect
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe(null))
  }, [])

  // Handle ?auth= redirect param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const auth = params.get("auth")
    if (auth === "success") {
      // Reload me
      fetch("/api/auth/me").then((r) => r.json()).then(setMe)
      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete("auth")
      window.history.replaceState({}, "", url.toString())
    } else if (auth === "expired" || auth === "invalid") {
      setError("That link has expired — please request a new one.")
      setModal("signin")
      const url = new URL(window.location.href)
      url.searchParams.delete("auth")
      window.history.replaceState({}, "", url.toString())
    }
  }, [])

  const sendLink = async () => {
    if (!email.includes("@")) { setError("Enter a valid email"); return }
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/auth/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep("sent")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" })
    setMe(null)
    setModal(null)
  }

  const closeModal = () => {
    setModal(null)
    setStep("email")
    setEmail("")
    setError(null)
  }

  // Still loading
  if (me === (undefined as unknown as MeResponse)) return null

  return (
    <>
      {me ? (
        <button
          type="button"
          onClick={() => setModal("account")}
          className="text-[13px] transition-opacity hover:opacity-50"
        >
          {me.session.name ?? me.session.email.split("@")[0]}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setModal("signin")}
          className="text-[13px] opacity-40 transition-opacity hover:opacity-70"
        >
          Sign in
        </button>
      )}

      {/* Sign-in modal */}
      {modal === "signin" && (
        <div
          role="dialog"
          aria-modal
          aria-label="Sign in"
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[13px] font-medium">Sign in to Fazenda</span>
              <button type="button" onClick={closeModal} className="text-xs opacity-40 hover:opacity-70">✕</button>
            </div>

            {step === "email" ? (
              <>
                <p className="mb-4 text-[11px] opacity-50">
                  Enter your email and we&apos;ll send you a sign-in link. If you&apos;ve ordered with us before, your account will link automatically.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendLink()}
                  placeholder="your@email.com"
                  autoFocus
                  className="mb-3 w-full rounded-lg border border-black/15 px-3 py-2.5 text-[13px] outline-none focus:border-black"
                />
                {error && <p className="mb-2 text-[10px] text-red-500">{error}</p>}
                <button
                  type="button"
                  onClick={sendLink}
                  disabled={loading}
                  className="w-full rounded-lg bg-black py-2.5 text-[13px] text-white transition-opacity hover:opacity-70 disabled:opacity-40"
                >
                  {loading ? "Sending…" : "Send sign-in link"}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-2xl mb-3">✉️</p>
                <p className="text-[13px] font-medium mb-1">Check your email</p>
                <p className="text-[11px] opacity-50">
                  We sent a sign-in link to <strong>{email}</strong>. It expires in 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="mt-4 text-[11px] underline underline-offset-2 opacity-40 hover:opacity-70"
                >
                  Use a different email
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account panel */}
      {modal === "account" && me && (
        <div
          role="dialog"
          aria-modal
          aria-label="Your account"
          onClick={closeModal}
          className="fixed inset-0 z-50 overflow-y-auto bg-white"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          <div onClick={(e) => e.stopPropagation()} className="min-h-full">
            {/* Header */}
            <div className="sticky top-0 bg-white">
              <div className="relative flex h-11 items-center px-4 sm:px-6">
                <span className="text-[13px]">
                  {me.session.name ?? me.session.email}
                </span>
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute right-4 text-[13px] opacity-40 hover:opacity-70"
                >
                  Close
                </button>
              </div>
              <div className="h-px bg-black/10" />
            </div>

            <div className="px-4 py-6 sm:px-6">
              {/* Orders */}
              {me.customer && me.customer.ordersCount > 0 ? (
                <>
                  <p className="mb-4 text-[11px] opacity-40">
                    {me.customer.ordersCount} order{me.customer.ordersCount !== 1 ? "s" : ""} with Fazenda
                  </p>
                  <div className="space-y-3">
                    {me.customer.orders.map((order) => (
                      <div key={order.id} className="border-t border-black/10 pt-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-[13px]">{order.name}</span>
                          <span className="text-[11px] opacity-40">
                            {new Date(order.processedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] opacity-50">
                          {order.lineItems.map((li) => `${li.quantity}× ${li.title}`).join(", ")}
                        </div>
                        <div className="mt-0.5 text-[11px]">
                          {order.totalPrice.currencyCode} {parseFloat(order.totalPrice.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : me.customer ? (
                <p className="text-[11px] opacity-40">No orders yet.</p>
              ) : (
                <p className="text-[11px] opacity-40">
                  No previous orders found for {me.session.email}.
                </p>
              )}

              <button
                type="button"
                onClick={signOut}
                className="mt-10 text-[11px] underline underline-offset-2 opacity-30 hover:opacity-60"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
