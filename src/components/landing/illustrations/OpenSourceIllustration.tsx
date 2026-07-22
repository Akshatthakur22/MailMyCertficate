/**
 * Hand-drawn style SVG: Open source community visualization.
 * A central node (the repo) with contributor nodes branching out,
 * connected by organic paths. Feels collaborative and human.
 */
export function OpenSourceIllustration({
  className = '',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      className={className}
      role="img"
      aria-label="Open source community represented as connected nodes branching from a central repository"
    >
      {/* ── Central repo node ─────────────────────── */}
      <g transform="translate(170, 96)">
        <rect
          x="0" y="0" width="60" height="60" rx="14"
          fill="#F0EDE6" stroke="#2D2A24" strokeWidth="2.2"
        />
        {/* GitHub-style octocat fork icon */}
        <circle cx="30" cy="22" r="8" fill="none" stroke="#2D6A4F" strokeWidth="2" />
        <path
          d="M22 34 L22 42 M38 34 L38 42 M30 30 L30 50"
          stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round"
        />
        <circle cx="22" cy="44" r="3" fill="#2D6A4F" opacity="0.5" />
        <circle cx="38" cy="44" r="3" fill="#2D6A4F" opacity="0.5" />
        <circle cx="30" cy="52" r="3" fill="#2D6A4F" opacity="0.5" />
      </g>

      {/* ── Contributor nodes ─────────────────────── */}
      {/* Top-left */}
      <circle cx="80" cy="50" r="18" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.6" />
      <circle cx="80" cy="46" r="6" fill="#2D2A24" opacity="0.15" />
      <rect x="74" y="55" width="12" height="8" rx="4" fill="#2D2A24" opacity="0.15" />

      {/* Top-right */}
      <circle cx="320" cy="50" r="18" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.6" />
      <circle cx="320" cy="46" r="6" fill="#2D2A24" opacity="0.15" />
      <rect x="314" y="55" width="12" height="8" rx="4" fill="#2D2A24" opacity="0.15" />

      {/* Bottom-left */}
      <circle cx="60" cy="190" r="18" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.6" />
      <circle cx="60" cy="186" r="6" fill="#2D2A24" opacity="0.15" />
      <rect x="54" y="195" width="12" height="8" rx="4" fill="#2D2A24" opacity="0.15" />

      {/* Bottom-right */}
      <circle cx="340" cy="190" r="18" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.6" />
      <circle cx="340" cy="186" r="6" fill="#2D2A24" opacity="0.15" />
      <rect x="334" y="195" width="12" height="8" rx="4" fill="#2D2A24" opacity="0.15" />

      {/* Mid-left */}
      <circle cx="50" cy="120" r="14" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.4" />
      <circle cx="50" cy="117" r="5" fill="#2D6A4F" opacity="0.2" />
      <rect x="45" y="124" width="10" height="6" rx="3" fill="#2D6A4F" opacity="0.2" />

      {/* Mid-right */}
      <circle cx="350" cy="120" r="14" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.4" />
      <circle cx="350" cy="117" r="5" fill="#2D6A4F" opacity="0.2" />
      <rect x="345" y="124" width="10" height="6" rx="3" fill="#2D6A4F" opacity="0.2" />

      {/* ── Connection paths (hand-drawn organic curves) ────── */}
      <path d="M98 55 C 130 60, 150 80, 170 100" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" opacity="0.5" />
      <path d="M302 55 C 270 60, 250 80, 230 100" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" opacity="0.5" />
      <path d="M64 120 C 100 118, 140 112, 170 115" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" opacity="0.5" />
      <path d="M336 120 C 300 118, 260 112, 230 115" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" opacity="0.5" />
      <path d="M78 190 C 110 180, 150 160, 180 156" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" opacity="0.5" />
      <path d="M322 190 C 290 180, 250 160, 220 156" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 3" opacity="0.5" />

      {/* ── Labels ──────────────────────────────────── */}
      <text x="200" y="248" textAnchor="middle" fontSize="10" fill="#6B6860" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.7">
        fork · audit · improve · deploy your own
      </text>
    </svg>
  );
}
