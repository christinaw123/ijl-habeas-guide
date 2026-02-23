"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#001F3C] py-8 px-4 w-full">
      <div className="max-w-[375px] mx-auto flex flex-col gap-6">
        <p className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-white text-center opacity-90">
          {t("footer.legal")}
        </p>

        <p className="font-[var(--font-proxima)] font-normal text-[12px] leading-[18px] tracking-[-0.1504px] text-white text-center opacity-75 italic">
          {t("footer.translation")}
        </p>

        <p className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-white text-center opacity-90">
          {t("footer.org")}{" "}
          <a href="#" className="font-bold underline hover:opacity-90">
            {t("footer.org.link")}
          </a>
        </p>

        <div className="h-px bg-white/20 w-full" />

        <p className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-white text-center opacity-90">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
