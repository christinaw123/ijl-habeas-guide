// app/detainee/step-2/page.tsx
"use client";

import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { HelpCircle } from "lucide-react";
import { LOADING_NEXT_KEY } from "@/app/detainee/loading/page";

export default function Step2KnowsWhereHeldPage() {
  const router = useRouter();
  const { flow, setFlow, hydrated } = useFlowState();
  const [touched, setTouched] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!hydrated) return;
    if (!flow.arrest.state) router.replace("/detainee/step-1");
  }, [hydrated, flow.arrest.state, router]);

  if (!hydrated) return null;

  const valid = flow.detention.knowsWhereHeld !== null;

  const onContinue = () => {
    setTouched(true);
    if (!valid) return;

    if (flow.detention.knowsWhereHeld === false) {
      router.push("/detainee/results/unknown");
      return;
    }
    localStorage.setItem(LOADING_NEXT_KEY, "step3");
    router.push("/detainee/loading");
  };

  const options = [
    { key: "step2.yes" as const, value: true },
    { key: "step2.no" as const, value: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <BackButton href="/detainee/step-1" label={t("step2.back")} />

      {/* Main content */}
      <div className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-8">
            <HelpCircle className="mx-auto mb-4 h-12 w-12 text-[var(--ijl-accent)]" />
            <h1 className="oswald text-[32px] font-medium text-[var(--ijl-title)] mb-3">
              {t("step2.title")}
            </h1>
            <p className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)]">
              {t("step2.subtitle")}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-lg border border-[var(--ijl-border)] bg-white p-6 sm:p-8 shadow-sm">
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
                      "w-full p-4 text-left rounded-lg border-2 transition-all font-[var(--font-proxima)] text-base",
                      selected
                        ? "border-[var(--ijl-accent)] bg-[#5A5A8A]/10"
                        : "border-[var(--ijl-border)] hover:border-[var(--ijl-muted)] bg-white",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio circle */}
                      <div
                        className={[
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          selected
                            ? "border-[var(--ijl-accent)]"
                            : "border-[var(--ijl-muted)]",
                        ].join(" ")}
                      >
                        {selected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[var(--ijl-accent)]" />
                        )}
                      </div>
                      <span className="text-[var(--foreground)]">{t(opt.key)}</span>
                    </div>
                  </button>
                );
              })}

              {touched && !valid && (
                <p className="text-sm font-[var(--font-proxima)] text-red-600">
                  {t("step2.error")}
                </p>
              )}

              {/* Continue button */}
              <button
                type="button"
                onClick={onContinue}
                className={[
                  "mt-2 w-full rounded-[10px] py-3 font-[var(--font-proxima)] font-semibold text-white transition-opacity",
                  "bg-[var(--ijl-accent)]",
                  !valid ? "opacity-50 cursor-not-allowed" : "hover:opacity-90",
                ].join(" ")}
              >
                {t("step2.continue")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
