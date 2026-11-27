"use client";

import { useState } from "react";
import { Link2, Share2 } from "lucide-react";

/**
 * "Send this to your siblings": the guide is written to be forwarded, mostly over LINE.
 * The phone's share sheet when there is one, plus LINE, Threads and copy-link buttons.
 */
export function ShareArticle({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = `${title}\n${url}`;
  const base = "flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-base font-bold [box-shadow:var(--shadow)]";
  const btn = `${base} bg-card`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // cancelled: fall through to copy
      }
    }
    copy();
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("複製這個連結", url);
    }
  }

  return (
    <section className="mt-12 space-y-3">
      <p className="text-lg font-bold">覺得有用？傳給一起照顧爸媽的家人</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button type="button" onClick={share} className={`${base} col-span-2 bg-accent text-on-accent sm:col-span-1`}>
          <Share2 size={18} /> 分享
        </button>
        <a className={btn} href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener">
          LINE
        </a>
        <a className={btn} href={`https://www.threads.net/intent/post?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener">
          Threads
        </a>
        <button type="button" onClick={copy} className={`${btn} col-span-2 sm:col-span-1`}>
          <Link2 size={18} /> {copied ? "已複製！" : "複製連結"}
        </button>
      </div>
    </section>
  );
}
