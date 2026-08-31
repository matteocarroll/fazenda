"use client"

import { useEffect, useRef, useState } from "react"

function BuffaloCanvas({ src, w, bodyFrac, fLegX, bLegX, legW, phase }: {
  src: string
  w: number
  bodyFrac: number
  fLegX: [number, number]
  bLegX: [number, number]
  legW: number
  phase: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new window.Image()
    img.src = src
    let raf: number
    let t = phase * Math.PI * 2

    img.onload = () => {
      const h = Math.round((img.naturalHeight * w) / img.naturalWidth)
      canvas.width = w
      canvas.height = h

      const bodyY = h * bodyFrac
      const legLen = h * (1 - bodyFrac) * 0.9
      const lw = w * legW

      const drawLeg = (x: number, y: number, angle: number, len: number, width: number, color: string) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.rect(-width / 2, 0, width, len * 0.8)
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(0, len * 0.8, width * 0.55, width * 0.42, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      const draw = () => {
        t += 0.068
        const s = Math.sin(t) * 0.27

        ctx.clearRect(0, 0, w, h)

        // Far legs (slightly lighter, behind)
        drawLeg(w * fLegX[1], bodyY, -s, legLen, lw * 0.7, "#2e2e2e")
        drawLeg(w * bLegX[1], bodyY,  s, legLen, lw * 0.7, "#2e2e2e")
        // Near legs (black, in front)
        drawLeg(w * fLegX[0], bodyY,  s, legLen, lw, "#080808")
        drawLeg(w * bLegX[0], bodyY, -s, legLen, lw, "#080808")

        // Paste body on top (clipped above bodyY)
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, w, bodyY + 8)
        ctx.clip()
        ctx.drawImage(img, 0, 0, w, h)
        ctx.restore()

        raf = requestAnimationFrame(draw)
      }

      draw()
    }

    return () => cancelAnimationFrame(raf)
  }, [src, w, bodyFrac, fLegX, bLegX, legW, phase])

  return <canvas ref={ref} style={{ display: "block" }} />
}

const FULL = "September 12 2026\nOpening Day Event\nRSVP for DJ, Drinks, and Special Guests\n\nPlease join us for the Fazenda opening event! We'll be open starting 8am, please stop by for a morning coffee or come later in the day for some more coffee or snacks."

export default function Sep12() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count >= FULL.length) return
    const t = setTimeout(() => setCount((c) => c + 1), 30)
    return () => clearTimeout(t)
  }, [count])

  const displayed = FULL.slice(0, count)
  const [headerPart, ...rest] = displayed.split("\n\n")
  const headerLines = headerPart.split("\n").filter(Boolean)
  const bodyPart = rest.join("\n\n")

  return (
    <main className="min-h-screen bg-white overflow-hidden flex flex-col">
      <style>{`
        @keyframes bwalk {
          from { transform: translateX(-400px); }
          to   { transform: translateX(calc(100vw + 200px)); }
        }
        .bw { position: absolute; bottom: 0; animation: bwalk 13s linear infinite; }
        .bw1 { animation-delay: 0s; }
        .bw2 { animation-delay: -5.2s; bottom: 10px; }
        .bw3 { animation-delay: -9.1s; bottom: 20px; }
      `}</style>

      <div style={{ position: "relative", height: 210, flexShrink: 0 }}>
        <div className="bw bw1">
          <BuffaloCanvas src="/LeadBuffalo_Black.png" w={275} bodyFrac={0.62} fLegX={[0.71, 0.77]} bLegX={[0.20, 0.26]} legW={0.058} phase={0} />
        </div>
        <div className="bw bw2">
          <BuffaloCanvas src="/RearBuffalo_Black.png" w={255} bodyFrac={0.62} fLegX={[0.70, 0.76]} bLegX={[0.21, 0.27]} legW={0.056} phase={0.33} />
        </div>
        <div className="bw bw3">
          <BuffaloCanvas src="/BabyBuffaloBlack.png" w={150} bodyFrac={0.60} fLegX={[0.67, 0.73]} bLegX={[0.19, 0.25]} legW={0.062} phase={0.67} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 text-[#5c3317] text-xs text-center px-6 py-10 leading-relaxed max-w-xl mx-auto w-full">
        <div className="flex flex-col gap-1">
          {headerLines.map((line, i) => (
            <p key={i} className="font-semibold text-sm">{line}</p>
          ))}
          {count < FULL.length && !bodyPart && <span className="animate-pulse inline-block">|</span>}
        </div>
        {bodyPart && (
          <p className="max-w-sm">
            {bodyPart}
            {count < FULL.length && <span className="animate-pulse">|</span>}
          </p>
        )}
      </div>
    </main>
  )
}
