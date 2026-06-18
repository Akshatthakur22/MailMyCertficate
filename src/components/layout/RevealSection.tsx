/** Server-safe section wrapper (no client JS required for visibility). */
export function RevealSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  return <div className={className}>{children}</div>;
}
