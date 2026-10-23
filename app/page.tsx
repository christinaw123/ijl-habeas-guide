"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ROUTES } from "@/lib/routes";

export default function HomePage() {
  const { reset } = useFlowState();
  const { t } = useLanguage();

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-(image:--ijl-hero-gradient) px-8 pt-8 pb-16 md:pt-16 md:pb-28">
        {/* Decorative swirl, positioned from the page center so it stays put relative to the content on wide screens.
            Figma: 34% group opacity × 75% path opacity. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute opacity-[0.255] bg-(--ijl-swirl) mask-[url(/thread-swirl.svg)] mask-no-repeat mask-size-[100%_100%] left-[calc(50%-344.5px)] top-44.75 w-139 h-83.75 md:left-[calc(50%-766px)] md:top-20.75 md:w-326 md:h-196.75"
        />

        <div className="relative mx-auto max-w-224">
          <p className="mb-6 md:mb-10 inline-block rounded-full border border-(--ijl-input-border) px-5 py-2 oswald font-medium text-[12px] leading-3.75 tracking-[2.5px] uppercase text-(--ijl-light-gold-200)">
            {t("home.badge")}
          </p>

          <h1 className="max-w-192 oswald font-semibold text-white text-[48px] leading-12 tracking-[-0.48px] md:text-[64px] md:leading-16 md:tracking-[-0.72px]">
            {t("home.title")}
          </h1>

          <div className="flex flex-col items-start gap-10 pt-8 md:flex-row md:items-center md:gap-8 md:pt-10">
            <p className="max-w-96 font-proxima text-[18px] leading-6 text-(--ijl-muted-on-dark)">
              {t("home.description")}
            </p>

            <Link
              href={ROUTES.arrest}
              className="shrink-0 rounded-full bg-(--ijl-light-gold-200) hover:bg-(--ijl-gold-hover) active:bg-(--ijl-gold-pressed) transition-colors px-8 py-4 font-proxima font-bold text-[18px] leading-5.5 tracking-[1.3px] text-(--ijl-light-blue-800)"
            >
              {t("home.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* About this site */}
      <section className="px-8 pt-8 pb-12 md:py-16">
        <div className="mx-auto max-w-192 grid gap-8 md:grid-cols-2 md:gap-12 md:items-start">
          <div>
            <h2 className="oswald font-medium text-[24px] leading-8 tracking-[1.2px] uppercase text-(--ijl-light-blue-800)">
              {t("home.about.title")}
            </h2>
            <p className="pt-5 font-proxima text-[14px] leading-5 text-(--ijl-accent)">
              {t("home.about.p1")}
            </p>
          </div>

          <p className="rounded-2xl bg-(--ijl-callout-bg) px-6 py-5 font-proxima text-[14px] leading-5 text-(--ijl-accent)">
            {t("home.privacy")}
          </p>
        </div>
      </section>
    </div>
  );
}
