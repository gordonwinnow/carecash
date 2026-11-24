/** The CareCash mark: a kiss-lock coin purse, drawn as a line icon to match the rest of the icon set. */
export function PurseIcon({ size = 24, strokeWidth = 2, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="1 2.5 22 19.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* clasp beads */}
      <circle cx="10.9" cy="5" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="13.1" cy="5" r="1.15" fill="currentColor" stroke="none" />
      {/* metal frame */}
      <path d="M6.5 11C6.5 7.6 9 6 12 6s5.5 1.6 5.5 5" />
      {/* pouch */}
      <path d="M4 11h16c1.6 1.6 2.1 4.2 1.1 6.4-1.1 2.3-4.3 3.1-9.1 3.1s-8-.8-9.1-3.1C1.9 15.2 2.4 12.6 4 11z" />
    </svg>
  );
}
