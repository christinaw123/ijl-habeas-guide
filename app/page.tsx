"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export default function HomePage() {
  const { reset } = useFlowState();
  const { t } = useLanguage();

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="bg-[#F8FAFC]">
      <div className="px-4 py-8">
        <div className="mx-auto flex flex-col gap-8 max-w-160">
          {/* Title + description */}
          <section className="flex flex-col gap-4">
            <h1 className="oswald font-medium text-[24px] leading-8 text-[#0F172B]">
              {t("home.title")}
            </h1>

            <p className="font-proxima font-normal text-[16px] leading-6 tracking-[-0.3125px] text-[#0F172B]">
              {t("home.description")}
            </p>
          </section>

          {/* Card */}
          <section className="flex justify-center">
            <div className="bg-white rounded-[10px] border border-[#E2E8F0] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] px-8.25 py-8.25 w-full max-w-120 flex flex-col items-center gap-3">
              <h2 className="oswald font-medium text-[20px] leading-7 text-[#0F172B] text-center">
                {t("home.card.title")}
              </h2>

              <Button asChild className="w-full max-w-68.5">
                <Link href={ROUTES.arrest}>{t("home.card.cta")}</Link>
              </Button>

              <p className="font-proxima text-[12px] text-center text-[#45556C] mt-2">
                {t("home.card.disclaimer")}
              </p>
            </div>
          </section>

          {/* About This Tool */}
          <section className="flex flex-col gap-8 pb-4">
            <div className="flex flex-col gap-2">
              <h3 className="oswald font-medium text-[18px] leading-6.5 text-[#0F172B]">
                {t("home.about.title")}
              </h3>
              <div className="font-proxima font-normal text-[14px] leading-5 text-[#0F172B] flex flex-col gap-3">
                <p>{t("home.about.p1")}</p>
                <p>{t("home.about.p2")}</p>
                <Button asChild variant="outline" size="sm" className="w-fit mt-1">
                  <a
                    href="https://www.immigrantjusticelab.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("home.about.cta")}
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
