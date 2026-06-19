"use client";

import BackButton from "@/components/BackButton";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function HabeasCorpusPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      <BackButton href="/detainee/results/known" label={t("learn.back")} />

      <div className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl flex flex-col gap-6">
          <h1 className="oswald font-medium text-[24px] leading-[32px] text-[var(--ijl-title)]">
            {t("learn.habeas.title")}
          </h1>

          <div className="font-[var(--font-proxima)] text-[16px] leading-[24px] text-[var(--foreground)] space-y-6">
            <p>{t("learn.habeas.p1")}</p>

            <p>{t("learn.habeas.p2")}</p>

            <p>{t("learn.habeas.p3")}</p>

            <p>
              {t("learn.habeas.findHelp.prefix")}{" "}
              <Link
                href="/detainee/results/known"
                className="font-bold underline text-[var(--ijl-accent)] hover:opacity-80"
              >
                {t("learn.habeas.findHelp.link")}
              </Link>
              .
            </p>

            <div className="space-y-4">
              <p>{t("learn.habeas.selfRep.intro")}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li className="pl-2">
                  <span className="font-bold text-[var(--foreground)]">
                    {t("learn.habeas.guide.title")}
                  </span>{" "}
                  {t("learn.habeas.guide.desc")}
                </li>
              </ul>
            </div>

            <p>{t("learn.habeas.p5")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
