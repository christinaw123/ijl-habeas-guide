"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ROUTES } from "@/lib/routes";
import type { Tab } from "@/app/results/_lib/types";

export default function IfFoundTab({
  onNavigate,
}: {
  onNavigate: (tab: Tab) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <h2 className="oswald font-medium text-[24px] ijl-title-color">
        {t("resultsUnknown.ifFound.heading")}
      </h2>
      <p className="font-proxima text-[18px] text-foreground">
        {t("resultsUnknown.ifFound.intro")}
      </p>

      {/* Steps card */}
      <div className="border border-(--ijl-border) rounded-[10px] bg-white shadow-sm p-6 space-y-4">
        {/* Step 1 */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full bg-[#E6E7E8] flex items-center justify-center">
            <span className="font-proxima font-medium text-foreground text-[14px]">
              1
            </span>
          </div>
          <p className="font-proxima text-base text-foreground pt-1">
            {t("resultsUnknown.ifFound.step1")}
          </p>
        </div>
        {/* Step 2 */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full bg-[#E6E7E8] flex items-center justify-center">
            <span className="font-proxima font-medium text-foreground text-[14px]">
              2
            </span>
          </div>
          <p className="font-proxima text-base text-foreground pt-1">
            {t("resultsUnknown.ifFound.step2")}
          </p>
        </div>
        {/* Step 3 — contains inline link */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-8 h-8 rounded-full bg-[#E6E7E8] flex items-center justify-center">
            <span className="font-proxima font-medium text-foreground text-[14px]">
              3
            </span>
          </div>
          <p className="font-proxima text-base text-foreground pt-1">
            <Link
              href={ROUTES.facility}
              className="text-(--ijl-accent) underline font-medium"
            >
              {t("resultsUnknown.ifFound.step3.link")}
            </Link>{" "}
            {t("resultsUnknown.ifFound.step3.suffix")}
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" onClick={() => onNavigate("call-facilities")}>
          <ArrowLeft className="w-4 h-4" />
          {t("resultsUnknown.nav.back")}
        </Button>
        <Button onClick={() => onNavigate("get-help")}>
          {t("resultsUnknown.ifFound.next")}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
