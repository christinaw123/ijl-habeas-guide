"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { STATES } from "@/lib/flow/mockData";
import { getCountiesByState } from "@/lib/supabase/queries";
import { ArrowLeft, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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

  const [counties, setCounties] = useState<string[]>([]);

  useEffect(() => {
    if (!flow.arrest.state) { setCounties([]); return; }
    getCountiesByState(flow.arrest.state).then(setCounties);
  }, [flow.arrest.state]);

  if (!hydrated) return null;

  const stateValid = (flow.arrest.state ?? "").trim().length > 0;

  const onContinue = () => {
    setTouched(true);
    if (!stateValid) return;
    router.push("/detainee/step-2");
  };

  return (
    <div className="bg-white">
      {/* Back row */}
      <div className="border-b border-[var(--ijl-border)]">
        <Container>
          <div className="mx-auto max-w-2xl py-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md px-2 py-2 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)] hover:bg-[var(--ijl-cta-bg)]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("step1.back")}
            </Link>
          </div>
        </Container>
      </div>

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
                      arrest: { state: value, county: null },
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

              {/* County (only show once state selected) */}
              {flow.arrest.state && (
                <div className="space-y-2">
                  <label className="font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]">
                    {t("step1.county.label")}{" "}
                    <span className="ml-1 font-normal text-[var(--ijl-muted)]">
                      {t("step1.county.optional")}
                    </span>
                  </label>

                  <Select
                    value={flow.arrest.county ?? "__unknown__"}
                    onValueChange={(value) => {
                      setFlow((prev) => ({
                        ...prev,
                        arrest: {
                          ...prev.arrest,
                          county: value === "__unknown__" ? null : value,
                        },
                      }));
                    }}
                  >
                    <SelectTrigger aria-label={t("step1.county.label")}>
                      <SelectValue placeholder={t("step1.county.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__unknown__">
                        {t("step1.county.unknown")}
                      </SelectItem>
                      {counties.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
