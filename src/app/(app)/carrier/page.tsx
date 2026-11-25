import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { getT, requireCtx } from "@/lib/ctx";
import { removeCarrier } from "../../actions";
import { ActionButton, BackHeader } from "@/components/ui";
import { Barcode } from "@/components/barcode";
import { CarrierForm, CopyButton } from "./form";

/**
 * The family's e-invoice barcode, ready to show at checkout: large, black on white, with the code to copy.
 * Employers add or change it here; with none yet, they get the form right away.
 */
export default async function Carrier({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { me } = await requireCtx();
  const { edit } = await searchParams;
  const t = await getT();
  const isAdmin = me.role === "admin";
  const f = db.prepare("select carrier, carrier_photo from family where id = ?").get(me.family_id) as { carrier: string | null; carrier_photo: string | null };
  const has = !!(f.carrier || f.carrier_photo);
  const editing = isAdmin && (!has || edit === "1");

  return (
    <div className="space-y-5">
      <BackHeader title={t("carrier")} href={editing && has ? "/carrier" : "/home"} />

      {editing ? (
        <>
          {!has && <p className="text-base text-muted">{t("carrierSetupHint")}</p>}
          <CarrierForm initial={f.carrier} />
          {has && (
            <ActionButton action={removeCarrier} confirm={t("confirmDelete")} className="flex w-full items-center justify-center gap-2 py-1 text-base font-semibold text-bad">
              <Trash2 size={18} /> {t("delete")}
            </ActionButton>
          )}
        </>
      ) : has ? (
        <>
          {/* White in dark mode too: scanners need the contrast */}
          <section className="overflow-hidden rounded-[28px] bg-white [box-shadow:var(--shadow)]">
            {f.carrier ? (
              <>
                <div className="px-6 pb-4 pt-7">
                  <Barcode value={f.carrier} className="h-36" />
                </div>
                <div className="flex items-center justify-between gap-3 bg-[#eef6f4] px-6 py-3">
                  <span className="tabular text-2xl font-bold tracking-wider text-[#1c1b19]">{f.carrier}</span>
                  {/* Fixed light colors: this strip stays light in dark mode */}
                  <CopyButton text={f.carrier} className="bg-white text-[#1f7a55]" />
                </div>
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/api/photo/${f.carrier_photo}`} alt={t("carrier")} className="w-full object-contain" />
            )}
          </section>
          <p className="text-center text-base text-muted">{t("carrierHint")}</p>
          {isAdmin && (
            <Link href="/carrier?edit=1" className="flex items-center justify-center gap-2 py-1 text-base font-semibold text-accent">
              <Pencil size={18} /> {t("change")}
            </Link>
          )}
        </>
      ) : (
        <p className="rounded-3xl bg-sunk p-5 text-center text-base text-muted">{t("carrierNone")}</p>
      )}
    </div>
  );
}
