"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Banknote, Camera, ChevronLeft, Lock, ReceiptText, RotateCcw, Settings, X } from "lucide-react";
import { useT } from "./i18n";

export function Submit({ children, className = "btn-primary", disabled }: { children: React.ReactNode; className?: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending || disabled}>
      {pending ? "…" : children}
    </button>
  );
}

/** A button that runs a server action after an optional confirm. */
export function ActionButton({
  action,
  confirm,
  className,
  children,
}: {
  action: () => Promise<unknown>;
  confirm?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      className={className}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        start(async () => {
          await action();
          router.refresh();
        });
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}

const TEXT_INPUT = /^(text|email|tel|number|password|search|url|date)$/;
function isTyping(el: Element | null) {
  if (!el) return false;
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return true;
  return el instanceof HTMLInputElement && TEXT_INPUT.test(el.type);
}

/**
 * The tab bar, as on iOS: it stays at the bottom of the screen and never rides up on the keyboard.
 * It hides while a text field is focused, and on full-screen "add" pages.
 */
export function BottomNav({ showMore }: { showMore: boolean }) {
  const t = useT();
  const path = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      // focusout fires before focus lands on the next field, so check on the next frame
      requestAnimationFrame(() => {
        if (isTyping(document.activeElement)) root.dataset.typing = "";
        else delete root.dataset.typing;
      });
    };
    sync();
    document.addEventListener("focusin", sync);
    document.addEventListener("focusout", sync);
    return () => {
      document.removeEventListener("focusin", sync);
      document.removeEventListener("focusout", sync);
      delete root.dataset.typing;
    };
  }, [path]);

  if (path.endsWith("/new")) return null;

  const items = [
    { href: "/home", Icon: Banknote, label: t("navHome") },
    { href: "/history", Icon: ReceiptText, label: t("navHistory") },
    ...(showMore ? [{ href: "/more", Icon: Lock, label: t("navMore") }] : []),
    { href: "/settings", Icon: Settings, label: t("navSettings") },
  ];
  return (
    <nav className="tabbar fixed inset-x-0 bottom-0 z-20 bg-card/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-200 [box-shadow:0_-1px_0_var(--line)]">
      <div className="mx-auto flex max-w-xl">
        {items.map(({ href, Icon, label }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 pb-2 pt-2.5 text-[13px] font-semibold ${active ? "text-accent" : "text-muted"}`}
            >
              <span className={`flex h-8 w-14 items-center justify-center rounded-full transition ${active ? "bg-accent-soft" : ""}`}>
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span className="text-center leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PhotoThumb({ name, size = 56 }: { name: string; size?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="shrink-0 overflow-hidden rounded-2xl bg-sunk" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/api/photo/${name}`} alt="" loading="lazy" className="h-full w-full object-cover" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/photo/${name}`} alt="" className="max-h-full max-w-full rounded-xl" />
          <button className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black" aria-label="Close">
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
}

/** Shrinks a camera photo to ~1600px JPEG so uploads stay small on mobile data. */
async function compress(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej()), "image/jpeg", 0.72));
  } catch {
    return file;
  }
}

export function PhotoInput({ big = true, label, existing }: { big?: boolean; label: string; existing?: string | null }) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existing ? `/api/photo/${existing}` : null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const blob = await compress(f);
    const dt = new DataTransfer();
    dt.items.add(new File([blob], "photo.jpg", { type: "image/jpeg" }));
    if (hiddenRef.current) hiddenRef.current.files = dt.files;
    setPreview(URL.createObjectURL(blob));
  }

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPick} />
      <input ref={hiddenRef} type="file" name="photo" className="hidden" />
      {preview ? (
        // The whole photo is shown, letterboxed, so nothing on the receipt is cut off
        <div className="relative overflow-hidden rounded-3xl bg-sunk">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="mx-auto max-h-[60vh] w-full object-contain" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2.5 text-base font-bold text-white backdrop-blur"
          >
            <RotateCcw size={18} /> {t("retake")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`flex w-full items-center justify-center gap-3 rounded-3xl bg-accent-soft font-bold text-accent-ink transition active:scale-[0.98] ${big ? "h-28 text-xl" : "h-20 text-lg"}`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-on-accent">
            <Camera size={24} />
          </span>
          {label}
        </button>
      )}
    </div>
  );
}

export function AmountInput({ quick, autoFocus, initial }: { quick?: number[]; autoFocus?: boolean; initial?: number }) {
  const t = useT();
  const [v, setV] = useState(initial ? String(initial) : "");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!autoFocus) return;
    ref.current?.focus();
    // Hand over from the number-pad primer (see NumpadPrimer) now that the real field has focus
    document.getElementById(PRIMER_ID)?.remove();
  }, [autoFocus]);
  return (
    <div>
      <label className="label" htmlFor="amount">{t("amount")}</label>
      <div className="flex items-baseline rounded-3xl bg-card px-5 py-3 ring-2 ring-transparent transition [box-shadow:var(--shadow)] focus-within:ring-accent">
        <span className="text-2xl font-bold text-muted">NT$</span>
        <input
          ref={ref}
          id="amount"
          name="amount"
          required
          inputMode="numeric"
          pattern="[0-9,]*"
          autoComplete="off"
          autoFocus={autoFocus}
          enterKeyHint="done"
          value={v}
          onChange={(e) => setV(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="0"
          className="tabular w-full min-w-0 bg-transparent px-3 py-2 text-5xl font-extrabold tracking-tight outline-none placeholder:text-muted/40"
        />
      </div>
      {quick && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {quick.map((q) => (
            <button key={q} type="button" className="chip tabular" aria-pressed={v === String(q)} onClick={() => setV(String(q))}>
              {q.toLocaleString("en-US")}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChipGroup({
  name,
  options,
  initial,
  cols = 3,
  compact,
}: {
  name: string;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  initial?: string;
  cols?: number;
  /** Narrow chips so five fit in one row on a phone; labels may wrap to two lines. */
  compact?: boolean;
}) {
  const [v, setV] = useState(initial ?? options[0]?.value ?? "");
  return (
    <div className={`grid ${compact ? "gap-1.5" : "gap-2"}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      <input type="hidden" name={name} value={v} />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`chip flex-col !gap-1 ${compact ? "min-h-[88px] justify-center !gap-1.5 !px-0.5 py-2.5 text-[12px] tracking-tight" : "min-h-16 py-2.5 text-base"}`}
          aria-pressed={v === o.value}
          onClick={() => setV(o.value)}
        >
          {o.icon}
          <span className="leading-tight">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function BackHeader({ title, href = "/home" }: { title: string; href?: string }) {
  return (
    <header className="mb-2 flex items-center gap-3">
      <Link href={href} className="-ml-1 flex h-12 w-12 items-center justify-center rounded-full bg-card text-ink [box-shadow:var(--shadow)]" aria-label="Back">
        <ChevronLeft size={26} />
      </Link>
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
    </header>
  );
}

/** Page title with a small tinted icon, used on the tab pages. */
export function PageTitle({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <header className="pt-2">
      <h1 className="text-3xl font-extrabold tracking-tight">{children}</h1>
      {sub && <p className="mt-1 text-base text-muted">{sub}</p>}
    </header>
  );
}

const PRIMER_ID = "numpad-primer";
const ADD_PAGE = /^\/(expense|cash|more)\/new(\?|$)/;

/**
 * iPhone only opens the keyboard when a field is focused inside the tap itself, but the amount field
 * appears a moment later on the next screen. So a tap on any "add" link focuses an invisible number
 * field right away (the number pad opens), and AmountInput takes the focus over when it mounts.
 */
export function NumpadPrimer() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || !ADD_PAGE.test(a.getAttribute("href") ?? "")) return;
      let el = document.getElementById(PRIMER_ID) as HTMLInputElement | null;
      if (!el) {
        el = document.createElement("input");
        el.id = PRIMER_ID;
        el.inputMode = "numeric";
        el.setAttribute("aria-hidden", "true");
        el.tabIndex = -1;
        // 16px avoids iOS zooming in; kept on screen but invisible so iOS agrees to focus it
        el.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;border:0;padding:0";
        document.body.appendChild(el);
      }
      el.focus();
      // In case the next screen has no amount field, don't leave it around
      setTimeout(() => document.getElementById(PRIMER_ID)?.remove(), 4000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
