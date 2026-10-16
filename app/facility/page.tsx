"use client";

import BackButton from "@/components/layout/BackButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import type { Facility } from "@/server/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StateCombobox } from "@/components/ui/state-combobox";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";

export default function FacilityPage() {
  const router = useRouter();
  const { flow, setFlow, hydrated } = useFlowState();
  const [touched, setTouched] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualFacilityName, setManualFacilityName] = useState("");
  const [showGuidance, setShowGuidance] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!hydrated) return;
    if (!flow.arrest.state) router.replace(ROUTES.arrest);
    // knowsWhereHeld === false is allowed: users on the "where is the person?"
    // results can come back here once they find the facility.
    if (flow.detention.knowsWhereHeld === null) router.replace(ROUTES.detention);
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
    fetch(`/api/facilities?state=${encodeURIComponent(detainedState)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Facility[]) => {
        if (!cancelled) {
          setFacilities(data);
          setFetchedFor(detainedState);
        }
      })
      .catch(() => {
        if (!cancelled) setFetchedFor(detainedState);
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

    // Submitting a facility means the user now knows where the person is held,
    // including users who came back from the "where is the person?" results.
    const manualName = showManualEntry ? manualFacilityName.trim() : "";
    setFlow((prev) => ({
      ...prev,
      detention: {
        ...prev.detention,
        knowsWhereHeld: true,
        facilityId: manualName || prev.detention.facilityId,
      },
    }));

    router.push(ROUTES.results);
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
      <BackButton href={ROUTES.detention} label={t("facility.back")} />

      <div className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="text-center mb-8">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-[var(--ijl-accent)]" />
            <h1 className="oswald text-[32px] font-medium text-[var(--ijl-title)] mb-3">
              {t("facility.title")}
            </h1>
            <p className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)]">
              {t("facility.subtitle")}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-lg border border-[var(--ijl-border)] bg-white p-6 sm:p-8 shadow-sm">
            <div className="space-y-6">
              {/* State */}
              <div className="space-y-2">
                <label className="font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]">
                  {t("facility.state.label")}
                </label>
                <StateCombobox
                  value={flow.detention.detainedState ?? null}
                  placeholder={t("facility.state.placeholder")}
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
                  onClear={() => {
                    setFlow((prev) => ({
                      ...prev,
                      detention: {
                        ...prev.detention,
                        detainedState: null,
                        facilityId: null,
                      },
                    }));
                    setShowManualEntry(false);
                    setManualFacilityName("");
                    setShowGuidance(false);
                  }}
                />
              </div>

              {/* Facility dropdown (hidden when manual entry is active) */}
              {hasState && !showManualEntry && (
                <div className="space-y-2">
                  <label className="font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]">
                    {t("facility.facility.label")}
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
                    <SelectTrigger aria-label={t("facility.facility.label")}>
                      <SelectValue placeholder={t("facility.facility.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingFacilities ? (
                        <Spinner size="sm" className="py-3" />
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
                    {t("facility.facility.manual.label")}
                  </label>
                  <input
                    id="manual-facility"
                    type="text"
                    value={manualFacilityName}
                    onChange={(e) => setManualFacilityName(e.target.value.slice(0, 300))}
                    maxLength={300}
                    placeholder={t("facility.facility.manual.placeholder")}
                    className="w-full rounded-lg border border-[var(--ijl-border)] bg-white px-4 py-3 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)] placeholder:text-[var(--ijl-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ijl-accent)]"
                  />
                </div>
              )}

              {touched && !valid && (
                <p className="text-sm font-[var(--font-proxima)] text-red-600">
                  {t("facility.error")}
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
                {t("facility.continue")}
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
                  {t("facility.help.noFacility")}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleUnknownFacility}
                  className="text-[var(--ijl-accent)] hover:underline"
                >
                  {t("facility.help.unknownFacility")}
                </button>
              </div>
            </div>
          )}

          {/* Guidance panel */}
          {showGuidance && (
            <div className="mt-6 rounded-lg border border-[var(--ijl-border)] bg-[var(--ijl-cta-bg)] p-6">
              <h3 className="oswald text-xl font-medium text-[var(--ijl-title)] mb-3">
                {t("facility.guidance.title")}
              </h3>
              <div className="space-y-3 font-[var(--font-proxima)] text-sm text-[var(--foreground)]">
                <p>{t("facility.guidance.intro")}</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{t("facility.guidance.tip1")}</li>
                  <li>{t("facility.guidance.tip2")}</li>
                  <li>{t("facility.guidance.tip3")}</li>
                  <li>{t("facility.guidance.tip4")}</li>
                  <li>{t("facility.guidance.tip5")}</li>
                </ul>
                <p className="mt-4">{t("facility.guidance.outro")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
