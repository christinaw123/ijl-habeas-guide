"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Modal({
  open,
  onClose,
  title,
  maxWidth = "max-w-lg",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative bg-white rounded-xl p-6 w-full ${maxWidth} shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        <button
          onClick={onClose}
          aria-label={t("common.close")}
          className="absolute top-4 right-4 p-1 rounded text-(--ijl-muted) hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2
          id={titleId}
          className="oswald text-[24px] font-medium text-(--ijl-title) mb-4 pr-8"
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
