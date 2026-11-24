"use client";
import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { addDevice, removeDevice, saveNotify } from "@/app/actions";
import { useT } from "./i18n";

type Settings = { notify_low: boolean; low_threshold: number; notify_expense: boolean; notify_cash: boolean };
type DeviceState = "loading" | "off" | "on" | "blocked" | "needs-install" | "unsupported";

type PushPlugin = {
  requestPermissions(): Promise<{ receive: string }>;
  checkPermissions(): Promise<{ receive: string }>;
  register(): Promise<void>;
  addListener(event: string, cb: (v: { value: string }) => void): Promise<{ remove(): void }>;
};
/** The iOS app opens this site inside Capacitor, which puts its native plugins on window. */
function nativePush(): PushPlugin | null {
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean; Plugins?: { PushNotifications?: PushPlugin } } }).Capacitor;
  return cap?.isNativePlatform?.() ? (cap.Plugins?.PushNotifications ?? null) : null;
}

function urlB64ToBytes(b64: string) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-8 w-14 shrink-0 rounded-full transition ${on ? "bg-accent" : "bg-sunk [box-shadow:inset_0_0_0_1px_var(--line)]"}`}
    >
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${on ? "left-7" : "left-1"}`} />
    </button>
  );
}

export function NotifySettings({ initial, vapidKey }: { initial: Settings; vapidKey: string }) {
  const t = useT();
  const [s, setS] = useState(initial);
  const [device, setDevice] = useState<DeviceState>("loading");
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Find out whether this phone or browser already gets notifications
  useEffect(() => {
    (async () => {
      const native = nativePush();
      if (native) {
        const p = await native.checkPermissions();
        setDevice(p.receive === "granted" ? "on" : p.receive === "denied" ? "blocked" : "off");
        if (p.receive === "granted") void registerNative(native); // refresh the token
        return;
      }
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !vapidKey) {
        const ios = /iPhone|iPad/.test(navigator.userAgent);
        setDevice(ios ? "needs-install" : "unsupported");
        return;
      }
      if (Notification.permission === "denied") return setDevice("blocked");
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const sub = await reg?.pushManager.getSubscription();
      setDevice(sub ? "on" : "off");
    })().catch(() => setDevice("unsupported"));
  }, [vapidKey]);

  async function registerNative(native: PushPlugin) {
    const l = await native.addListener("registration", (tok) => {
      void addDevice({ kind: "apns", token: tok.value });
      l.remove();
    });
    await native.register();
  }

  async function turnOn() {
    setBusy(true);
    try {
      const native = nativePush();
      if (native) {
        const p = await native.requestPermissions();
        if (p.receive !== "granted") return setDevice("blocked");
        await registerNative(native);
        return setDevice("on");
      }
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return setDevice(perm === "denied" ? "blocked" : "off");
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToBytes(vapidKey) });
      const j = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      await addDevice({ kind: "web", endpoint: j.endpoint, keys: j.keys });
      setDevice("on");
    } catch {
      setDevice("unsupported");
    } finally {
      setBusy(false);
    }
  }

  async function turnOff() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/sw.js");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await removeDevice(sub.endpoint);
        await sub.unsubscribe();
      }
      setDevice("off");
    } finally {
      setBusy(false);
    }
  }

  function update(next: Settings, delay = 0) {
    setS(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void saveNotify(next), delay);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl bg-sunk p-3">
        <span className={`badge h-10 w-10 rounded-full bg-card ${device === "on" ? "tone-cash" : "tone-other"}`}>
          {device === "on" ? <BellRing size={20} /> : device === "blocked" ? <BellOff size={20} /> : <Bell size={20} />}
        </span>
        <p className="min-w-0 flex-1 text-base font-semibold leading-snug">
          {device === "on" && t("notifyOn")}
          {device === "off" && t("notifyOff")}
          {device === "blocked" && t("notifyBlocked")}
          {device === "needs-install" && t("notifyInstall")}
          {device === "unsupported" && t("notifyUnsupported")}
          {device === "loading" && "…"}
        </p>
        {device === "off" && (
          <button type="button" disabled={busy} onClick={turnOn} className="shrink-0 rounded-full bg-accent px-4 py-2 text-base font-bold text-on-accent">
            {t("turnOn")}
          </button>
        )}
        {device === "on" && !nativePush() && (
          <button type="button" disabled={busy} onClick={turnOff} className="shrink-0 rounded-full px-3 py-2 text-base font-semibold text-muted">
            {t("turnOff")}
          </button>
        )}
      </div>

      <div className="rounded-2xl px-1 py-2">
        <div className="flex items-center gap-3">
          <span className="flex-1 text-lg font-semibold leading-snug">{t("notifyLow")}</span>
          <Switch label={t("notifyLow")} on={s.notify_low} onChange={(v) => update({ ...s, notify_low: v })} />
        </div>
        {s.notify_low && (
          <div className="mt-2 flex items-center gap-2 rounded-2xl bg-sunk px-4 focus-within:ring-2 focus-within:ring-accent">
            <span className="shrink-0 whitespace-nowrap text-lg font-semibold text-muted">{t("below")} $</span>
            <input
              inputMode="numeric"
              aria-label={t("notifyLow")}
              value={s.low_threshold ? String(s.low_threshold) : ""}
              onChange={(e) => update({ ...s, low_threshold: Number(e.target.value.replace(/\D/g, "")) || 0 }, 600)}
              className="tabular w-full bg-transparent py-3 text-xl font-bold outline-none"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 px-1 py-2">
        <span className="flex-1 text-lg font-semibold leading-snug">{t("notifyExpense")}</span>
        <Switch label={t("notifyExpense")} on={s.notify_expense} onChange={(v) => update({ ...s, notify_expense: v })} />
      </div>
      <div className="flex items-center gap-3 px-1 py-2">
        <span className="flex-1 text-lg font-semibold leading-snug">{t("notifyCash")}</span>
        <Switch label={t("notifyCash")} on={s.notify_cash} onChange={(v) => update({ ...s, notify_cash: v })} />
      </div>
    </div>
  );
}

/** In the iOS app, tapping a notification opens the page it points to. */
export function PushOpen() {
  useEffect(() => {
    const native = nativePush();
    if (!native) return;
    const sub = native.addListener("pushNotificationActionPerformed", ((e: { notification?: { data?: { url?: string } } }) => {
      const url = e.notification?.data?.url;
      if (url?.startsWith("/")) window.location.href = url;
    }) as never);
    return () => void sub.then((s) => s.remove());
  }, []);
  return null;
}
