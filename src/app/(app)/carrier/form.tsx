"use client";
import { useEffect, useState } from "react";
import { Check, ClipboardPaste, Copy, ImageUp } from "lucide-react";
import { normalizeCarrier } from "@/lib/carrier";
import { Barcode } from "@/components/barcode";
import { PhotoInput, Submit } from "@/components/ui";
import { useT } from "@/components/i18n";
import { saveCarrier } from "../../actions";

/**
 * Paste (or type) the mobile barcode number and see the barcode right away.
 * A screenshot of the barcode is the fallback, for anyone who only has the picture.
 */
export function CarrierForm({ initial }: { initial?: string | null }) {
  const t = useT();
  const [raw, setRaw] = useState(initial ?? "");
  const [usePhoto, setUsePhoto] = useState(false);
  const [canPaste, setCanPaste] = useState(false);
  useEffect(() => setCanPaste(!!navigator.clipboard?.readText), []);
  const code = normalizeCarrier(raw);
  const typed = raw.trim().length > 0;

  async function paste() {
    try {
      const v = await navigator.clipboard.readText();
      if (v) setRaw(v.trim());
    } catch {}
  }

  return (
    <form action={saveCarrier} className="space-y-4">
      {!usePhoto && (
        <>
          <div>
            <label className="label" htmlFor="code">{t("carrierCode")}</label>
            <div className="flex gap-2">
              <input
                id="code"
                name="code"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder="/"
                autoCapitalize="characters"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                maxLength={12}
                className="field tabular text-2xl font-bold uppercase tracking-wider"
              />
              {canPaste && (
                <button type="button" onClick={paste} className="btn-tint w-auto shrink-0 px-4 text-base">
                  <ClipboardPaste size={20} /> {t("paste")}
                </button>
              )}
            </div>
            <p className={`mt-2 text-sm ${typed && !code ? "font-semibold text-bad" : "text-muted"}`}>{t("carrierFormat")}</p>
          </div>
          {/* The barcode appears as soon as the code is complete */}
          {code && (
            <div className="rounded-3xl bg-white px-5 py-5 [box-shadow:var(--shadow)]">
              <Barcode value={code} className="h-24" />
            </div>
          )}
          <Submit className="btn-primary min-h-16 text-xl" disabled={!code}>
            <Check size={24} strokeWidth={2.6} /> {t("save")}
          </Submit>
          <button type="button" onClick={() => setUsePhoto(true)} className="flex w-full items-center justify-center gap-2 py-1 text-base font-semibold text-muted">
            <ImageUp size={18} /> {t("carrierUsePhoto")}
          </button>
        </>
      )}
      {usePhoto && <PhotoFallback onBack={() => setUsePhoto(false)} />}
    </form>
  );
}

function PhotoFallback({ onBack }: { onBack: () => void }) {
  const t = useT();
  return (
    <>
      <PhotoInput big label={t("carrierPickPhoto")} camera={false} />
      <Submit className="btn-primary min-h-16 text-xl">
        <Check size={24} strokeWidth={2.6} /> {t("save")}
      </Submit>
      <button type="button" onClick={onBack} className="w-full py-1 text-base font-semibold text-muted">
        {t("carrierUseCode")}
      </button>
    </>
  );
}

/** Copies the code, with a short "Copied" confirmation in place of the label. */
export function CopyButton({ text, className = "bg-accent-soft text-accent-ink" }: { text: string; className?: string }) {
  const t = useT();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {}
      }}
      className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-base font-bold ${className}`}
    >
      {done ? <Check size={18} /> : <Copy size={18} />} {done ? t("copied") : t("copy")}
    </button>
  );
}
