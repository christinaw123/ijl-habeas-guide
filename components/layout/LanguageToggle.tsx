"use client";

import { Globe } from "lucide-react";
import { useLanguage, type Lang } from "@/lib/i18n/LanguageContext";

const LANGS: { label: string; value: Lang }[] = [
  { label: "English",        value: "en"    },
  { label: "Español",        value: "es"    },
  { label: "العربية",        value: "ar"    },
  { label: "Kreyòl Ayisyen", value: "ht"    },
  { label: "Tiếng Việt",     value: "vi"    },
  { label: "Português",      value: "pt"    },
  { label: "中文",            value: "zh-CN" },
];

export default function LanguageToggle() {
  const { lang, setLang, loading, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-[#6B6B6B]" />
      <label className="sr-only" htmlFor="lang">
        {t("toggle.label")}
      </label>
      <select
        id="lang"
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        disabled={loading}
        className={[
          "cursor-pointer rounded-md border border-[var(--ijl-border)] bg-white px-2 py-1 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ijl-accent)] transition-opacity",
          loading ? "opacity-50 cursor-not-allowed animate-pulse" : "",
        ].join(" ")}
      >
        {LANGS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
