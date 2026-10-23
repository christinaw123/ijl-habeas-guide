"use client";

import BackButton from "@/components/layout/BackButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { HelpCircle } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function DetentionPage() {
  const router = useRouter();
  const { flow, setFlow, hydrated } = useFlowState();
  const [touched, setTouched] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!hydrated) return;
    if (!flow.arrest.state) router.replace(ROUTES.arrest);
  }, [hydrated, flow.arrest.state, router]);

  if (!hydrated) return null;

  const valid = flow.detention.knowsWhereHeld !== null;

  const onContinue = () => {
    setTouched(true);
    if (!valid) return;

    router.push(
      flow.detention.knowsWhereHeld ? ROUTES.facility : ROUTES.results
    );
  };

  const options = [
    { key: "detention.yes" as const, value: true },
    { key: "detention.no" as const, value: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <BackButton href={ROUTES.arrest} label={t("detention.back")} />

      {/* Main content */}
      <div className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-8">
            <HelpCircle className="mx-auto mb-4 h-12 w-12 text-(--ijl-light-gold-200)" />
            <h1 className="oswald text-[32px] font-medium text-(--ijl-title) mb-3">
              {t("detention.title")}
            </h1>
            <p className="font-proxima text-[16px] text-(--ijl-accent)">
              {t("detention.subtitle")}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-lg border border-(--ijl-border) bg-white p-6 sm:p-8 shadow-sm">
            <div className="space-y-4">
              {/* Option buttons with radio circle UI */}
              {options.map((opt) => {
                const selected = flow.detention.knowsWhereHeld === opt.value;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() =>
                      setFlow((prev) => ({
                        ...prev,
                        detention: {
                          ...prev.detention,
                          knowsWhereHeld: opt.value,
                          detainedState: opt.value
                            ? prev.detention.detainedState
                            : null,
                          facilityId: opt.value
                            ? prev.detention.facilityId
                            : null,
                        },
                      }))
                    }
                    className={[
                      "w-full p-4 text-left rounded-lg border-2 transition-all font-proxima text-base",
                      selected
                        ? "border-(--ijl-accent) bg-[#5A5A8A]/10"
                        : "border-(--ijl-border) hover:border-(--ijl-muted) bg-white",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio circle */}
                      <div
                        className={[
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          selected
                            ? "border-(--ijl-accent)"
                            : "border-(--ijl-muted)",
                        ].join(" ")}
                      >
                        {selected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-(--ijl-accent)" />
                        )}
                      </div>
                      <span className="text-foreground">{t(opt.key)}</span>
                    </div>
                  </button>
                );
              })}

              {touched && !valid && (
                <p className="text-sm font-proxima text-red-600">
                  {t("detention.error")}
                </p>
              )}

              {/* Continue button */}
              <button
                type="button"
                onClick={onContinue}
                className={[
                  "mt-2 w-full rounded-[10px] py-3 font-proxima font-semibold transition-colors",
                  valid
                    ? "bg-(--ijl-light-gold-200) text-(--ijl-light-blue-800) hover:bg-(--ijl-gold-hover) active:bg-(--ijl-gold-pressed)"
                    : "bg-(--ijl-disabled-bg) text-(--ijl-disabled-text) cursor-not-allowed",
                ].join(" ")}
              >
                {t("detention.continue")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
