"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { reset } = useFlowState();
  const { t } = useLanguage();

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="bg-[#F8FAFC]">
      <main className="px-4 py-8">
        <div className="mx-auto flex flex-col gap-8 max-w-[640px]">
          {/* Title + description */}
          <section className="flex flex-col gap-4">
            <h1 className="oswald font-medium text-[24px] leading-[32px] text-[#0F172B]">
              {t("home.title")}
            </h1>

            <p className="font-[var(--font-proxima)] font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-[#0F172B]">
              {t("home.description")}
            </p>
          </section>

          {/* Card */}
          <section className="flex justify-center">
            <div className="bg-white rounded-[10px] border border-[#E2E8F0] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] px-[33px] py-[33px] w-full max-w-[480px] flex flex-col items-center gap-3">
              <h2 className="oswald font-medium text-[20px] leading-[28px] text-[#0F172B] text-center">
                {t("home.card.title")}
              </h2>

              <Button asChild className="w-full max-w-[274px]">
                <Link href="/detainee/step-1">{t("home.card.cta")}</Link>
              </Button>

              <p className="font-[var(--font-proxima)] text-[12px] text-center text-[#45556C] mt-2">
                {t("home.card.disclaimer")}
              </p>
            </div>
          </section>

          {/* About This Tool */}
          <section className="flex flex-col gap-8 pb-4">
            <div className="flex flex-col gap-2">
              <h3 className="oswald font-medium text-[18px] leading-[26px] text-[#0F172B]">
                {t("home.about.title")}
              </h3>
              <div className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#0F172B] flex flex-col gap-3">
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
      </main>
    </div>
  );
}
