/* Line-drawn elevation of the Mott Street storefront: a shallow brownstone
   arch on corbels, brick piers either side, arched transom over double doors
   with narrow sidelights. Strokes use currentColor so it takes the page's
   brand colour. */
export default function Storefront({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 940"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="The Fazenda storefront on Mott Street"
    >
      <defs>
        <pattern id="fz-brick" width="70" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M0 0 H70 M0 15 H70 M0 0 V15 M35 15 V30"
            stroke="currentColor"
            strokeWidth={1}
            opacity={0.45}
          />
        </pattern>
      </defs>

      {/* ---- brick piers ---- */}
      <rect x="30" y="215" width="145" height="605" fill="url(#fz-brick)" stroke="none" />
      <rect x="725" y="215" width="145" height="605" fill="url(#fz-brick)" stroke="none" />
      <path d="M30 215 V820 M870 215 V820" />

      {/* ---- cornice, following the arch ---- */}
      <path d="M110 390 Q450 -10 790 390" />
      <path d="M124 390 Q450 34 776 390" />

      {/* ---- brownstone arch face ---- */}
      <path d="M150 390 Q450 90 750 390" />
      <path d="M110 390 V424 M150 390 V424 M750 390 V424 M790 390 V424" />

      {/* ---- corbels at the springing ---- */}
      <path d="M112 424 h44 v22 q-10 4 -15 16 q-5 12 -16 18 q-11 6 -13 20 z" />
      <path d="M788 424 h-44 v22 q10 4 15 16 q5 12 16 18 q11 6 13 20 z" />

      {/* ---- reveal into the opening ---- */}
      <path d="M195 390 Q450 200 705 390" />
      <path d="M195 390 V820 M705 390 V820" />

      {/* ---- arched transom ---- */}
      <path d="M214 390 Q450 222 686 390" />
      <path d="M214 390 V470 M686 390 V470 M214 470 H686" />
      <path d="M450 262 V470" opacity={0.45} />
      <path d="M332 292 V470 M568 292 V470" opacity={0.3} />

      {/* ---- door assembly ---- */}
      <path d="M214 470 V816 M686 470 V816" />
      {/* sidelight | door | door | sidelight */}
      <path d="M272 470 V816 M450 470 V816 M628 470 V816" />
      <path d="M284 470 V816 M438 470 V816 M462 470 V816 M616 470 V816" opacity={0.55} />

      {/* upper lights */}
      <path d="M228 492 H258 V664 H228 Z" />
      <path d="M298 492 H424 V664 H298 Z" />
      <path d="M476 492 H602 V664 H476 Z" />
      <path d="M642 492 H672 V664 H642 Z" />

      {/* lower panels */}
      <path d="M228 686 H258 V796 H228 Z" opacity={0.7} />
      <path d="M298 686 H424 V782 H298 Z" opacity={0.7} />
      <path d="M476 686 H602 V782 H476 Z" opacity={0.7} />
      <path d="M642 686 H672 V796 H642 Z" opacity={0.7} />

      {/* brass kickplates */}
      <path d="M298 788 H424 V812 H298 Z" />
      <path d="M476 788 H602 V812 H476 Z" />

      {/* handles and lock */}
      <path d="M428 590 V668" strokeWidth={4} />
      <path d="M472 590 V668" strokeWidth={4} />
      <rect x="466" y="682" width="18" height="24" rx="3" />

      {/* ---- a hint of the interior ---- */}
      <path d="M352 512 V664 M344 512 H360" opacity={0.4} />
      <path d="M302 566 H400" opacity={0.4} />
      <path d="M314 566 v40 M326 566 v44 M338 566 v38 M370 566 v42 M382 566 v36 M394 566 v44" opacity={0.4} />
      <path d="M498 620 H580 V660 H498 Z" opacity={0.3} />

      {/* the wordmark on the glass */}
      <text
        x="539"
        y="546"
        textAnchor="middle"
        fontSize="19"
        letterSpacing="4.5"
        fill="currentColor"
        stroke="none"
        fontFamily="'Times New Roman', Times, serif"
      >
        FAZENDA
      </text>

      {/* ---- threshold and pavement ---- */}
      <path d="M195 820 H705" />
      <path d="M30 820 H870" />
      <path d="M132 876 H768" opacity={0.6} />
      <path d="M72 930 H828" opacity={0.6} />
      <path d="M186 820 V876 M714 820 V876" opacity={0.6} />
      <path d="M132 876 V930 M768 876 V930" opacity={0.6} />
    </svg>
  )
}
