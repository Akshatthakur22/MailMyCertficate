/**
 * Hand-drawn style SVG: a certificate template on the left becoming
 * a stack of personalized PDFs on the right, connected by a flowing
 * organic path. Every stroke is slightly imperfect — intentionally.
 */
export function CertificateFlowIllustration({
  className = '',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 560 280"
      fill="none"
      className={className}
      role="img"
      aria-label="A certificate template transforming into a stack of personalized PDFs"
    >
      <defs>
        {/* paper texture fill */}
        <pattern id="cf-paper" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#F5F0E8" />
          <line x1="0" y1="2" x2="4" y2="2" stroke="#E8E0CC" strokeWidth="0.4" />
        </pattern>

        {/* subtle drop shadow for the stacked PDFs */}
        <filter id="cf-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#2D2A24" floodOpacity="0.10" />
        </filter>
      </defs>

      {/* ── Template (left) ───────────────────────────────── */}
      {/* outer frame — slightly rotated for hand-placed feel */}
      <g transform="translate(30, 40) rotate(-1.5, 110, 100)">
        <rect
          x="0" y="0" width="200" height="150" rx="6"
          fill="url(#cf-paper)"
          stroke="#2D2A24" strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* decorative border inset */}
        <rect
          x="8" y="8" width="184" height="134" rx="3"
          fill="none"
          stroke="#2D2A24" strokeWidth="1" strokeDasharray="4 3"
          opacity="0.35"
        />
        {/* seal circle */}
        <circle cx="100" cy="58" r="22" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.8" />
        <circle cx="100" cy="58" r="14" fill="none" stroke="#2D2A24" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
        {/* star inside seal */}
        <path
          d="M100 44 l3.5 10.5H114l-8.7 6.3 3.3 10.2-8.6-6.3-8.6 6.3 3.3-10.2L86 54.5h10.5Z"
          fill="#2D6A4F" opacity="0.7"
        />
        {/* title placeholder lines */}
        <rect x="35" y="94" width="130" height="7" rx="3.5" fill="#2D2A24" opacity="0.12" />
        <rect x="55" y="108" width="90" height="5" rx="2.5" fill="#2D2A24" opacity="0.08" />
        {/* name placeholder — will be filled */}
        <rect x="20" y="122" width="160" height="8" rx="4" fill="#2D6A4F" opacity="0.18" />
        {/* small arrow annotation */}
        <text x="168" y="132" fontSize="8" fill="#2D2A24" opacity="0.4" fontFamily="serif" fontStyle="italic">name</text>
      </g>

      {/* ── Flow path ───────────────────────────────────────── */}
      {/* organic S-curve connecting template to PDFs */}
      <path
        d="M242 130 C 270 118, 280 148, 310 138"
        stroke="#2D6A4F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 4"
        opacity="0.7"
      />
      {/* arrowhead */}
      <path
        d="M306 131 L314 138 L306 145"
        stroke="#2D6A4F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* small annotation above the arrow */}
      <text
        x="260" y="108"
        fontSize="9.5"
        fill="#2D6A4F"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        opacity="0.75"
      >
        generates
      </text>

      {/* ── Stacked PDFs (right) ─────────────────────────── */}
      {/* shadow layer */}
      <g transform="translate(322, 32)" filter="url(#cf-shadow)">
        {/* back-most card */}
        <rect
          x="12" y="10" width="188" height="142" rx="5"
          fill="#EAE6DC" stroke="#2D2A24" strokeWidth="1.5" opacity="0.5"
          transform="rotate(3, 94, 71)"
        />
        {/* middle card */}
        <rect
          x="6" y="5" width="188" height="142" rx="5"
          fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.8" opacity="0.75"
          transform="rotate(1.5, 94, 71)"
        />
        {/* front card — straight */}
        <rect x="0" y="0" width="188" height="142" rx="5" fill="url(#cf-paper)" stroke="#2D2A24" strokeWidth="2" />

        {/* front card content */}
        <rect x="8" y="8" width="172" height="126" rx="3" fill="none" stroke="#2D2A24" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.3" />

        {/* seal */}
        <circle cx="94" cy="52" r="19" fill="#F0EDE6" stroke="#2D2A24" strokeWidth="1.6" />
        <path
          d="M94 40 l3 9H107l-7.5 5.4 2.8 8.7-8.3-6-8.3 6 2.8-8.7L81 49h10Z"
          fill="#2D6A4F" opacity="0.8"
        />

        {/* title */}
        <rect x="28" y="84" width="132" height="6" rx="3" fill="#2D2A24" opacity="0.14" />
        <rect x="48" y="96" width="92" height="4.5" rx="2" fill="#2D2A24" opacity="0.09" />

        {/* personalised name — rendered in green to show it's filled */}
        <rect x="16" y="112" width="156" height="7" rx="3.5" fill="#2D6A4F" opacity="0.22" />
        <text x="32" y="120" fontSize="7" fill="#2D6A4F" fontWeight="600" opacity="0.7">Akshat Thakur</text>

        {/* date line */}
        <rect x="40" y="126" width="108" height="4" rx="2" fill="#2D2A24" opacity="0.07" />
      </g>

      {/* ── Count badge ───────────────────────────────────── */}
      <g transform="translate(500, 28)">
        <rect x="0" y="0" width="46" height="22" rx="11" fill="#2D6A4F" />
        <text x="23" y="15" textAnchor="middle" fontSize="9" fontWeight="700" fill="white">×200</text>
      </g>

      {/* ── Paper texture scatter ─────────────────────────── */}
      <circle cx="278" cy="78" r="2.5" fill="#2D6A4F" opacity="0.25" />
      <circle cx="285" cy="95" r="1.5" fill="#2D6A4F" opacity="0.18" />
      <circle cx="274" cy="110" r="2" fill="#2D6A4F" opacity="0.2" />
    </svg>
  );
}
