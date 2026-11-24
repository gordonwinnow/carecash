import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getUser, getT } from "@/lib/ctx";
import { joinFamily } from "../../actions";
import { Submit } from "@/components/ui";
import { LanguagePicker } from "@/components/settings";

export default async function Join({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const t = await getT();
  const inv = db
    .prepare("select i.role, f.name as family from invite i join family f on f.id = i.family_id where i.code = ? and i.expires_at > ?")
    .get(code, Date.now()) as { role: string; family: string } | undefined;

  if (!inv)
    return (
      <main className="mx-auto max-w-md px-5 pt-16 text-center">
        <div className="text-6xl">⌛</div>
        <p className="mt-4 text-xl">{t("inviteInvalid")}</p>
        <a href="/" className="btn-soft mt-8">{t("navHome")}</a>
      </main>
    );

  const user = await getUser();
  if (!user) redirect(`/sign-in?next=/join/${code}`);
  const isPhoneName = /^\+?\d[\d ]+$/.test(user.name ?? "");

  return (
    <main className="mx-auto max-w-md space-y-6 px-5 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex justify-end">
        <LanguagePicker compact />
      </div>
      <div className="text-center">
        <div className="text-6xl">{inv.role === "caretaker" ? "🤝" : "👨‍👩‍👧"}</div>
        <h1 className="mt-3 text-3xl font-extrabold">{t("joinTitle", { family: inv.family })}</h1>
        <p className="mt-3 text-xl text-muted">
          {t("joinAs", { role: inv.role === "caretaker" ? t("roleCaretaker") : t("roleAdmin") })}
        </p>
      </div>
      <form action={joinFamily.bind(null, code)} className="card space-y-4">
        <div>
          <label className="label" htmlFor="name">{t("yourName")}</label>
          <input id="name" name="name" className="field" defaultValue={isPhoneName ? "" : (user.name ?? "")} required maxLength={40} />
        </div>
        <Submit>{t("join")}</Submit>
      </form>
    </main>
  );
}
