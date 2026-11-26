import crypto from "node:crypto";
import { metrics } from "@/lib/metrics";

/**
 * Growth numbers as JSON, for scripts/metrics.mjs and the weekly growth review.
 * Needs `Authorization: Bearer <METRICS_TOKEN>` (or FEEDBACK_TOKEN when METRICS_TOKEN is not set); off when neither is set.
 * No personal data: counts only, plus the ?ref= codes families came with.
 */
function allowed(req: Request) {
  const want = process.env.METRICS_TOKEN || process.env.FEEDBACK_TOKEN;
  if (!want || want.length < 32) return false;
  const got = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(got);
  const b = Buffer.from(want);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!allowed(req)) return new Response("Unauthorized", { status: 401 });
  return Response.json(metrics());
}
