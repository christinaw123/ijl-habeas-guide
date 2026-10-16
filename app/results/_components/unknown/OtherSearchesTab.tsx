"use client";

import { ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Tab } from "@/app/results/_lib/types";

export default function OtherSearchesTab({
  onNavigate,
}: {
  onNavigate: (tab: Tab) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <h2 className="oswald font-medium text-[24px] ijl-title-color">
        {t("resultsUnknown.otherSearches.heading")}
      </h2>
      <p className="font-[var(--font-proxima)] text-[18px] text-[var(--foreground)]">
        {t("resultsUnknown.otherSearches.intro")}
      </p>

      {/* Card: VINE */}
      <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-4">
        <div>
          <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
            {t("resultsUnknown.otherSearches.vine.heading")}
          </h3>
          <p className="font-[var(--font-proxima)] text-[14px] text-[var(--ijl-muted)]">
            {t("resultsUnknown.otherSearches.vine.sub")}
          </p>
        </div>
        <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
          {t("resultsUnknown.otherSearches.vine.intro")}
        </p>

        <div className="space-y-6">
          {/* VINELink */}
          <div className="space-y-3">
            <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              <ExternalLink className="inline w-4 h-4 mr-1 -mt-0.5" />
              <span className="font-bold">VINELink</span>{" "}
              {t("resultsUnknown.otherSearches.vinelink.desc")}
            </p>
            <ul className="list-disc pl-5 space-y-1 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              <li>
                <span className="font-bold">
                  {t("resultsUnknown.otherSearches.vinelink.need1")}
                </span>
              </li>
            </ul>
            <p className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)] pl-5">
              {t("resultsUnknown.searchIce.gather.or")}
            </p>
            <ul className="list-disc pl-5 space-y-1 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              <li>{t("resultsUnknown.otherSearches.vinelink.need2")}</li>
            </ul>
            <Button size="lg" asChild>
              <a
                href="https://www.vinelink.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("resultsUnknown.otherSearches.vinelink.cta")}
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* DHS VINELink */}
          <div className="space-y-3">
            <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              <ExternalLink className="inline w-4 h-4 mr-1 -mt-0.5" />
              <span className="font-bold">DHS VINELink</span>{" "}
              {t("resultsUnknown.otherSearches.dhsVinelink.desc")}
            </p>
            <ul className="list-disc pl-5 space-y-1 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              <li>
                <span className="font-bold">
                  {t("resultsUnknown.otherSearches.dhsVinelink.need1")}
                </span>
              </li>
            </ul>
            <p className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)] pl-5">
              {t("resultsUnknown.searchIce.gather.or")}
            </p>
            <ul className="list-disc pl-5 space-y-1 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              <li>{t("resultsUnknown.otherSearches.dhsVinelink.need2a")}</li>
              <li>{t("resultsUnknown.otherSearches.dhsVinelink.need2b")}</li>
              <li>{t("resultsUnknown.otherSearches.dhsVinelink.need2c")}</li>
            </ul>
            <Button size="lg" asChild>
              <a
                href="https://www.vinelink.com/vinelink-dhs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("resultsUnknown.otherSearches.dhsVinelink.cta")}
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Card: EOIR ACIS */}
      <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-4">
        <div>
          <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
            {t("resultsUnknown.otherSearches.eoir.heading")}
          </h3>
          <p className="font-[var(--font-proxima)] text-[14px] text-[var(--ijl-muted)]">
            {t("resultsUnknown.otherSearches.eoir.sub")}
          </p>
        </div>
        <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
          {t("resultsUnknown.otherSearches.eoir.intro")}
        </p>
        <ul className="list-disc pl-5 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
          <li>
            <span className="font-bold">
              {t("resultsUnknown.otherSearches.eoir.need1")}
            </span>
          </li>
        </ul>
        <Button size="lg" asChild>
          <a
            href="https://acis.eoir.justice.gov/en/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("resultsUnknown.otherSearches.eoir.cta")}
            <ExternalLink className="w-4 h-4" />
          </a>
        </Button>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" onClick={() => onNavigate("search-ice")}>
          <ArrowLeft className="w-4 h-4" />
          {t("resultsUnknown.nav.back")}
        </Button>
        <Button onClick={() => onNavigate("call-facilities")}>
          {t("resultsUnknown.tabs.callFacilities")}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
