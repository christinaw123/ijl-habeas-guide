"use client";

import { createContext, useContext } from "react";
import { STRINGS } from "./strings";

export type Lang = "en" | "es" | "ar" | "ht" | "vi" | "pt" | "zh-CN";

/** Languages written right-to-left; the whole layout mirrors for these. */
const RTL_LANGS: ReadonlySet<Lang> = new Set<Lang>(["ar"]);

export function dirFor(lang: Lang): "ltr" | "rtl" {
  return RTL_LANGS.has(lang) ? "rtl" : "ltr";
}

export interface LanguageContextValue {
  lang: Lang;
  /** Text direction for `lang`; mirrors `<html dir>`. */
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  loading: boolean;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  dir: "ltr",
  setLang: () => {},
  t: (key) => STRINGS[key] ?? key,
  loading: false,
});

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
