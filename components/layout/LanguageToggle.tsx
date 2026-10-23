"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useLanguage, type Lang } from "@/lib/i18n/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
    <Select
      value={lang}
      onValueChange={(v) => setLang(v as Lang)}
      disabled={loading}
    >
      <SelectTrigger
        aria-label={t("toggle.label")}
        // The 24px icon box has 6px of empty space around the chevron on each
        // side; negative margins trim it so the padding matches the design.
        icon={<ChevronDown className="-mx-1.5 -my-2.25 h-6 w-6 text-(--ijl-accent)" strokeWidth={1.5} />}
        className={cn(
          "h-auto w-auto gap-2.75 rounded-full border-0 py-1.5 pl-2 pr-4 hover:bg-(--ijl-cta-bg)",
          "text-[14px] leading-5.5 text-(--ijl-light-blue-800)",
          "focus:ring-offset-0 data-[state=open]:bg-(--ijl-cta-bg)",
          loading && "animate-pulse",
        )}
      >
        <span className="flex items-center gap-2.25">
          <Globe className="h-4 w-4 text-(--ijl-accent)" />
          <SelectValue />
        </span>
      </SelectTrigger>

      <SelectContent align="end" className="w-auto min-w-(--radix-select-trigger-width)">
        {LANGS.map((l) => (
          // lang lets screen readers pronounce each name in its own language
          <SelectItem key={l.value} value={l.value} lang={l.value} className="py-2 text-[14px] leading-5">
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
