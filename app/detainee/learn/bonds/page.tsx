"use client";

import BackButton from "@/components/BackButton";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ImmigrationBondsPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      <BackButton href="/detainee/results/known" label={t("learn.back")} />

      <div className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl flex flex-col gap-6">
          <h1 className="oswald font-medium text-[24px] leading-[32px] text-[var(--ijl-title)]">
            {t("learn.bonds.title")}
          </h1>

          <div className="font-[var(--font-proxima)] text-[16px] leading-[24px] text-[var(--foreground)] space-y-6">
            <p>{t("learn.bonds.p1")}</p>

            <p>{t("learn.bonds.p2")}</p>

            <p>
              {t("learn.bonds.findHelp.prefix")}{" "}
              <Link
                href="/detainee/results/known"
                className="font-bold underline text-[var(--ijl-accent)] hover:opacity-80"
              >
                {t("learn.bonds.findHelp.link")}
              </Link>
              .
            </p>

            <div className="space-y-4">
              <p>{t("learn.bonds.selfRep.intro")}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="pl-2">
                  <a
                    href="https://www.immigrantjusticelab.org/guides/a-immigration-bonds"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-[var(--ijl-accent)] hover:opacity-80"
                  >
                    {t("learn.bonds.guide.title")}
                  </a>{" "}
                  {t("learn.bonds.guide.desc")}
                </li>
                <li className="pl-2">
                  <a
                    href="https://www.immigrantjusticelab.org/guides/faq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-[var(--ijl-accent)] hover:opacity-80"
                  >
                    {t("learn.bonds.faq.title")}
                  </a>{" "}
                  {t("learn.bonds.faq.desc")}
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <p>{t("learn.bonds.bailFund.intro")}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="pl-2">
                  <a
                    href="https://bit.ly/localbailfunds"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-[var(--ijl-accent)] hover:opacity-80"
                  >
                    {t("learn.bonds.bailFund.title")}
                  </a>{" "}
                  {t("learn.bonds.bailFund.desc")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
