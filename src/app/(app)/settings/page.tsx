import Link from "next/link";
import { db } from "@/lib/db";
import { getT, requireCtx } from "@/lib/ctx";
import { removeMember, renameMe, switchFamily } from "../../actions";
import { ActionButton, Submit } from "@/components/ui";
import { ColorPicker, LanguagePicker, SignOutButton } from "@/components/settings";
import { InvitePanel } from "./invite";

export default async function Settings() {
  const { me, memberships } = await requireCtx();
  const t = await getT();
  const isAdmin = me.role === "admin";
  const members = db
    .prepare("select id, name, role from member where family_id = ? and active = 1 order by role, created_at")
    .all(me.family_id) as { id: string; name: string; role: string }[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">⚙️ {t("navSettings")}</h1>

      <section className="card space-y-3">
        <h2 className="text-xl font-extrabold">🌐 {t("language")}</h2>
        <LanguagePicker />
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-extrabold">🎨 {t("colors")}</h2>
        <ColorPicker />
      </section>

      <section className="card space-y-4">
        <h2 className="text-xl font-extrabold">🏡 {me.family_name}</h2>
        <div>
          <div className="label">{t("members")}</div>
          <ul className="divide-y divide-line rounded-2xl border border-line">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-2xl">{m.role === "admin" ? "👑" : "🙋"}</span>
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
        {isAdmin && (me.demo ? <p className="rounded-2xl bg-warn-soft p-4 text-base font-semibold">{t("demoNoInvite")}</p> : <InvitePanel />)}
        <form action={renameMe} className="space-y-2">
          <label className="label" htmlFor="myname">{t("myName")}</label>
          <div className="flex gap-2">
            <input id="myname" name="name" defaultValue={me.name} className="field" maxLength={40} required />
            <div className="w-32 shrink-0">
              <Submit className="btn-soft">{t("save")}</Submit>
            </div>
          </div>
        </form>
      </section>

      {(memberships.length > 1 || isAdmin) && (
        <section className="card space-y-3">
          <h2 className="text-xl font-extrabold">{t("switchFamily")}</h2>
          {memberships.length > 1 &&
            memberships.map((m) => (
              <ActionButton key={m.id} action={switchFamily.bind(null, m.family_id)} className={m.family_id === me.family_id ? "btn-primary" : "btn-soft"}>
                {m.family_name} · {m.role === "admin" ? t("roleAdmin") : t("roleCaretaker")}
              </ActionButton>
            ))}
          <Link href="/start" className="btn-soft">➕ {t("newFamily")}</Link>
        </section>
      )}

      <SignOutButton />
    </div>
  );
}
