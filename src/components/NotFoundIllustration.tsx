/**
 * Hand-drawn 404 illustration — A lost certificate (paper airplane)
 * drifting away from a mailbox. Warm, editorial, matching the landing
 * page illustration style. Uses the same ink/green/cream palette.
 */
export function NotFoundIllustration() {
  return (
    <svg
      viewBox="0 0 480 420"
      className="w-full h-auto max-w-md mx-auto"
      role="img"
      aria-labelledby="notfound-illustration-title"
    >
      <title id="notfound-illustration-title">
        A certificate folded into a paper airplane, drifting away from its destination
      </title>

      <defs>
        <filter id="nf-soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#2D2A24" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* ── Subtle background wash ─────────────────────────────── */}
      <circle cx="240" cy="200" r="180" fill="#F0EDE6" opacity="0.4" />

      {/* ── Dashed flight path — meandering off-route ──────────── */}
      <path
        d="M60 340 C 100 300, 130 240, 160 220 S 220 180, 280 160 C 320 145, 360 130, 400 110"
        fill="none"
        stroke="#2D6A4F"
        strokeWidth="2"
        strokeDasharray="6 5"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* ── Mailbox (destination) at bottom-left ───────────────── */}
      <g transform="translate(40, 300)" filter="url(#nf-soft-shadow)">
        {/* Post */}
        <rect x="18" y="32" width="8" height="50" rx="2" fill="#2D2A24" opacity="0.7" />
        {/* Box body */}
        <rect x="0" y="4" width="44" height="30" rx="6" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="2" />
        {/* Top flap */}
        <path d="M0 10 C 0 4 4 0 10 0 H34 C40 0 44 4 44 10" fill="none" stroke="#2D2A24" strokeWidth="2" />
        {/* Flag */}
        <rect x="42" y="0" width="4" height="20" rx="1" fill="#2D2A24" opacity="0.6" />
        <rect x="46" y="0" width="14" height="10" rx="2" fill="#2D6A4F" opacity="0.7" />
        {/* Slot */}
        <rect x="10" y="14" width="24" height="4" rx="2" fill="#2D2A24" opacity="0.2" />
      </g>

      {/* ── Question marks floating around ─────────────────────── */}
      <text x="120" y="280" fontSize="18" fill="#2D6A4F" opacity="0.3" fontFamily="Georgia, serif" fontStyle="italic">?</text>
      <text x="350" y="90" fontSize="22" fill="#2D6A4F" opacity="0.25" fontFamily="Georgia, serif" fontStyle="italic">?</text>
      <text x="400" y="180" fontSize="14" fill="#2D2A24" opacity="0.2" fontFamily="Georgia, serif" fontStyle="italic">?</text>

      {/* ── The certificate-airplane (main character) ──────────── */}
      <g transform="translate(280, 110) rotate(-12)">
        {/* Paper airplane body */}
        <path
          d="M-50 10 L50 -8 L5 6 L20 35 L0 16 Z"
          fill="#FAFAF7"
          stroke="#2D2A24"
          strokeWidth="2.2"
          strokeLinejoin="round"
          filter="url(#nf-soft-shadow)"
        />
        {/* Wing fold */}
        <path
          d="M-50 10 L5 6 L0 16 Z"
          fill="#F0EDE6"
          stroke="#2D2A24"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Certificate text lines on wing */}
        <g opacity="0.3" stroke="#2D2A24" strokeWidth="1.2" strokeLinecap="round">
          <line x1="-38" y1="6" x2="-10" y2="2" />
          <line x1="-35" y1="11" x2="-15" y2="8" />
        </g>
        {/* Seal dot */}
        <circle cx="15" cy="4" r="5" fill="#2D6A4F" opacity="0.7" />
        {/* Ribbon trailing */}
        <path
          d="M-10 18 C -25 28, -35 42, -28 58"
          fill="none"
          stroke="#2D6A4F"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      {/* ── Small clouds ───────────────────────────────────────── */}
      <g fill="#2D2A24" opacity="0.06">
        <path d="M340 60 C 330 60 325 52 332 48 C 328 46 330 38 340 38 C 345 32 358 34 358 40 C 365 40 368 48 362 52 C 366 56 360 62 354 60 Z" />
        <path d="M100 120 C 92 120 88 114 94 110 C 90 108 92 102 100 102 C 104 97 114 98 114 103 C 119 103 121 109 117 112 C 120 115 116 120 111 119 Z" />
      </g>

      {/* ── "404" in large editorial type ──────────────────────── */}
      <text
        x="240"
        y="250"
        textAnchor="middle"
        fontSize="96"
        fontWeight="700"
        fill="#2D2A24"
        opacity="0.06"
        fontFamily="Inter, -apple-system, sans-serif"
      >
        404
      </text>

      {/* ── Decorative dots (hand-placed) ──────────────────────── */}
      <circle cx="180" cy="160" r="2.5" fill="#2D6A4F" opacity="0.25" />
      <circle cx="195" cy="175" r="1.5" fill="#2D6A4F" opacity="0.2" />
      <circle cx="170" cy="180" r="2" fill="#2D6A4F" opacity="0.15" />
      <circle cx="320" cy="200" r="2" fill="#2D2A24" opacity="0.15" />
      <circle cx="340" cy="215" r="1.5" fill="#2D2A24" opacity="0.12" />

      {/* ── Hand-drawn underline at bottom ─────────────────────── */}
      <path
        d="M140 380 C 180 374, 260 386, 340 378"
        fill="none"
        stroke="#2D6A4F"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
