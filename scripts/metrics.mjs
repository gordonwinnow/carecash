#!/usr/bin/env node
/**
 * CareCash growth numbers from the terminal (for the owners, and for Claude's weekly growth review).
 * Needs METRICS_TOKEN (or FEEDBACK_TOKEN, the same secret as on the server); CARECASH_URL defaults to https://carecash.me.
 *
 *   node scripts/metrics.mjs          readable summary
 *   node scripts/metrics.mjs json     raw JSON
 */
const base = (process.env.CARECASH_URL || "https://carecash.me").replace(/\/$/, "");
const token = process.env.METRICS_TOKEN || process.env.FEEDBACK_TOKEN;
if (!token) {
  console.error("Set METRICS_TOKEN (or FEEDBACK_TOKEN) first.");
  process.exit(1);
}
const res = await fetch(`${base}/api/metrics`, { headers: { Authorization: `Bearer ${token}` } });
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
const m = await res.json();
if (process.argv[2] === "json") {
  console.log(JSON.stringify(m, null, 2));
  process.exit(0);
}
const t = m.totals;
console.log(`CareCash metrics at ${m.at}`);
console.log(`Signups ${t.signups} / ${m.goal.signups}   Weekly active users ${t.weeklyActiveUsers} / ${m.goal.weeklyActiveUsers}`);
console.log(`Households ${t.households}  with caretaker ${t.householdsWithCaretaker}  activated ${t.activatedHouseholds}  active this week ${t.weeklyActiveHouseholds}`);
console.log("\nWeek ending   signups  households  active users");
for (const w of m.weeks) console.log(`${w.weekEnding}   ${String(w.signups).padStart(7)}  ${String(w.households).padStart(10)}  ${String(w.activeUsers).padStart(12)}`);
console.log("\nSource                         households  activated  active 7d");
for (const s of m.sources) console.log(`${s.source.padEnd(30)} ${String(s.households).padStart(10)}  ${String(s.activated).padStart(9)}  ${String(s.activeLast7d).padStart(9)}`);
