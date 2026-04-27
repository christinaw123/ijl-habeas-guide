"use client";

import { useCallback, useEffect, useState } from "react";
import { LanguageContext, type Lang } from "@/lib/i18n/LanguageContext";
import { STRINGS } from "@/lib/i18n/strings";

type Translations = Record<string, string>;

const LANG_STORAGE_KEY = "ijl_lang";
const MYMEMORY_BASE = "https://api.mymemory.translated.net/get";

function cacheKey(lang: string) {
  return `ijl_translations_${lang}`;
}

async function fetchTranslations(targetLang: string): Promise<Translations> {
  const entries = Object.entries(STRINGS);
  const results = await Promise.allSettled(
    entries.map(async ([, text]) => {
      const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
      const res = await fetch(url);
      const data = await res.json();
      // MyMemory returns the original text on failure; keep it as fallback
      return (data.responseData?.translatedText as string) || text;
    })
  );

  const translations: Translations = {};
  entries.forEach(([key, fallback], i) => {
    const result = results[i];
    translations[key] =
      result.status === "fulfilled" ? result.value : fallback;
  });
  return translations;
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>("en");
  const [translations, setTranslations] = useState<Translations>(STRINGS);
  const [loading, setLoading] = useState(false);

  const applyLang = useCallback(async (target: Lang) => {
    if (target === "en") {
      setLangState("en");
      setTranslations(STRINGS);
      localStorage.setItem(LANG_STORAGE_KEY, "en");
      return;
    }

    // Check localStorage cache first
    const cached = localStorage.getItem(cacheKey(target));
    if (cached) {
      try {
        const parsed: Translations = JSON.parse(cached);
        // Invalidate if any current string keys are missing (strings were added since last cache)
        const allKeysPresent = Object.keys(STRINGS).every((k) => k in parsed);
        if (allKeysPresent) {
          setLangState(target);
          setTranslations(parsed);
          localStorage.setItem(LANG_STORAGE_KEY, target);
          return;
        }
        // Cache is stale — remove it and fall through to re-fetch
        localStorage.removeItem(cacheKey(target));
      } catch {
        // Cache corrupted — fall through to fetch
      }
    }

    // Fetch from MyMemory
    setLoading(true);
    try {
      const fetched = await fetchTranslations(target);
      localStorage.setItem(cacheKey(target), JSON.stringify(fetched));
      setLangState(target);
      setTranslations(fetched);
      localStorage.setItem(LANG_STORAGE_KEY, target);
    } catch {
      // On network failure, silently stay in current language
    } finally {
      setLoading(false);
    }
  }, []);

  // Rehydrate persisted language on mount
  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
    if (saved && saved !== "en") {
      applyLang(saved);
    }
  }, [applyLang]);

  const t = useCallback(
    (key: string): string => translations[key] ?? STRINGS[key] ?? key,
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang: applyLang, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
}
