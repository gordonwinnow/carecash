import Link from "next/link";
import { Barcode as BarcodeIcon, Bell, ClipboardCheck, Crown, FlaskConical, Globe, House, MessageSquareText, Palette, Plus, ReceiptText, UserRound } from "lucide-react";
import { db } from "@/lib/db";
import { getT, labsOn, requireCtx } from "@/lib/ctx";
import { LabsSwitch } from "@/components/labs";
import { removeMember, renameMe, switchFamily } from "../../actions";
import { ActionButton, PageTitle, Submit } from "@/components/ui";
import { ColorPicker, LanguagePicker, SignOutButton } from "@/components/settings";
import { InvitePanel } from "./invite";
import { NotifySettings } from "@/components/notify";
import { InstallLink } from "@/components/install";
import { BorderlessRow } from "./row";
import { planOf } from "@/lib/billing";

export default async function Settings({ searchParams }: { searchParams: Promise<{ invite?: string }> }) {
  const { invite } = await searchParams;
  const { me, memberships } = await requireCtx();
  const t = await getT();
  const isAdmin = me.role === "admin";
  const labs = isAdmin && labsOn(me.family_id);
  const members = db
    .prepare("select id, name, role from member where family_id = ? and active = 1 order by role, created_at")
    .all(me.family_id) as { id: string; name: string; role: string }[];

  const n = db.prepare("select notify_low, low_threshold, notify_expense, notify_cash from member where id = ?").get(me.id) as {
    notify_low: number;
    low_threshold: number;
    notify_expense: number;
    notify_cash: number;
  };
  const carrier = db.prepare("select carrier, carrier_photo from family where id = ?").get(me.family_id) as { carrier: string | null; carrier_photo: string | null };
  // The family's plan, once billing is on: trial days left, free entries used, or paid
  const plan = planOf(me.family_id);
  const planLine =
    plan.kind === "trial" ? t("planTrial", { n: plan.daysLeft }) : plan.kind === "free" ? t("planFree") : plan.kind === "paid" ? "✓" : "";
  const notify = { notify_low: !!n.notify_low, low_threshold: n.low_threshold, notify_expense: !!n.notify_expense, notify_cash: !!n.notify_cash };

  return (
    <div className="space-y-6">
      <PageTitle>{t("navSettings")}</PageTitle>

      {/* Quick links: the e-invoice barcode and feedback */}
      <section className="card !p-2">
        <BorderlessRow href="/carrier" icon={<BarcodeIcon size={20} />} title={t("carrier")} value={carrier.carrier ?? (carrier.carrier_photo ? "✓" : isAdmin ? t("carrierAdd") : "—")} />
        <BorderlessRow href="/feedback" icon={<MessageSquareText size={20} />} title={t("feedback")} />
        {isAdmin && plan.kind !== "off" && <BorderlessRow href="/plan" icon={<Crown size={20} />} title={t("plan")} value={planLine} />}
      </section>

      <section className="card space-y-3">
        <SettingHead icon={<Bell size={20} />}>{t("notifications")}</SettingHead>
        <NotifySettings initial={notify} vapidKey={process.env.VAPID_PUBLIC_KEY ?? ""} />
      </section>

      <section className="card space-y-3">
        <SettingHead icon={<Globe size={20} />}>{t("language")}</SettingHead>
        <LanguagePicker />
      </section>

      <section className="card space-y-3">
        <SettingHead icon={<Palette size={20} />}>{t("colors")}</SettingHead>
        <ColorPicker />
      </section>

      <section className="card space-y-4">
        <SettingHead icon={<House size={20} />}>{me.family_name}</SettingHead>
        <div>
          <div className="label">{t("members")}</div>
          <ul className="space-y-1">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-sunk px-3 py-2.5">
                <span className={`badge h-10 w-10 rounded-full bg-card ${m.role === "admin" ? "tone-transport" : "tone-daily"}`}>{m.role === "admin" ? <Crown size={19} /> : <UserRound size={19} />}</span>
                <div className="flex-1">
                  <div className="text-lg font-semibold">
                    {m.name} {m.id === me.id && <span className="text-muted">({t("you")})</span>}
                  </div>
                  <div className="text-sm text-muted">{m.role === "admin" ? t("roleAdmin") : t("roleCaretaker")}</div>
                </div>
                {isAdmin && m.id !== me.id && (
                  <ActionButton action={removeMember.bind(null, m.id)} confirm={`${t("remove")} ${m.name}?`} className="rounded-xl px-3 py-2 text-base font-semibold text-bad">
                    {t("remove")}
                  </ActionButton>
                )}
              </li>
            ))}
          </ul>
        </div>
        {isAdmin && (me.demo ? <p className="rounded-2xl bg-warn-soft p-4 text-base font-semibold">{t("demoNoInvite")}</p> : <InvitePanel auto={invite === "caretaker" || invite === "admin" ? invite : undefined} />)}
        <form action={renameMe} className="space-y-2">
          <label className="label" htmlFor="myname">{t("myName")}</label>
          <div className="flex gap-2">
            <input id="myname" name="name" defaultValue={me.name} className="field" maxLength={40} required />
            <div className="w-32 shrink-0">
              <Submit className="btn-tint">{t("save")}</Submit>
            </div>
          </div>
        </form>
      </section>

      {isAdmin && (
        <section className="card space-y-3">
          <SettingHead icon={<FlaskConical size={20} />}>{t("labs")}</SettingHead>
          <LabsSwitch initial={labs} />
          {labs && (
            <div className="-mx-2">
              <BorderlessRow href="/labs/checklist" icon={<ClipboardCheck size={20} />} title={t("labsChecklist")} />
              <BorderlessRow href="/labs/payslip" icon={<ReceiptText size={20} />} title={t("labsPayslip")} />
            </div>
          )}
        </section>
      )}

      {(memberships.length > 1 || isAdmin) && (
        <section className="card space-y-3">
          <SettingHead>{t("switchFamily")}</SettingHead>
          {memberships.length > 1 &&
            memberships.map((m) => (
              <ActionButton key={m.id} action={switchFamily.bind(null, m.family_id)} className={m.family_id === me.family_id ? "btn-primary" : "btn-tint"}>
                {m.family_name} · {m.role === "admin" ? t("roleAdmin") : t("roleCaretaker")}
              </ActionButton>
            ))}
          <Link href="/start" className="btn-tint"><Plus size={22} /> {t("newFamily")}</Link>
        </section>
      )}

      <div className="flex justify-center">
        <InstallLink />
      </div>
      <SignOutButton />
    </div>
  );
}

function SettingHead({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
      {icon && <span className="badge h-9 w-9 rounded-xl">{icon}</span>}
      {children}
    </h2>
  );
}
