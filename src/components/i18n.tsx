"use client";
import { createContext, useContext } from "react";
import { translate, type Key, type Lang } from "@/lib/i18n";

const Ctx = createContext<Lang>("zh-TW");

export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}

export function useT() {
  const lang = useContext(Ctx);
  return (key: Key, vars?: Record<string, string | number>) => translate(lang, key, vars);
}
