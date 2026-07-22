/**
 * Reusable tiny hand-drawn step illustrations for each workflow step.
 * Each icon is ~64x64, stroke-based, warm ink, slightly imperfect.
 */
export function UploadStepIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* paper/image upload */}
      <rect x="10" y="14" width="44" height="38" rx="5"
        fill="#F0EDE6" stroke="#2D2A24" strokeWidth="2" />
      {/* image icon inside */}
      <circle cx="25" cy="30" r="5" fill="none" stroke="#2D6A4F" strokeWidth="1.5" />
      <path d="M12 44 L24 34 L34 42 L42 36 L52 46" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      {/* upload arrow */}
      <path d="M32 6 L32 16" stroke="#2D2A24" strokeWidth="2" strokeLinecap="round" />
      <path d="M27 10 L32 5 L37 10" stroke="#2D2A24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DataStepIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* spreadsheet */}
      <rect x="8" y="10" width="48" height="44" rx="5"
        fill="#F0EDE6" stroke="#2D2A24" strokeWidth="2" />
      {/* grid lines */}
      <line x1="8" y1="22" x2="56" y2="22" stroke="#2D2A24" strokeWidth="1.2" opacity="0.3" />
      <line x1="8" y1="34" x2="56" y2="34" stroke="#2D2A24" strokeWidth="1.2" opacity="0.3" />
      <line x1="8" y1="44" x2="56" y2="44" stroke="#2D2A24" strokeWidth="1.2" opacity="0.3" />
      <line x1="26" y1="22" x2="26" y2="54" stroke="#2D2A24" strokeWidth="1.2" opacity="0.3" />
      <line x1="42" y1="22" x2="42" y2="54" stroke="#2D2A24" strokeWidth="1.2" opacity="0.3" />
      {/* header highlight */}
      <rect x="8" y="10" width="48" height="12" rx="5" fill="#2D6A4F" opacity="0.12" />
      <rect x="8" y="17" width="48" height="5" rx="0" fill="#2D6A4F" opacity="0.12" />
    </svg>
  );
}

export function GenerateStepIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* gear / cog */}
      <circle cx="32" cy="32" r="14" fill="none" stroke="#2D6A4F" strokeWidth="2.2" />
      <circle cx="32" cy="32" r="6" fill="#2D6A4F" opacity="0.2" />
      {/* teeth */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 32 + 14 * Math.cos(rad);
        const y1 = 32 + 14 * Math.sin(rad);
        const x2 = 32 + 19 * Math.cos(rad);
        const y2 = 32 + 19 * Math.sin(rad);
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#2D6A4F" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        );
      })}
      {/* sparkle */}
      <path d="M50 12 L52 16 L56 14 L54 18 L58 20 L54 20 L52 24 L50 20 L46 20 L50 18 Z"
        fill="#2D6A4F" opacity="0.4" />
    </svg>
  );
}

export function SendStepIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* envelope */}
      <rect x="8" y="16" width="48" height="32" rx="4"
        fill="#F0EDE6" stroke="#2D2A24" strokeWidth="2" />
      {/* flap */}
      <path d="M8 16 L32 36 L56 16" stroke="#2D2A24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* paper airplane trail */}
      <path d="M44 10 L52 6 L50 14" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
      <path d="M52 6 L58 3" stroke="#2D6A4F" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  );
}
