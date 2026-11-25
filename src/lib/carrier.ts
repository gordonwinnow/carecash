/**
 * Taiwan e-invoice mobile barcode (手機條碼 / 發票載具): "/" plus 7 characters from 0-9, A-Z, "+", "-", ".".
 * Stores scan it as a Code 39 barcode, so the app can draw it from the number alone.
 */
export const CARRIER_RE = /^\/[0-9A-Z+\-.]{7}$/;

/** Cleans up a pasted code: trims, drops spaces, uppercases, adds the leading "/" if it was left off. Null if it is not a valid code. */
export function normalizeCarrier(raw: unknown): string | null {
  let v = String(raw ?? "").replace(/\s+/g, "").toUpperCase();
  if (/^[0-9A-Z+\-.]{7}$/.test(v)) v = `/${v}`;
  return CARRIER_RE.test(v) ? v : null;
}

// Code 39: each character is 9 elements (bar, space, bar, ... bar); 1 = wide, 0 = narrow. Exactly 3 are wide.
const CODE39: Record<string, string> = {
  "0": "000110100", "1": "100100001", "2": "001100001", "3": "101100000", "4": "000110001",
  "5": "100110000", "6": "001110000", "7": "000100101", "8": "100100100", "9": "001100100",
  A: "100001001", B: "001001001", C: "101001000", D: "000011001", E: "100011000",
  F: "001011000", G: "000001101", H: "100001100", I: "001001100", J: "000011100",
  K: "100000011", L: "001000011", M: "101000010", N: "000010011", O: "100010010",
  P: "001010010", Q: "000000111", R: "100000110", S: "001000110", T: "000010110",
  U: "110000001", V: "011000001", W: "111000000", X: "010010001", Y: "110010000",
  Z: "011010000", "-": "010000101", ".": "110000100", " ": "011000100", "*": "010010100",
  $: "010101000", "/": "010100010", "+": "010001010", "%": "000101010",
};

export const WIDE = 3;

/** The bars of a Code 39 barcode as [x, width] in narrow-module units, plus the total width (quiet zones included). */
export function code39(value: string) {
  // The white panel around the barcode gives the blank edge scanners need, so the bars can use the full width
  const QUIET = 0;
  const bars: [number, number][] = [];
  let x = QUIET;
  const chars = `*${value}*`;
  for (let c = 0; c < chars.length; c++) {
    const p = CODE39[chars[c]];
    if (!p) throw new Error(`Not encodable in Code 39: ${chars[c]}`);
    for (let i = 0; i < 9; i++) {
      const w = p[i] === "1" ? WIDE : 1;
      if (i % 2 === 0) bars.push([x, w]);
      x += w;
    }
    if (c < chars.length - 1) x += 1; // narrow gap between characters
  }
  return { bars, width: x + QUIET };
}
