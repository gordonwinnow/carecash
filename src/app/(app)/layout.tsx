import { db } from "@/lib/db";
import { requireCtx } from "@/lib/ctx";
import { BottomNav, NumpadPrimer } from "@/components/ui";
import { DemoBanner } from "@/components/settings";
import { PushOpen } from "@/components/notify";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { me } = await requireCtx();
  // The advanced tab is always there for masters; caretakers only see it once something is shared with them.
  const showMore =
    me.role === "admin" ||
    !!db.prepare("select 1 from record where family_id = ? and shared = 1 and (caretaker_id is null or caretaker_id = ?) limit 1").get(me.family_id, me.id);
  return (
    <>
      {!!me.demo && <DemoBanner />}
      <main className="mx-auto max-w-xl px-4 pb-32 pt-[max(1rem,env(safe-area-inset-top))]">{children}</main>
      <BottomNav showMore={showMore} />
      <PushOpen />
      <NumpadPrimer />
    </>
  );
}
