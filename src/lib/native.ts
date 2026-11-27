/**
 * True inside the iPhone app's web view: an iOS user agent without the "Safari/" token.
 * In-app browsers of Facebook, Instagram and LINE count as ordinary browsers.
 */
export function isNativeApp(ua: string) {
  return /iPhone|iPad|iPod/.test(ua) && !/Safari\/|FBAN|FBAV|Instagram|Line\//.test(ua);
}
