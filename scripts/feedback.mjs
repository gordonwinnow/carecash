#!/usr/bin/env node
/**
 * Read and answer CareCash feedback from the terminal (for the owners, and for Claude when asked to triage or fix it).
 * Needs FEEDBACK_TOKEN (the same secret as on the server); CARECASH_URL defaults to https://carecash.me.
 *
 *   node scripts/feedback.mjs list [open|new|planned|doing|done|declined]
 *   node scripts/feedback.mjs reply <id> <status> "<reply text>"
 *   node scripts/feedback.mjs photo <name> [out.jpg]
 */
import fs from "node:fs";

const base = (process.env.CARECASH_URL || "https://carecash.me").replace(/\/$/, "");
const token = process.env.FEEDBACK_TOKEN;
if (!token) {
  console.error("Set FEEDBACK_TOKEN first.");
  process.exit(1);
}
const auth = { Authorization: `Bearer ${token}` };
const [cmd, ...args] = process.argv.slice(2);

if (cmd === "list" || !cmd) {
  const q = args[0] ? `?status=${encodeURIComponent(args[0])}` : "";
  const res = await fetch(`${base}/api/feedback${q}`, { headers: auth });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  for (const f of await res.json()) {
    console.log(`\n[${f.status}] ${f.id}  ${f.created.slice(0, 10)}  ${f.name ?? ""}${f.photo ? `  photo:${f.photo}` : ""}`);
    console.log(f.body);
    if (f.reply) console.log(`  ↳ ${f.reply}`);
  }
} else if (cmd === "reply") {
  const [id, status, reply] = args;
  const res = await fetch(`${base}/api/feedback`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify({ id, status, reply }) });
  console.log(res.status, await res.text());
} else if (cmd === "photo") {
  const [name, out = name] = args;
  const res = await fetch(`${base}/api/feedback?photo=${encodeURIComponent(name)}`, { headers: auth });
  if (!res.ok) throw new Error(`${res.status}`);
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  console.log(`Saved ${out}`);
} else {
  console.error("Commands: list [status] | reply <id> <status> <text> | photo <name> [out]");
  process.exit(1);
}
