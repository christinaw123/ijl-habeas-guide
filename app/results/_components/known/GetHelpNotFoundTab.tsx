"use client";

import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function GetHelpNotFoundTab() {
  const { t } = useLanguage();
  const outlineBtn =
    "inline-flex items-center gap-2 h-9 px-3 text-[14px] font-proxima font-medium rounded-md border border-(--ijl-border) text-foreground bg-white hover:bg-(--ijl-cta-bg) transition-colors";
  return (
    <div className="space-y-6">
      <h2 className="oswald text-[24px] font-medium text-(--ijl-title)">
        {t("resultsKnown.help.heading")}
      </h2>

      <p className="font-proxima text-[16px] text-foreground">
        {t("resultsKnown.help.notFound.intro")}
      </p>

      <div className="space-y-3">
        <h3 className="font-proxima font-bold text-[18px] text-foreground">
          {t("resultsKnown.help.notFound.legal.heading")}
        </h3>
        <p className="font-proxima text-[16px] text-foreground">
          {t("resultsKnown.help.notFound.legal.desc")}
        </p>
        <a
          href="https://www.immi.org/en/"
          target="_blank"
          rel="noopener noreferrer"
          className={outlineBtn}
        >
          {t("resultsKnown.help.notFound.legal.cta")}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-3">
        <h3 className="font-proxima font-bold text-[18px] text-foreground">
          {t("resultsKnown.help.notFound.community.heading")}
        </h3>
        <p className="font-proxima text-[16px] text-foreground">
          {t("resultsKnown.help.notFound.community.desc")}
        </p>
        <a
          href="https://www.mutualaidhub.org/"
          target="_blank"
          rel="noopener noreferrer"
          className={outlineBtn}
        >
          {t("resultsKnown.help.notFound.community.cta")}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="border border-(--ijl-border) rounded-lg bg-white p-6 shadow-sm space-y-3">
        <h3 className="font-proxima font-bold text-[18px] text-foreground">
          {t("resultsKnown.help.notFound.list.heading")}
        </h3>
        <p className="font-proxima text-[16px] text-foreground">
          {t("resultsKnown.help.notFound.list.desc")}
        </p>
        <a href="#" className={outlineBtn}>
          {t("resultsKnown.help.notFound.list.cta")}
        </a>
      </div>
    </div>
  );
}
