"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-(--ijl-light-blue-800) py-8 px-4 w-full">
      <div className="max-w-93.75 mx-auto flex flex-col gap-6">
        <p className="font-proxima font-normal text-[14px] leading-5 tracking-[-0.1504px] text-(--ijl-light-purple-200) text-center">
          {t("footer.legal")}
        </p>

        <p className="font-proxima font-normal text-[12px] leading-4.5 tracking-[-0.1504px] text-(--ijl-light-purple-200) text-center italic">
          {t("footer.translation")}
        </p>

        <p className="font-proxima font-normal text-[14px] leading-5 tracking-[-0.1504px] text-(--ijl-light-purple-200) text-center">
          {t("footer.org")}{" "}
          <a href="#" className="font-bold underline text-(--ijl-light-gold-200) hover:opacity-90">
            {t("footer.org.link")}
          </a>
        </p>

        <div className="h-px bg-(--ijl-accent) w-full" />

        <p className="font-proxima font-normal text-[14px] leading-5 tracking-[-0.1504px] text-(--ijl-muted-on-dark) text-center">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
