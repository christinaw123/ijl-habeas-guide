"use client";

import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { STATES } from "@/lib/flow/mockData";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { STATE_ABBREVIATIONS } from "@/lib/data/stateAbbreviations";
import { CityCombobox } from "@/components/ui/combobox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Step1ArrestLocationPage() {
  const router = useRouter();
  const { flow, setFlow, hydrated } = useFlowState();
  const [touched, setTouched] = useState(false);
  const { t } = useLanguage();

  if (!hydrated) return null;

  const stateValid = (flow.arrest.state ?? "").trim().length > 0;
  const stateAbbr = STATE_ABBREVIATIONS[flow.arrest.state ?? ""] ?? "";

  const onContinue = () => {
    setTouched(true);
    if (!stateValid) return;
    router.push("/detainee/step-2");
  };

  return (
    <div className="bg-white">
      <BackButton href="/" label={t("step1.back")} />

      <main className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-8">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-[var(--ijl-accent)]" />
            <h1 className="oswald text-[32px] font-medium text-[var(--ijl-title)] mb-3">
              {t("step1.title")}
            </h1>
            <p className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)]">
              {t("step1.subtitle")}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-lg border border-[var(--ijl-border)] bg-white p-6 sm:p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.12)]">
            <div className="space-y-6">
              {/* State */}
              <div className="space-y-2">
                <label className="font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]">
                  {t("step1.state.label")}
                </label>

                <Select
                  value={flow.arrest.state ?? ""}
                  onValueChange={(value) => {
                    setFlow((prev) => ({
                      ...prev,
                      arrest: { state: value, city: null, county_codes: null },
                    }));
                  }}
                >
                  <SelectTrigger aria-label={t("step1.state.label")}>
                    <SelectValue placeholder={t("step1.state.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {touched && !stateValid && (
                  <div className="text-sm font-[var(--font-proxima)] text-red-600">
                    {t("step1.state.error")}
                  </div>
                )}
              </div>

              {/* City (only show once state selected) */}
              {stateAbbr && (
                <div className="space-y-2">
                  <label className="font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]">
                    {t("step1.city.label")}{" "}
                    <span className="ml-1 font-normal text-[var(--ijl-muted)]">
                      {t("step1.city.optional")}
                    </span>
                  </label>

                  <CityCombobox
                    value={flow.arrest.city}
                    stateAbbr={stateAbbr}
                    placeholder={t("step1.city.placeholder")}
                    onValueChange={(city, countyCodes) =>
                      setFlow((prev) => ({
                        ...prev,
                        arrest: { ...prev.arrest, city, county_codes: countyCodes },
                      }))
                    }
                    onClear={() =>
                      setFlow((prev) => ({
                        ...prev,
                        arrest: { ...prev.arrest, city: null, county_codes: null },
                      }))
                    }
                  />
                </div>
              )}

              {/* Continue */}
              <button
                type="button"
                onClick={onContinue}
                disabled={!stateValid}
                className={[
                  "h-12 w-full rounded-[10px] font-[var(--font-proxima)] font-semibold text-white",
                  stateValid
                    ? "bg-[var(--ijl-accent)] hover:opacity-95"
                    : "bg-[#B9B9C9] cursor-not-allowed",
                ].join(" ")}
              >
                {t("step1.continue")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
