export function NotFoundIllustration() {
  return (
    <svg
      viewBox="0 0 640 560"
      className="w-full h-auto"
      role="img"
      aria-labelledby="notfound-illustration-title"
    >
      <title id="notfound-illustration-title">
        A certificate folded into a paper airplane, drifting off its intended
        flight path
      </title>

      <defs>
        <linearGradient id="nf-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" className="[stop-color:var(--color-accent,#0f766e)]" stopOpacity="0.16" />
          <stop offset="100%" className="[stop-color:var(--color-accent,#0f766e)]" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ambient glow behind the scene */}
      <circle cx="360" cy="210" r="230" fill="url(#nf-glow)" />

      {/* faint compass rose, top right — a nod to "finding your way" */}
      <g className="text-foreground/15" stroke="currentColor" strokeWidth="1.5" fill="none">
        <circle cx="540" cy="90" r="46" />
        <path d="M540 44v92M494 90h92" strokeDasharray="2 6" />
        <path d="M540 60l6 22-6 22-6-22z" className="text-foreground/25" fill="currentColor" stroke="none" />
      </g>

      {/* three soft clouds */}
      <g className="text-foreground/10" fill="currentColor">
        <path d="M60 150c-11 0-20-9-20-20s9-20 20-20c3-14 16-24 31-24 16 0 30 11 33 26 13 1 23 12 23 25 0 14-11 25-25 25H60z" />
        <path d="M470 380c-9 0-16-7-16-16s7-16 16-16c2-11 13-19 25-19 13 0 24 9 27 21 11 1 19 10 19 20 0 11-9 20-20 20H470z" opacity="0.7" />
        <path d="M110 420c-7 0-13-6-13-13s6-13 13-13c2-9 10-15 20-15 10 0 19 7 21 17 9 1 15 8 15 16 0 9-7 16-16 16H110z" opacity="0.6" />
      </g>

      {/* dashed flight path curving away, off-route */}
      <path
        d="M96 470 C 210 430, 260 300, 210 220 S 340 130, 470 150"
        className="text-accent"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeDasharray="1 10"
        strokeLinecap="round"
        fill="none"
      />

      {/* small mailbox marking the start of the route */}
      <g transform="translate(70 452)" className="text-foreground/70">
        <rect x="0" y="10" width="30" height="22" rx="4" fill="currentColor" opacity="0.12" />
        <path
          d="M0 22a15 12 0 0 1 15-12h0a15 12 0 0 1 15 12v10H0z"
          fill="currentColor"
          opacity="0.85"
        />
        <rect x="12" y="0" width="6" height="10" rx="1" fill="currentColor" opacity="0.85" />
        <rect x="-4" y="32" width="38" height="4" rx="2" fill="currentColor" opacity="0.3" />
      </g>

      {/* the certificate-turned-paper-airplane, mid-flight, off course */}
      <g transform="translate(300 205) rotate(-18)">
        {/* certificate ribbon tail, unfurling behind it */}
        <path
          d="M-18 26 C -46 40, -60 62, -52 92 C -44 74, -28 62, -6 56"
          className="text-accent"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />

        {/* airplane body folded from a certificate sheet */}
        <path
          d="M-70 18 L 70 -6 L 4 10 L 30 46 L -4 24 Z"
          className="fill-background stroke-foreground/80"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M-70 18 L 4 10 L -4 24 Z"
          className="fill-accent/15 stroke-foreground/80"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* faint printed lines, reading as a certificate body */}
        <g className="text-foreground/30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="-52" y1="10" x2="-14" y2="4" />
          <line x1="-52" y1="16" x2="-24" y2="12" />
        </g>

        {/* wax-seal accent */}
        <circle cx="20" cy="6" r="6" className="fill-accent" />
      </g>

      {/* airmail corner motif — diagonal stripes, echoing classic airmail envelopes */}
      <g transform="translate(24 24)" opacity="0.9">
        <clipPath id="nf-corner-clip">
          <path d="M0 0h64L0 64Z" />
        </clipPath>
        <g clipPath="url(#nf-corner-clip)">
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={i}
              x={-40 + i * 18}
              y="-10"
              width="8"
              height="90"
              transform="rotate(45 0 0)"
              className={i % 2 === 0 ? 'fill-accent/70' : 'fill-foreground/30'}
            />
          ))}
        </g>
      </g>

      {/* scattered small dots for texture */}
      <g className="text-foreground/20" fill="currentColor">
        <circle cx="150" cy="90" r="2" />
        <circle cx="180" cy="70" r="2" />
        <circle cx="520" cy="280" r="2" />
        <circle cx="500" cy="310" r="2" />
      </g>
    </svg>
  );
}