import { redirect } from "next/navigation";
import { getCtx, getT } from "@/lib/ctx";
import { createFamily } from "../actions";
import { Submit } from "@/components/ui";
import { LanguagePicker, SignOutButton } from "@/components/settings";

export default async function Start() {
  const { user, me } = await getCtx();
  if (!user) redirect("/sign-in");
  const t = await getT();
  return (
    <main className="mx-auto max-w-md space-y-6 px-5 pb-10 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        {me ? <a href="/home" className="text-3xl">←</a> : <span />}
        <LanguagePicker compact />
      </div>
      <div className="text-center">
        <div className="text-6xl">🏡</div>
        <h1 className="mt-3 text-3xl font-extrabold">{t("startTitle")}</h1>
        <p className="mt-3 text-lg text-muted">{t("startHint")}</p>
      </div>
      <form action={createFamily} className="card space-y-4">
        <div>
          <label className="label" htmlFor="name">{t("familyName")}</label>
          <input id="name" name="name" className="field" placeholder={t("familyNamePh")} required maxLength={60} />
        </div>
        <Submit>{t("createFamily")}</Submit>
      </form>
      <SignOutButton />
    </main>
  );
}
