import { db } from "./db";
import { balanceOf } from "./ctx";
import { money } from "./format";
import { translate, type Key, type Lang } from "./i18n";
import { send, subsOf } from "./push";

type Watcher = { id: string; user_id: string; role: string; notify_low: number; low_threshold: number; notify_expense: number; notify_cash: number };

/** People in the family who care about this caretaker's money: the employers, and the caretaker herself. */
function watchersOf(familyId: string, caretakerId: string) {
  return db
    .prepare(
      `select id, user_id, role, notify_low, low_threshold, notify_expense, notify_cash from member
       where family_id = ? and active = 1 and (role = 'admin' or id = ?)`,
    )
    .all(familyId, caretakerId) as Watcher[];
}

export function deliver(userId: string, url: string, body: (lang: Lang) => string) {
  for (const s of subsOf(userId)) {
    const lang = s.lang as Lang;
    void send(s, { title: translate(lang, "appName"), body: body(lang), url });
  }
}

/**
 * Runs a change to a caretaker's money and then notifies:
 * - anyone with "every expense" or "every deposit" on, when one is added (not the person who added it);
 * - anyone with the low-balance alert on, when money left drops below their number.
 */
export async function watchBalance<R>(
  familyId: string,
  caretakerId: string,
  change: () => R | Promise<R>,
  news?: { actorId: string; actorName: string; kind: "expense" | "cash"; amount: number; category?: string },
) {
  const before = balanceOf(caretakerId).left;
  const result = await change();
  try {
    const after = balanceOf(caretakerId).left;
    const caretaker = db.prepare("select name, role from member where id = ?").get(caretakerId) as { name: string; role: string } | undefined;
    const currency = (db.prepare("select currency from family where id = ?").get(familyId) as { currency: string } | undefined)?.currency ?? "TWD";
    for (const w of watchersOf(familyId, caretakerId)) {
      if (news && w.id !== news.actorId && (news.kind === "expense" ? w.notify_expense : w.notify_cash)) {
        deliver(w.user_id, "/history", (lang) =>
          news.kind === "expense"
            ? translate(lang, "pushExpense", { name: news.actorName, amount: money(news.amount, currency), what: translate(lang, `cat_${news.category}` as Key) })
            : translate(lang, "pushCash", { name: news.actorName, amount: money(news.amount, currency) }),
        );
      }
      // Only caretakers hold household cash; an employer paying for something has no balance to run low
      if (caretaker?.role === "caretaker" && w.notify_low && after < w.low_threshold && before >= w.low_threshold) {
        deliver(w.user_id, "/home", (lang) =>
          translate(lang, w.role === "admin" ? "pushLowOf" : "pushLow", { name: caretaker?.name ?? "", amount: money(after, currency) }),
        );
      }
    }
  } catch (e) {
    console.error("notify failed", e);
  }
  return result;
}
