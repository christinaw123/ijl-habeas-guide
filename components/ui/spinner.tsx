"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Shown only while a real request is in flight.
export function Spinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const { t } = useLanguage();
  return (
    <div role="status" className={cn("flex justify-center", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "rounded-full border-2 border-[var(--ijl-accent)] border-t-transparent animate-spin",
          size === "sm" ? "w-5 h-5" : "w-8 h-8"
        )}
      />
      <span className="sr-only">{t("common.loading")}</span>
    </div>
  );
}
