/**
 * Where ECPay sends the employer's browser back after paying (a form POST). The plan itself is updated by the
 * server-to-server notification, so this only shows the result.
 */
export async function POST(req: Request) {
  const f = new URLSearchParams(await req.text());
  return new Response(null, { status: 303, headers: { location: f.get("RtnCode") === "1" ? "/plan?paid=1" : "/plan?failed=1" } });
}
