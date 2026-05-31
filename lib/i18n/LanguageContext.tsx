"use client";

import { createContext, useContext } from "react";
import { STRINGS } from "./strings";

export type Lang = "en" | "es" | "ar" | "ht" | "vi" | "pt" | "zh-CN";

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  loading: boolean;
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => STRINGS[key] ?? key,
  loading: false,
});

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
