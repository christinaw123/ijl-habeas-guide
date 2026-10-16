"use client";

import { ExternalLink, ArrowRight, AlertCircle, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Tab } from "./types";

export default function SearchIceTab({
  onANumberClick,
  onNavigate,
}: {
  onANumberClick: () => void;
  onNavigate: (tab: Tab) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <h2 className="oswald font-medium text-[24px] ijl-title-color">
        {t("resultsUnknown.searchIce.heading")}
      </h2>
      <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
        {t("resultsUnknown.searchIce.intro")}
      </p>

      {/* Card: Gather info */}
      <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-4">
        <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
          {t("resultsUnknown.searchIce.gather.heading")}
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CircleCheck className="w-5 h-5 text-[var(--ijl-accent)] mt-0.5 flex-shrink-0" />
            <span className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              {t("resultsUnknown.searchIce.gather.anumber")}{" "}
              <button
                onClick={onANumberClick}
                className="text-[var(--ijl-accent)] underline text-[14px]"
              >
                {t("resultsUnknown.searchIce.gather.anumberLink")}
              </button>
            </span>
          </div>
          <p className="font-[var(--font-proxima)] text-[14px] text-[var(--ijl-muted)] pl-8">
            {t("resultsUnknown.searchIce.gather.or")}
          </p>
          <div className="flex items-start gap-3">
            <CircleCheck className="w-5 h-5 text-[var(--ijl-accent)] mt-0.5 flex-shrink-0" />
            <span className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              {t("resultsUnknown.searchIce.gather.name")}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <CircleCheck className="w-5 h-5 text-[var(--ijl-accent)] mt-0.5 flex-shrink-0" />
            <span className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              {t("resultsUnknown.searchIce.gather.dob")}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <CircleCheck className="w-5 h-5 text-[var(--ijl-accent)] mt-0.5 flex-shrink-0" />
            <span className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              {t("resultsUnknown.searchIce.gather.country")}
            </span>
          </div>
        </div>
      </div>

      {/* Card: Search the locator */}
      <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-4">
        <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
          {t("resultsUnknown.searchIce.locator.heading")}
        </h3>
        <div className="space-y-2">
          <h4 className="font-[var(--font-proxima)] font-bold text-base text-[var(--foreground)] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[var(--ijl-accent)]" />
            {t("resultsUnknown.searchIce.tips.label")}
          </h4>
          <ul className="list-disc pl-5 space-y-2 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
            <li>{t("resultsUnknown.searchIce.tips.1")}</li>
            <li>{t("resultsUnknown.searchIce.tips.2")}</li>
            <li>{t("resultsUnknown.searchIce.tips.3")}</li>
          </ul>
        </div>
        <Button size="lg" asChild>
          <a
            href="https://locator.ice.gov/odls/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("resultsUnknown.searchIce.cta")}
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-end pt-2">
        <Button variant="outline" onClick={() => onNavigate("other-searches")}>
          {t("resultsUnknown.searchIce.next")}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
