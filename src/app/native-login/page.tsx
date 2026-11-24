"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

/**
 * Opened by the iOS app in Safari (Google refuses sign-in inside app web views).
 * Signs in here, then /api/native/finish hands the session back to the app.
 */
export default function NativeLogin() {
  const [err, setErr] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const provider = q.get("provider");
    const next = q.get("next") ?? "/home";
    if (provider !== "google" && provider !== "apple" && provider !== "line") return setErr("Unknown sign-in");
    authClient.signIn.social({ provider, callbackURL: `/api/native/finish?next=${encodeURIComponent(next)}` }).then((r) => r?.error && setErr(r.error.message ?? "Error"));
  }, []);
  return <main className="flex min-h-dvh items-center justify-center p-6 text-center text-xl text-muted">{err || "…"}</main>;
}
