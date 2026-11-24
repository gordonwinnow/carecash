"use client";
import { useEffect, useState } from "react";
import { Check, EllipsisVertical, Plus, Share, SquarePlus, X } from "lucide-react";
import { useT } from "./i18n";

type InstallEvent = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> };

/**
 * "Add to Home Screen" link.
 * Chrome/Android/desktop: opens the browser's own install prompt.
 * iPhone/iPad: Safari can't be triggered from a page, so it shows a short animated walkthrough instead.
 * Hidden inside the iOS app and once installed.
 */
export function InstallLink({ className = "" }: { className?: string }) {
  const t = useT();
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [kind, setKind] = useState<"hidden" | "ios" | "other">("hidden");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const standalone = matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone;
    const inApp = !!(window as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();
    if (standalone || inApp) return;
    // Chrome only offers installing a site that has a service worker
    navigator.serviceWorker?.register("/sw.js").catch(() => {});
    setKind(/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)) ? "ios" : "other");
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
    };
    const onInstalled = () => setKind("hidden");
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (kind === "hidden") return null;

  return (
    <>
      <button
        type="button"
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold text-accent ${className}`}
        onClick={async () => {
          if (deferred) {
            await deferred.prompt();
            setDeferred(null);
          } else setOpen(true);
        }}
      >
        <SquarePlus size={20} /> {t("installLink")}
      </button>
      {open && <Walkthrough ios={kind === "ios"} onClose={() => setOpen(false)} />}
    </>
  );
}

/** A bottom sheet that animates the three taps, one after another, on a loop. */
function Walkthrough({ ios, onClose }: { ios: boolean; onClose: () => void }) {
  const t = useT();
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 3), 1800);
    return () => clearInterval(id);
  }, []);
  const steps = ios
    ? [
        { icon: <Share size={22} />, text: t("installIos1") },
        { icon: <SquarePlus size={22} />, text: t("installIos2") },
        { icon: <Check size={22} />, text: t("installIos3") },
      ]
    : [
        { icon: <EllipsisVertical size={22} />, text: t("installOther1") },
        { icon: <SquarePlus size={22} />, text: t("installOther2") },
        { icon: <Check size={22} />, text: t("installIos3") },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-[28px] bg-card px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">{t("installLink")}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full bg-sunk">
            <X size={20} />
          </button>
        </div>

        {/* A mock phone screen: the part to tap lights up for each step */}
        <div className="relative mb-4 h-52 overflow-hidden rounded-3xl bg-sunk">
          <div className={`absolute inset-x-6 bottom-14 rounded-2xl bg-card p-2 shadow-lg transition-all duration-500 ${step >= 1 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
            {[t("installMockCopy"), t("installLink"), t("installMockBookmark")].map((label, i) => (
              <div
                key={i}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-[15px] transition ${i === 1 && step === 1 ? "bg-accent text-on-accent" : "text-muted"}`}
              >
                {label}
                {i === 1 && <Plus size={16} />}
              </div>
            ))}
          </div>
          <div className={`absolute right-4 top-4 rounded-full px-4 py-1.5 text-[15px] font-bold transition ${step === 2 ? "scale-110 bg-accent text-on-accent" : "bg-card text-muted"}`}>
            {t("installMockAdd")}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-around bg-card/80 text-muted">
            <span className="h-2 w-8 rounded-full bg-line" />
            <span className={`flex h-9 w-9 items-center justify-center rounded-full transition ${step === 0 ? "animate-pulse bg-accent text-on-accent" : ""}`}>
              {ios ? <Share size={20} /> : <EllipsisVertical size={20} />}
            </span>
            <span className="h-2 w-8 rounded-full bg-line" />
          </div>
        </div>

        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={i} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-lg font-semibold transition ${step === i ? "bg-accent-soft" : ""}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${step === i ? "bg-accent text-on-accent" : "bg-sunk text-muted"}`}>{s.icon}</span>
              {s.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
