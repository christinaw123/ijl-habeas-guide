"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HomePage() {
  const { reset } = useFlowState();
  const { t } = useLanguage();

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="bg-[#F8FAFC]">
      <main className="px-4 py-8 md:py-16">
        <div className="mx-auto flex flex-col gap-8 max-w-[640px]">
          {/* Title + description */}
          <section className="flex flex-col gap-4">
            <h1 className="oswald font-regular text-[32px] leading-[42px] text-[#0F172B]">
              {t("home.title")}
            </h1>

            <p className="font-[var(--font-proxima)] font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-[#45556C]">
              {t("home.description")}
            </p>
          </section>

          {/* Card */}
          <section className="flex justify-center">
            <div className="bg-white rounded-[10px] border border-[#E2E8F0] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] px-6 py-8 w-full flex flex-col items-center gap-3">
              <h2 className="oswald font-medium text-[24px] leading-[28px] text-[#0F172B] text-center">
                {t("home.card.title")}
              </h2>

              <p className="font-[var(--font-proxima)] font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-[#45556C] text-center max-w-[420px]">
                {t("home.card.description")}
              </p>

              <Link
                href="/detainee/step-1"
                className="mt-2 bg-[#030213] text-white rounded-[12px] h-[40px] w-full max-w-[274px] flex items-center justify-center font-[var(--font-proxima)] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] hover:bg-[#0A0A1A] transition-colors"
              >
                {t("home.card.cta")}
              </Link>
            </div>
          </section>

          {/* Privacy + scams section */}
          <section className="mt-4 flex flex-col gap-8 pb-8">
            {/* Your Privacy */}
            <div className="flex flex-col gap-2">
              <h3 className="oswald font-medium text-[18px] leading-[26px] text-[#0F172B]">
                {t("home.privacy.title")}
              </h3>
              <p className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                {t("home.privacy.description")}
              </p>
            </div>

            <hr className="border-t border-[#E2E8F0]" />

            {/* Stay Safe From Scams */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="oswald font-medium text-[18px] leading-[26px] text-[#0F172B]">
                  {t("home.scams.title")}
                </h3>
                <p className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                  {t("home.scams.description")}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="oswald font-medium text-[16px] leading-[24px] text-[#0F172B]">
                  {t("home.scams.protect.title")}
                </h4>
                <ul className="list-disc pl-5 flex flex-col gap-2">
                  <li className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                    <span className="font-bold">
                      {t("home.scams.protect.safe.label")}
                    </span>{" "}
                    {t("home.scams.protect.safe.text")}
                  </li>
                  <li className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                    <span className="font-bold">
                      {t("home.scams.protect.scams.label")}
                    </span>{" "}
                    {t("home.scams.protect.scams.text")}
                  </li>
                  <li className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                    <span className="font-bold">
                      {t("home.scams.protect.money.label")}
                    </span>{" "}
                    {t("home.scams.protect.money.text")}
                  </li>
                  <li className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                    <span className="font-bold">
                      {t("home.scams.protect.sign.label")}
                    </span>{" "}
                    {t("home.scams.protect.sign.text")}
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
