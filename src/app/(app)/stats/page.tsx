import { redirect } from "next/navigation";
import { isOwner, requireCtx } from "@/lib/ctx";
import { metrics } from "@/lib/metrics";
import { BackHeader } from "@/components/ui";

/** For the app's owners (OWNER_EMAILS): growth toward the goal, week by week, and which channels bring households. */
export default async function Stats() {
  const { user } = await requireCtx();
  if (!isOwner(user)) redirect("/home");
  const m = metrics();
  const t = m.totals;
  const tiles = [
    { label: "註冊人數 Signups", value: t.signups, goal: m.goal.signups },
    { label: "每週活躍 Weekly active", value: t.weeklyActiveUsers, goal: m.goal.weeklyActiveUsers },
    { label: "家庭 Households", value: t.households },
    { label: "已啟用 Activated", value: t.activatedHouseholds, hint: "有看護加入且有支出" },
  ];
  return (
    <div className="space-y-4">
      <BackHeader title="Growth 成長" href="/feedback" />
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((x) => (
          <div key={x.label} className="card">
            <div className="text-sm font-semibold text-muted">{x.label}</div>
            <div className="mt-1 text-3xl font-extrabold tabular-nums">
              {x.value}
              {x.goal && <span className="text-base font-semibold text-muted"> / {x.goal}</span>}
            </div>
            {x.goal && (
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-sunk">
                <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, (100 * x.value) / x.goal)}%` }} />
              </div>
            )}
            {x.hint && <div className="mt-1 text-xs text-muted">{x.hint}</div>}
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="mb-2 font-bold">Funnel 啟用漏斗</h2>
        <div className="space-y-2">
          {m.funnel.map((f, i) => {
            const top = Math.max(1, m.funnel[0].count);
            const prev = i > 0 ? m.funnel[i - 1].count : null;
            return (
              <div key={f.step}>
                <div className="flex justify-between text-sm">
                  <span>{f.step}</span>
                  <span className="tabular-nums font-bold">
                    {f.count}
                    {prev ? <span className="ml-2 font-normal text-muted">{Math.round((100 * f.count) / prev)}%</span> : null}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-sunk">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(100 * f.count) / top}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-2 font-bold">By week 每週</h2>
        <table className="w-full text-right text-sm tabular-nums">
          <thead className="text-muted">
            <tr><th className="text-left font-semibold">Week ending</th><th className="font-semibold">Signups</th><th className="font-semibold">Households</th><th className="font-semibold">Active</th></tr>
          </thead>
          <tbody>
            {m.weeks.map((w) => (
              <tr key={w.weekEnding} className="border-t border-line">
                <td className="py-1.5 text-left">{w.weekEnding}</td><td>{w.signups}</td><td>{w.households}</td><td>{w.activeUsers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 className="mb-1 font-bold">By source 來源</h2>
        <p className="mb-2 text-xs text-muted">From links with ?ref=code, e.g. carecash.me/?ref=broker-abc</p>
        <table className="w-full text-right text-sm tabular-nums">
          <thead className="text-muted">
            <tr><th className="text-left font-semibold">Source</th><th className="font-semibold">Households</th><th className="font-semibold">Activated</th><th className="font-semibold">Active 7d</th></tr>
          </thead>
          <tbody>
            {m.sources.map((s) => (
              <tr key={s.source} className="border-t border-line">
                <td className="max-w-40 truncate py-1.5 text-left">{s.source}</td><td>{s.households}</td><td>{s.activated}</td><td>{s.activeLast7d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
