"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ArrowLeft } from "lucide-react";

export default function UnknownResults() {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      <div className="border-b border-[var(--ijl-border)]">
        <Container>
          <div className="py-3">
            <Link
              href="/detainee/step-2"
              className="inline-flex items-center gap-2 rounded-md px-2 py-2 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)] hover:bg-[var(--ijl-cta-bg)]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("resultsUnknown.back")}
            </Link>
          </div>
        </Container>
      </div>

      <Container>
        <div className="px-4 py-8">
          <h1 className="oswald font-medium text-[32px] leading-[47px] ijl-title-color text-center">
            {t("resultsUnknown.title")}
          </h1>
          <p className="font-[var(--font-proxima)] mt-4 text-center">
            {t("resultsUnknown.placeholder")}
          </p>
        </div>
      </Container>
    </div>
  );
}
