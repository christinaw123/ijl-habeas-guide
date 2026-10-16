"use client";

import { useCallback, useEffect, useState } from "react";
import { LanguageContext, type Lang } from "@/lib/i18n/LanguageContext";
import { STRINGS } from "@/lib/i18n/strings";

type Translations = Record<string, string>;
type CacheEntry = { t: Translations; v: string };

const LANG_STORAGE_KEY = "ijl_lang";

function cacheKey(lang: string) {
  return `ijl_translations_${lang}`;
}

// Lightweight checksum of all English source string values. Changes whenever
// any source text is edited, busting cached translations for that build.
function stringsChecksum(): string {
  let h = 0;
  for (const v of Object.values(STRINGS)) {
    for (let i = 0; i < v.length; i++) {
      h = (Math.imul(31, h) + v.charCodeAt(i)) | 0;
    }
  }
  return h.toString(36);
}

async function fetchTranslations(targetLang: string): Promise<Translations> {
  const res = await fetch(`/locales/${targetLang}.json`);
  if (!res.ok) throw new Error(`Failed to load translations for ${targetLang}`);
  return res.json();
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>("en");
  const [translations, setTranslations] = useState<Translations>(STRINGS);
  const [loading, setLoading] = useState(false);

  // fromStorage=true when restoring a saved preference on mount: a persistent
  // failure (locale file never deployed) should clear the preference rather than
  // retrying on every page load. For user-triggered switches, keep the
  // preference so a transient failure doesn't permanently erase it.
  const applyLang = useCallback(async (target: Lang, { fromStorage = false }: { fromStorage?: boolean } = {}) => {
    if (target === "en") {
      setLangState("en");
      setTranslations(STRINGS);
      localStorage.setItem(LANG_STORAGE_KEY, "en");
      return;
    }

    const checksum = stringsChecksum();

    // Check localStorage cache first
    const cached = localStorage.getItem(cacheKey(target));
    if (cached) {
      try {
        const entry: CacheEntry = JSON.parse(cached);
        const allKeysPresent = Object.keys(STRINGS).every((k) => k in entry.t);
        if (allKeysPresent && entry.v === checksum) {
          setLangState(target);
          setTranslations(entry.t);
          localStorage.setItem(LANG_STORAGE_KEY, target);
          return;
        }
        // Cache is stale (missing keys or source strings changed) — re-fetch
        localStorage.removeItem(cacheKey(target));
      } catch {
        // Cache corrupted or old format — fall through to fetch
      }
    }

    setLoading(true);
    try {
      const fetched = await fetchTranslations(target);
      localStorage.setItem(cacheKey(target), JSON.stringify({ t: fetched, v: checksum } satisfies CacheEntry));
      setLangState(target);
      setTranslations(fetched);
      localStorage.setItem(LANG_STORAGE_KEY, target);
    } catch {
      // Locale file missing or network failure — reset the UI to English so the
      // dropdown doesn't show a language while content is still in English.
      setLangState("en");
      setTranslations(STRINGS);
      if (fromStorage) {
        // Clear the stored preference to avoid retrying on every page load when
        // the locale file is persistently missing.
        localStorage.setItem(LANG_STORAGE_KEY, "en");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Rehydrate persisted language on mount
  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
    if (saved && saved !== "en") {
      applyLang(saved, { fromStorage: true });
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
