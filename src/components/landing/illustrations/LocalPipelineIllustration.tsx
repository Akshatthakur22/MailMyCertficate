/**
 * Hand-drawn style SVG: privacy / local-first pipeline.
 * Shows data flowing entirely inside a browser "bubble" —
 * no arrows leave the boundary. A crossed-out cloud sits outside.
 */
export function LocalPipelineIllustration({
  className = '',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 520 300"
      fill="none"
      className={className}
      role="img"
      aria-label="Data processing pipeline staying entirely inside the browser, with a crossed-out cloud representing no uploads"
    >
      <defs>
        <filter id="lp-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Browser chrome ───────────────────────────────────── */}
      <rect
        x="14" y="30" width="380" height="240" rx="12"
        fill="#FAFAF7"
        stroke="#2D2A24"
        strokeWidth="2.2"
      />
      {/* browser top bar */}
      <rect x="14" y="30" width="380" height="34" rx="12" fill="#F0EDE6" />
      <rect x="14" y="52" width="380" height="12" fill="#F0EDE6" />
      {/* traffic lights */}
      <circle cx="36" cy="47" r="5.5" fill="#E07070" opacity="0.8" />
      <circle cx="54" cy="47" r="5.5" fill="#E0C070" opacity="0.8" />
      <circle cx="72" cy="47" r="5.5" fill="#70C070" opacity="0.8" />
      {/* address bar */}
      <rect x="90" y="39" width="240" height="16" rx="8" fill="white" stroke="#E8E4DC" strokeWidth="1" />
      <text x="100" y="51" fontSize="8" fill="#6B6860" fontFamily="monospace">mailmycertificate.tech/tool</text>
      {/* "Your Browser" label */}
      <text
        x="204" y="25"
        textAnchor="middle"
        fontSize="10"
        fill="#6B6860"
        fontFamily="Georgia, serif"
        fontStyle="italic"
      >
        your browser
      </text>

      {/* ── Inside the browser: pipeline nodes ───────────────── */}
      {/* Node 1: CSV / Sheet */}
      <g transform="translate(44, 90)">
        <rect x="0" y="0" width="72" height="58" rx="8" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.8" />
        {/* spreadsheet lines */}
        <line x1="0" y1="18" x2="72" y2="18" stroke="#2D2A24" strokeWidth="1" opacity="0.2" />
        <line x1="0" y1="32" x2="72" y2="32" stroke="#2D2A24" strokeWidth="1" opacity="0.2" />
        <line x1="0" y1="46" x2="72" y2="46" stroke="#2D2A24" strokeWidth="1" opacity="0.2" />
        <line x1="24" y1="18" x2="24" y2="58" stroke="#2D2A24" strokeWidth="1" opacity="0.2" />
        {/* header row fill */}
        <rect x="0" y="0" width="72" height="18" rx="8" fill="#2D6A4F" opacity="0.15" />
        <rect x="0" y="8" width="72" height="10" rx="0" fill="#2D6A4F" opacity="0.15" />
        {/* label */}
        <text x="36" y="-6" textAnchor="middle" fontSize="8.5" fill="#2D2A24" fontWeight="600" opacity="0.7">CSV / Sheets</text>
      </g>

      {/* Arrow 1 → 2 */}
      <path
        d="M118 119 C 136 119, 140 119, 152 119"
        stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <path d="M149 114 L155 119 L149 124" stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Node 2: Template image */}
      <g transform="translate(156, 90)">
        <rect x="0" y="0" width="72" height="58" rx="8" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.8" />
        {/* certificate mini */}
        <rect x="8" y="10" width="56" height="40" rx="3" fill="white" stroke="#2D2A24" strokeWidth="1" opacity="0.5" />
        <circle cx="36" cy="26" r="8" fill="none" stroke="#2D6A4F" strokeWidth="1.2" opacity="0.6" />
        <rect x="14" y="38" width="44" height="3" rx="1.5" fill="#2D2A24" opacity="0.12" />
        <rect x="20" y="44" width="32" height="3" rx="1.5" fill="#2D6A4F" opacity="0.2" />
        <text x="36" y="-6" textAnchor="middle" fontSize="8.5" fill="#2D2A24" fontWeight="600" opacity="0.7">Template</text>
      </g>

      {/* Arrow 2 → 3 */}
      <path
        d="M230 119 C 248 119, 252 119, 264 119"
        stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <path d="M261 114 L267 119 L261 124" stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Node 3: PDF generation (Web Worker) */}
      <g transform="translate(268, 90)">
        <rect x="0" y="0" width="72" height="58" rx="8" fill="#2D6A4F" opacity="0.08" stroke="#2D6A4F" strokeWidth="1.8" />
        {/* gear / cog shape */}
        <circle cx="36" cy="26" r="12" fill="none" stroke="#2D6A4F" strokeWidth="2" opacity="0.5" />
        <circle cx="36" cy="26" r="6" fill="#2D6A4F" opacity="0.25" />
        {/* cog teeth */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 36 + 12 * Math.cos(rad);
          const y1 = 26 + 12 * Math.sin(rad);
          const x2 = 36 + 16 * Math.cos(rad);
          const y2 = 26 + 16 * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          );
        })}
        <text x="36" y="50" textAnchor="middle" fontSize="7" fill="#2D6A4F" fontWeight="600" opacity="0.8">Web Worker</text>
        <text x="36" y="-6" textAnchor="middle" fontSize="8.5" fill="#2D2A24" fontWeight="600" opacity="0.7">PDF Engine</text>
      </g>

      {/* ── Vertical arrow down to ZIP / output ──────────────── */}
      <path
        d="M304 150 L304 178"
        stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <path d="M299 175 L304 181 L309 175" stroke="#2D6A4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Node 4: ZIP Output */}
      <g transform="translate(265, 183)">
        <rect x="0" y="0" width="78" height="48" rx="8" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.8" />
        {/* zip icon — stacked lines */}
        <rect x="18" y="8" width="42" height="32" rx="3" fill="white" stroke="#2D2A24" strokeWidth="1" opacity="0.5" />
        {/* zip stripes */}
        {[12, 17, 22, 27].map((y, i) => (
          <rect key={i} x="26" y={y} width="26" height="3" rx="1.5"
            fill={i % 2 === 0 ? '#2D2A24' : '#2D6A4F'} opacity="0.15" />
        ))}
        <text x="39" y="-6" textAnchor="middle" fontSize="8.5" fill="#2D2A24" fontWeight="600" opacity="0.7">ZIP / Send</text>
      </g>

      {/* ── "Inside browser" loop label ───────────────────────── */}
      <path
        d="M26 200 Q 14 264 26 260 Q 60 270 204 270 Q 370 270 394 260 Q 406 256 394 200"
        stroke="#2D6A4F" strokeWidth="1.2" strokeDasharray="6 4"
        opacity="0.35"
      />
      <text x="204" y="284" textAnchor="middle" fontSize="9" fill="#2D6A4F" fontStyle="italic" opacity="0.6">everything stays here</text>

      {/* ── Cloud (outside browser, crossed out) ─────────────── */}
      <g transform="translate(430, 60)">
        {/* cloud body */}
        <path
          d="M30 52 C 10 52, 2 40, 8 30 C 2 26, 2 16, 12 14 C 14 4, 26 0, 36 6 C 42 2, 54 4, 56 14 C 66 16, 68 28, 60 34 C 64 44, 56 52, 46 50 Z"
          fill="#F5F0E8" stroke="#2D2A24" strokeWidth="1.8" opacity="0.7"
        />
        {/* big cross */}
        <line x1="12" y1="10" x2="58" y2="48" stroke="#E07070" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        <line x1="58" y1="10" x2="12" y2="48" stroke="#E07070" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        {/* label */}
        <text x="34" y="68" textAnchor="middle" fontSize="9" fill="#E07070" fontWeight="600" opacity="0.8">no upload</text>
      </g>

      {/* dashed "no-path" between browser and cloud */}
      <path
        d="M394 150 Q 415 150 426 108"
        stroke="#E07070" strokeWidth="1.5" strokeDasharray="5 4"
        opacity="0.4"
      />

      {/* IndexedDB callout */}
      <g transform="translate(44, 200)">
        <rect x="0" y="0" width="86" height="36" rx="6" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.4" />
        <text x="43" y="13" textAnchor="middle" fontSize="8" fill="#2D2A24" fontWeight="600" opacity="0.7">IndexedDB</text>
        <text x="43" y="27" textAnchor="middle" fontSize="7.5" fill="#6B6860" fontStyle="italic">on your device</text>
      </g>
    </svg>
  );
}
