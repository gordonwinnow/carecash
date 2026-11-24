"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
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

export function BottomNav({ showMore }: { showMore: boolean }) {
  const t = useT();
  const path = usePathname();
  const items = [
    { href: "/home", icon: "🏠", label: t("navHome") },
    { href: "/history", icon: "🧾", label: t("navHistory") },
    ...(showMore ? [{ href: "/more", icon: "🔒", label: t("navMore") }] : []),
    { href: "/settings", icon: "⚙️", label: t("navSettings") },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-xl">
        {items.map((i) => {
          const active = path.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-sm font-semibold ${active ? "text-accent" : "text-muted"}`}
            >
              <span className={`text-2xl ${active ? "" : "opacity-70 grayscale"}`}>{i.icon}</span>
              <span className="leading-tight text-center">{i.label}</span>
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
      <button type="button" onClick={() => setOpen(true)} className="shrink-0 overflow-hidden rounded-xl border border-line" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/api/photo/${name}`} alt="" loading="lazy" className="h-full w-full object-cover" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/photo/${name}`} alt="" className="max-h-full max-w-full rounded-xl" />
          <button className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] rounded-full bg-white/90 px-5 py-3 text-xl font-bold text-black">✕</button>
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

export function PhotoInput({ big = true, label }: { big?: boolean; label: string }) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="max-h-72 w-full rounded-2xl object-cover" />
          <button type="button" onClick={() => fileRef.current?.click()} className="absolute bottom-3 right-3 rounded-xl bg-black/70 px-4 py-2 font-bold text-white">
            📷 {t("retake")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-accent bg-accent-soft font-bold text-ink ${big ? "h-44 text-2xl" : "h-24 text-lg"}`}
        >
          <span className={big ? "text-5xl" : "text-3xl"}>📷</span>
          {label}
        </button>
      )}
    </div>
  );
}

export function AmountInput({ quick, autoFocus }: { quick?: number[]; autoFocus?: boolean }) {
  const t = useT();
  const [v, setV] = useState("");
  return (
    <div>
      <label className="label">{t("amount")}</label>
      <div className="flex items-center rounded-2xl border-2 border-line bg-card px-4 focus-within:border-accent">
        <span className="text-2xl font-bold text-muted">NT$</span>
        <input
          name="amount"
          required
          inputMode="numeric"
          pattern="[0-9,]*"
          autoComplete="off"
          autoFocus={autoFocus}
          value={v}
          onChange={(e) => setV(e.target.value.replace(/[^\d]/g, ""))}
          placeholder="0"
          className="w-full bg-transparent px-3 py-4 text-4xl font-bold outline-none"
          aria-label={t("amount")}
        />
      </div>
      {quick && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {quick.map((q) => (
            <button key={q} type="button" className="chip" aria-pressed={v === String(q)} onClick={() => setV(String(q))}>
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
}: {
  name: string;
  options: { value: string; label: string; icon?: string }[];
  initial?: string;
  cols?: number;
}) {
  const [v, setV] = useState(initial ?? options[0]?.value ?? "");
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      <input type="hidden" name={name} value={v} />
      {options.map((o) => (
        <button key={o.value} type="button" className="chip flex-col !gap-0 py-2 text-base" aria-pressed={v === o.value} onClick={() => setV(o.value)}>
          {o.icon && <span className="text-2xl">{o.icon}</span>}
          <span className="leading-tight">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function BackHeader({ title, href = "/home" }: { title: string; href?: string }) {
  return (
    <header className="mb-4 flex items-center gap-3">
      <Link href={href} className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-line bg-card text-2xl" aria-label="Back">
        ←
      </Link>
      <h1 className="text-2xl font-extrabold">{title}</h1>
    </header>
  );
}
