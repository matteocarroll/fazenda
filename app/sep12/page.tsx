export default function Sep12() {
  return (
    <main className="min-h-screen bg-white overflow-hidden flex flex-col">
      <style>{`
        @keyframes walkAcross {
          from { transform: translateX(-340px); }
          to   { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes legA {
          0%, 100% { transform: rotate(-22deg); }
          50%       { transform: rotate(22deg); }
        }
        @keyframes legB {
          0%, 100% { transform: rotate(22deg); }
          50%       { transform: rotate(-22deg); }
        }
        @keyframes tailSwing {
          0%, 100% { transform: rotate(-8deg); }
          50%       { transform: rotate(12deg); }
        }
        .buffalo-walk {
          animation: walkAcross 12s linear infinite;
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .buffalo-bob {
          animation: bob 0.65s ease-in-out infinite;
        }
        .leg-a {
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: legA 0.65s ease-in-out infinite;
        }
        .leg-b {
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: legB 0.65s ease-in-out infinite;
        }
        .buf-tail {
          transform-box: fill-box;
          transform-origin: 100% 0%;
          animation: tailSwing 1.3s ease-in-out infinite;
        }
      `}</style>

      {/* Walking buffalo strip */}
      <div style={{ position: "relative", height: 210, flexShrink: 0 }}>
        <div className="buffalo-walk">
          <div className="buffalo-bob">
            <svg viewBox="0 0 320 200" width="310" height="194" xmlns="http://www.w3.org/2000/svg" fill="black">

              {/* Back legs (behind body) */}
              <g className="leg-b">
                <rect x="80" y="132" width="11" height="54" rx="5" fill="#1a1a1a"/>
                <ellipse cx="85" cy="185" rx="10" ry="5" fill="#1a1a1a"/>
              </g>
              <g className="leg-a">
                <rect x="96" y="130" width="13" height="57" rx="6"/>
                <ellipse cx="102" cy="187" rx="11" ry="5"/>
              </g>

              {/* Front legs (behind body) */}
              <g className="leg-b">
                <rect x="192" y="130" width="11" height="54" rx="5" fill="#1a1a1a"/>
                <ellipse cx="197" cy="183" rx="10" ry="5" fill="#1a1a1a"/>
              </g>
              <g className="leg-a">
                <rect x="207" y="128" width="13" height="57" rx="6"/>
                <ellipse cx="213" cy="184" rx="11" ry="5"/>
              </g>

              {/* Body */}
              <ellipse cx="148" cy="90" rx="88" ry="48"/>

              {/* Rump hump */}
              <ellipse cx="72" cy="76" rx="36" ry="30"/>

              {/* Neck */}
              <ellipse cx="215" cy="84" rx="23" ry="44" transform="rotate(17 215 84)"/>

              {/* Head */}
              <ellipse cx="244" cy="113" rx="37" ry="29"/>

              {/* Muzzle */}
              <ellipse cx="276" cy="123" rx="19" ry="15"/>

              {/* Water buffalo horn (side view — wide curve) */}
              <path d="M 228 86 C 208 52, 220 22, 238 28 C 248 32, 248 46, 236 58 C 226 68, 234 84, 240 90"/>
              {/* Hint of far horn */}
              <path d="M 248 82 C 268 52, 280 38, 288 44 C 294 50, 284 60, 268 72 C 258 80, 252 84, 252 84" fill="#1a1a1a"/>

              {/* Tail */}
              <g className="buf-tail">
                <path d="M 62 74 Q 44 88 40 108 Q 37 122 46 126" stroke="black" strokeWidth="9" fill="none" strokeLinecap="round"/>
                <ellipse cx="48" cy="130" rx="9" ry="12" transform="rotate(-15 48 130)"/>
              </g>

            </svg>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="flex flex-col items-center gap-6 text-[#5c3317] text-xs text-center px-6 py-10 leading-relaxed max-w-xl mx-auto w-full">
        <p className="font-semibold text-sm">Opening Event — September 12</p>
        <p>
          Please join us for the Fazenda opening event! We&apos;ll be open starting 8am, please stop by for a morning coffee or come later in the day for some more coffee or snacks.
        </p>
      </div>
    </main>
  )
}
