// app/detainee/step-3/page.tsx
"use client";

import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { STATES } from "@/lib/flow/mockData";
import { type Facility, getFacilitiesByState } from "@/lib/supabase/queries";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { MapPin } from "lucide-react";
import { LOADING_NEXT_KEY } from "@/app/detainee/loading/page";
import { FLOW_STORAGE_KEY } from "@/lib/flow/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Step3DetainedLocationPage() {
  const router = useRouter();
  const { flow, setFlow, hydrated } = useFlowState();
  const [touched, setTouched] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualFacilityName, setManualFacilityName] = useState("");
  const [showGuidance, setShowGuidance] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!hydrated) return;
    if (!flow.arrest.state) router.replace("/detainee/step-1");
    if (flow.detention.knowsWhereHeld === null) router.replace("/detainee/step-2");
    if (flow.detention.knowsWhereHeld === false)
      router.replace("/detainee/results/unknown");
  }, [hydrated, flow, router]);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  // Tracks which detainedState value the current facilities list was fetched for.
  // Used to derive loadingFacilities without a synchronous setState in the effect.
  const [fetchedFor, setFetchedFor] = useState<string | null>(null);
  const loadingFacilities =
    !!flow.detention.detainedState &&
    fetchedFor !== flow.detention.detainedState;

  useEffect(() => {
    const detainedState = flow.detention.detainedState;
    if (!detainedState) return;

    let cancelled = false;
    getFacilitiesByState(detainedState).then((data) => {
      if (!cancelled) {
        setFacilities(data);
        setFetchedFor(detainedState);
      }
    });

    return () => { cancelled = true; };
  }, [flow.detention.detainedState]);

  if (!hydrated) return null;

  const hasState = !!flow.detention.detainedState;
  const hasFacility = showManualEntry
    ? manualFacilityName.trim().length > 0
    : !!flow.detention.facilityId;
  const valid = hasState && hasFacility;

  const onContinue = () => {
    setTouched(true);
    if (!valid) return;

    // For manual entry, write facilityId synchronously to localStorage so the
    // loading page can read it (useFlowState's write is async via useEffect).
    if (showManualEntry && manualFacilityName.trim()) {
      const name = manualFacilityName.trim();
      setFlow((prev) => ({
        ...prev,
        detention: { ...prev.detention, facilityId: name },
      }));
      try {
        const raw = localStorage.getItem(FLOW_STORAGE_KEY);
        const current = raw ? JSON.parse(raw) : {};
        localStorage.setItem(
          FLOW_STORAGE_KEY,
          JSON.stringify({
            ...current,
            detention: { ...current.detention, facilityId: name },
          })
        );
      } catch {}
    }

    localStorage.setItem(LOADING_NEXT_KEY, "results");
    router.push("/detainee/loading");
  };

  const handleNoFacility = () => {
    setShowManualEntry(true);
    setShowGuidance(false);
    setFlow((prev) => ({
      ...prev,
      detention: { ...prev.detention, facilityId: null },
    }));
  };

  const handleUnknownFacility = () => {
    setShowGuidance(true);
    setShowManualEntry(false);
  };

  return (
    <div className="bg-white">
      <BackButton href="/detainee/step-2" label={t("step3.back")} />

      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-8">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-[var(--ijl-accent)]" />
            <h1 className="oswald text-[32px] font-medium text-[var(--ijl-title)] mb-3">
              {t("step3.title")}
            </h1>
            <p className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)]">
              {t("step3.subtitle")}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-lg border border-[var(--ijl-border)] bg-white p-6 sm:p-8 shadow-sm">
            <div className="space-y-6">
              {/* State */}
              <div className="space-y-2">
                <label className="font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]">
                  {t("step3.state.label")}
                </label>
                <Select
                  value={flow.detention.detainedState ?? ""}
                  onValueChange={(value) => {
                    setFlow((prev) => ({
                      ...prev,
                      detention: {
                        ...prev.detention,
                        detainedState: value || null,
                        facilityId: null,
                      },
                    }));
                    setShowManualEntry(false);
                    setManualFacilityName("");
                    setShowGuidance(false);
                  }}
                >
                  <SelectTrigger aria-label={t("step3.state.label")}>
                    <SelectValue placeholder={t("step3.state.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Facility dropdown (hidden when manual entry is active) */}
              {hasState && !showManualEntry && (
                <div className="space-y-2">
                  <label className="font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]">
                    {t("step3.facility.label")}
                  </label>
                  <Select
                    value={flow.detention.facilityId ?? ""}
                    onValueChange={(value) =>
                      setFlow((prev) => ({
                        ...prev,
                        detention: { ...prev.detention, facilityId: value || null },
                      }))
                    }
                  >
                    <SelectTrigger aria-label={t("step3.facility.label")}>
                      <SelectValue placeholder={t("step3.facility.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingFacilities ? (
                        <div className="px-3 py-2 text-sm text-[var(--ijl-muted)] font-[var(--font-proxima)]">
                          Loading…
                        </div>
                      ) : facilities.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-[var(--ijl-muted)] font-[var(--font-proxima)]">
                          No facilities found for this state
                        </div>
                      ) : (
                        facilities.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Manual facility name input */}
              {showManualEntry && hasState && (
                <div className="space-y-2">
                  <label
                    htmlFor="manual-facility"
                    className="font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]"
                  >
                    {t("step3.facility.manual.label")}
                  </label>
                  <input
                    id="manual-facility"
                    type="text"
                    value={manualFacilityName}
                    onChange={(e) => setManualFacilityName(e.target.value)}
                    placeholder={t("step3.facility.manual.placeholder")}
                    className="w-full rounded-lg border border-[var(--ijl-border)] bg-white px-4 py-3 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)] placeholder:text-[var(--ijl-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ijl-accent)]"
                  />
                </div>
              )}

              {touched && !valid && (
                <p className="text-sm font-[var(--font-proxima)] text-red-600">
                  {t("step3.error")}
                </p>
              )}

              {/* Continue */}
              <button
                type="button"
                onClick={onContinue}
                className={[
                  "w-full rounded-[10px] py-3 font-[var(--font-proxima)] font-semibold text-white transition-opacity",
                  "bg-[var(--ijl-accent)]",
                  !valid ? "opacity-50 cursor-not-allowed" : "hover:opacity-90",
                ].join(" ")}
              >
                {t("step3.continue")}
              </button>
            </div>
          </div>

          {/* Help options — only shown once a state is selected */}
          {hasState && (
            <div className="mt-6 text-center space-y-2 text-sm font-[var(--font-proxima)]">
              <div>
                <button
                  type="button"
                  onClick={handleNoFacility}
                  className="text-[var(--ijl-accent)] hover:underline"
                >
                  {t("step3.help.noFacility")}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleUnknownFacility}
                  className="text-[var(--ijl-accent)] hover:underline"
                >
                  {t("step3.help.unknownFacility")}
                </button>
              </div>
            </div>
          )}

          {/* Guidance panel */}
          {showGuidance && (
            <div className="mt-6 rounded-lg border border-[var(--ijl-border)] bg-[var(--ijl-cta-bg)] p-6">
              <h3 className="oswald text-xl font-medium text-[var(--ijl-title)] mb-3">
                {t("step3.guidance.title")}
              </h3>
              <div className="space-y-3 font-[var(--font-proxima)] text-sm text-[var(--foreground)]">
                <p>{t("step3.guidance.intro")}</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{t("step3.guidance.tip1")}</li>
                  <li>{t("step3.guidance.tip2")}</li>
                  <li>{t("step3.guidance.tip3")}</li>
                  <li>{t("step3.guidance.tip4")}</li>
                  <li>{t("step3.guidance.tip5")}</li>
                </ul>
                <p className="mt-4">{t("step3.guidance.outro")}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
