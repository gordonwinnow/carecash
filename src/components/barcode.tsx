import { code39 } from "@/lib/carrier";

/** A Code 39 barcode drawn as crisp SVG bars, black on white (scanners need the contrast, also in dark mode). */
export function Barcode({ value, className = "" }: { value: string; className?: string }) {
  const { bars, width } = code39(value);
  return (
    <svg
      viewBox={`0 0 ${width} 40`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      className={`block w-full bg-white ${className}`}
      role="img"
      aria-label={value}
    >
      {bars.map(([x, w]) => (
        <rect key={x} x={x} y={0} width={w} height={40} fill="#000" />
      ))}
    </svg>
  );
}
