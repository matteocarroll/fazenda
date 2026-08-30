export default function Sep12() {
  return (
    <main className="min-h-screen bg-white py-12 px-6">
      <style>{`
        @keyframes spin {
          from { transform: rotateY(0deg) rotateX(15deg); }
          to   { transform: rotateY(360deg) rotateX(15deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
        .disco-ball {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff 0%, #ccc 30%, #888 60%, #555 100%);
          position: relative;
          animation: spin 3s linear infinite;
          box-shadow:
            inset -10px -10px 20px rgba(0,0,0,0.4),
            0 0 30px rgba(200,200,255,0.3);
        }
        .disco-ball::before {
          content: '';
          position: absolute;
          inset: 4px;
          border-radius: 50%;
          background: repeating-conic-gradient(
            rgba(255,255,255,0.15) 0deg 10deg,
            transparent 10deg 20deg
          );
        }
        .disco-ball::after {
          content: '';
          position: absolute;
          top: 12%;
          left: 20%;
          width: 25%;
          height: 18%;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
          filter: blur(4px);
        }
        .sparkle {
          position: absolute;
          border-radius: 50%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-xl mx-auto flex flex-col items-center gap-10 text-[#5c3317] text-xs leading-relaxed">

        <div style={{ position: "relative", width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="disco-ball" />
          {[
            { top: "10%",  left: "75%",  size: 6,  delay: "0s",    color: "#f0a0ff" },
            { top: "70%",  left: "80%",  size: 4,  delay: "0.3s",  color: "#a0d0ff" },
            { top: "80%",  left: "10%",  size: 5,  delay: "0.6s",  color: "#ffffa0" },
            { top: "15%",  left: "5%",   size: 4,  delay: "0.9s",  color: "#a0ffa0" },
            { top: "50%",  left: "90%",  size: 3,  delay: "1.1s",  color: "#ffd0a0" },
            { top: "90%",  left: "45%",  size: 5,  delay: "1.4s",  color: "#f0a0ff" },
          ].map((s, i) => (
            <span
              key={i}
              className="sparkle"
              style={{
                top: s.top, left: s.left,
                width: s.size, height: s.size,
                background: s.color,
                animationDelay: s.delay,
                boxShadow: `0 0 6px 2px ${s.color}`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4 text-center">
          <p className="font-semibold text-sm">Opening Event — September 12</p>
          <p>
            Please join us for the Fazenda opening event! We&apos;ll be open starting 8am, please stop by for a morning coffee or come later in the day for some more coffee or snacks.
          </p>
        </div>
      </div>
    </main>
  )
}
