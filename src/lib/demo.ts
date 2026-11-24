import "server-only";
import { db, newId } from "./db";
import { today } from "./format";

const DAY = 24 * 3600 * 1000;

/** Removes demo families older than 3 days, with everything in them. */
function cleanup() {
  const old = db.prepare("select id from family where demo = 1 and created_at < ?").all(Date.now() - 3 * DAY) as { id: string }[];
  const tx = db.transaction((ids: string[]) => {
    for (const id of ids) {
      for (const t of ["audit", "cash", "expense", "record", "invite", "member"]) db.prepare(`delete from ${t} where family_id = ?`).run(id);
      db.prepare("delete from family where id = ?").run(id);
    }
  });
  tx(old.map((o) => o.id));
}

/**
 * Builds a sample family for a guest: two months of grocery cash and receipts,
 * one cash hand-over waiting for the caretaker, one the caretaker recorded herself,
 * and salary and healthcare records (one shared with the caretaker).
 */
export function seedDemo(userId: string, role: "admin" | "caretaker") {
  cleanup();
  const now = Date.now();
  const fid = newId();
  const master = newId();
  const caretaker = newId();
  const ins = {
    cash: db.prepare(
      "insert into cash (id, family_id, caretaker_id, amount, note, given_by, created_by, created_at, ack_at, confirmed_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ),
    exp: db.prepare(
      "insert into expense (id, family_id, member_id, amount, category, note, photo, spent_at, created_at) values (?, ?, ?, ?, ?, ?, null, ?, ?)",
    ),
    rec: db.prepare(
      "insert into record (id, family_id, caretaker_id, kind, amount, note, photo, date, shared, created_by, created_at) values (?, ?, ?, ?, ?, ?, null, ?, ?, ?, ?)",
    ),
  };
  const dateAgo = (days: number) => new Date(now - days * DAY).toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });

  db.transaction(() => {
    db.prepare("insert into family (id, name, created_at, demo) values (?, ?, ?, 1)").run(fid, "Demo 陳家", now);
    const m = db.prepare("insert into member (id, family_id, user_id, role, name, created_at) values (?, ?, ?, ?, ?, ?)");
    m.run(master, fid, role === "admin" ? userId : `demo:${newId()}`, "admin", "陳先生", now - 60 * DAY);
    m.run(caretaker, fid, role === "caretaker" ? userId : `demo:${newId()}`, "caretaker", "Siti", now - 60 * DAY);

    // Cash: two acknowledged hand-overs, one the caretaker recorded herself, one still waiting
    ins.cash.run(newId(), fid, caretaker, 5000, null, master, master, now - 38 * DAY, now - 38 * DAY + 3600e3, null);
    ins.cash.run(newId(), fid, caretaker, 5000, null, master, master, now - 8 * DAY, now - 8 * DAY + 600e3, null);
    ins.cash.run(newId(), fid, caretaker, 1000, "For medicine", master, caretaker, now - 3 * DAY, now - 3 * DAY, null);
    ins.cash.run(newId(), fid, caretaker, 3000, null, master, master, now - 2 * 3600e3, null, null);

    const exps: [number, number, string, string][] = [
      [36, 820, "food", "全聯 vegetables & fruit"],
      [33, 260, "daily", "Tissue, soap"],
      [30, 1150, "food", "Market: fish, pork"],
      [27, 180, "transport", "Taxi to clinic"],
      [24, 640, "food", "Rice, eggs"],
      [20, 450, "medicine", "Pharmacy"],
      [15, 930, "food", "全聯"],
      [7, 1240, "food", "Costco"],
      [5, 320, "daily", "Laundry detergent"],
      [3, 560, "medicine", "Vitamins"],
      [1, 410, "food", "Morning market"],
    ];
    for (const [d, amt, cat, note] of exps) ins.exp.run(newId(), fid, caretaker, amt, cat, note, now - d * DAY, now - d * DAY);

    ins.rec.run(newId(), fid, caretaker, "salary", 20000, "October salary", dateAgo(25), 1, master, now - 25 * DAY);
    ins.rec.run(newId(), fid, caretaker, "health", 850, "Health check", dateAgo(12), 1, master, now - 12 * DAY);
    ins.rec.run(newId(), fid, caretaker, "other", 1900, "Agency service fee", dateAgo(10), 0, master, now - 10 * DAY);
    ins.rec.run(newId(), fid, null, "other", 1000, "ARC renewal", today(), 0, master, now);
  })();
  return fid;
}
