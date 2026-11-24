/** The CareCash mark: a kiss-lock coin purse, drawn as a line icon to match the rest of the icon set. */
export function PurseIcon({ size = 24, strokeWidth = 2, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="2 3 20 19"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* clasp beads */}
      <circle cx="10.85" cy="6.6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="13.15" cy="6.6" r="1.3" fill="currentColor" stroke="none" />
      {/* frame */}
      <path d="M5 9.2Q12 6.4 19 9.2" />
      {/* pouch */}
      <path d="M5 9.2C2.9 11.5 2.8 15 4.6 17.4 6.3 19.7 9 20.6 12 20.6s5.7-.9 7.4-3.2c1.8-2.4 1.7-5.9-.4-8.2" />
    </svg>
  );
}
