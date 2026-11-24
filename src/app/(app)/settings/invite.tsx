"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { Copy, Plus } from "lucide-react";
import { createInvite } from "../../actions";
import { useT } from "@/components/i18n";

/** With `auto`, a link for that role is made as soon as the page opens (from the home screen's invite buttons). */
export function InvitePanel({ auto }: { auto?: "admin" | "caretaker" }) {
  const t = useT();
  const [link, setLink] = useState<{ url: string; role: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  const make = (role: "admin" | "caretaker") =>
    start(async () => {
      const code = await createInvite(role);
      setLink({ url: `${window.location.origin}/join/${code}`, role });
      setCopied(false);
    });

  const started = useRef(false);
  useEffect(() => {
    if (auto && !started.current) {
      started.current = true;
      make(auto);
      document.getElementById("invite")?.scrollIntoView({ block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  const msg = link ? `${t("inviteMessage")} ${link.url}` : "";

  return (
    <div id="invite" className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button type="button" className="btn-primary" disabled={pending} onClick={() => make("caretaker")}>
          <Plus size={22} /> {t("inviteCaretaker")}
        </button>
        <button type="button" className="btn-tint" disabled={pending} onClick={() => make("admin")}>
          <Plus size={22} /> {t("inviteAdmin")}
        </button>
      </div>
      {link && (
        <div className="space-y-3 rounded-3xl bg-accent-soft p-4">
          <p className="text-base font-semibold">
            {link.role === "caretaker" ? t("roleCaretaker") : t("roleAdmin")} · {t("inviteHint")}
          </p>
          <p className="break-all rounded-xl bg-card p-3 font-mono text-base">{link.url}</p>
          <a className="btn text-white" style={{ background: "#128C4B" }} href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer">
            {t("sendWhatsApp")}
          </a>
          <a className="btn text-white" style={{ background: "#06C755" }} href={`https://line.me/R/share?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer">
            {t("sendLine")}
          </a>
          <button
            type="button"
            className="btn-soft"
            onClick={async () => {
              try {
                if (navigator.share) await navigator.share({ text: msg });
                else {
                  await navigator.clipboard.writeText(link.url);
                  setCopied(true);
                }
              } catch {
                /* user closed the share sheet */
              }
            }}
          >
            {copied ? t("copied") : <><Copy size={20} /> {t("copyLink")}</>}
          </button>
        </div>
      )}
    </div>
  );
}
