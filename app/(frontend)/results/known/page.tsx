"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import BackButton from "@/components/layout/BackButton";
import Modal from "@/components/Modal";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { ResultsData } from "@/server/types";
import { ROUTES } from "@/lib/routes";
import ContactTab from "./_components/ContactTab";
import GetHelpFoundTab from "./_components/GetHelpFoundTab";
import GetHelpNotFoundTab from "./_components/GetHelpNotFoundTab";
import LegalOptionsTab from "./_components/LegalOptionsTab";

type Tab = "contact-person" | "get-help" | "legal-options";

export default function KnownResults() {
  const router = useRouter();
  const { flow } = useFlowState();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<Tab>("contact-person");
  const [showCommissaryModal, setShowCommissaryModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const [results, setResults] = useState<ResultsData | null | undefined>(
    undefined
  );
  const loading = !!flow.detention.facilityId && results === undefined;

  useEffect(() => {
    if (!flow.detention.facilityId) return;
    fetch(`/api/results/known?facilityCode=${encodeURIComponent(flow.detention.facilityId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setResults)
      .catch(() => setResults(null));
  }, [flow.detention.facilityId]);

  const arrestCity = flow.arrest.city ?? t("resultsKnown.unknownCity");
  const arrestState = flow.arrest.state ?? t("resultsKnown.unknownState");
  const facilityLabel =
    results?.facility.facility_display ?? t("resultsKnown.unknownFacility");

  const orgs = results?.orgs ?? [];
  const hasOrgs = orgs.length > 0;

  const TABS: { id: Tab; labelKey: string }[] = [
    { id: "contact-person", labelKey: "resultsKnown.tab.contact" },
    { id: "get-help", labelKey: "resultsKnown.tab.help" },
    { id: "legal-options", labelKey: "resultsKnown.tab.legal" },
  ];

  const badgeBase =
    "flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFEFEF] hover:bg-[#E5E5E5] transition-colors cursor-pointer group w-fit";
  const badgeText =
    "font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]";

  return (
    <div className="bg-white">
      <BackButton href={ROUTES.facility} label={t("resultsKnown.back")} />
      <div className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Title */}
          <h1 className="oswald text-[36px] font-medium text-[var(--ijl-title)] leading-[1.3]">
            {t("resultsKnown.title")}
          </h1>

          {/* Location badges */}
          <div className="space-y-2">
            <button
              onClick={() => router.push(ROUTES.arrest)}
              className={badgeBase}
              aria-label={t("resultsKnown.arrestedIn")}
            >
              <span className={badgeText}>{t("resultsKnown.arrestedIn")}</span>
              <span className={`${badgeText} font-semibold`}>
                {arrestCity}, {arrestState}
              </span>
              <Pencil className="w-3.5 h-3.5 text-[var(--ijl-muted)] group-hover:text-[var(--foreground)] transition-colors" />
            </button>

            <button
              onClick={() => router.push(ROUTES.facility)}
              className={badgeBase}
              aria-label={t("resultsKnown.detainedIn")}
            >
              <span className={badgeText}>{t("resultsKnown.detainedIn")}</span>
              <span className={`${badgeText} font-semibold`}>
                {facilityLabel}
              </span>
              <Pencil className="w-3.5 h-3.5 text-[var(--ijl-muted)] group-hover:text-[var(--foreground)] transition-colors" />
            </button>
          </div>

          {/* Intro */}
          <p className="font-[var(--font-proxima)] text-[18px] text-[var(--foreground)]">
            {t(
              hasOrgs
                ? "resultsKnown.intro.orgsFound"
                : "resultsKnown.intro.noOrgs"
            )}
          </p>

          {/* Tab bar */}
          <div className="border-b border-[var(--ijl-border)] flex">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "px-4 py-2 font-[var(--font-proxima)] text-[14px] border-b-2 -mb-px transition-colors",
                    active
                      ? "border-[var(--ijl-accent)] text-[var(--ijl-accent)] font-semibold"
                      : "border-transparent text-[var(--foreground)] hover:text-[var(--ijl-accent)]",
                  ].join(" ")}
                >
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--ijl-accent)] border-t-transparent animate-spin" />
            </div>
          )}

          {/* Tab content */}
          {!loading && (
            <div className="pb-12">
              {activeTab === "contact-person" && (
                <ContactTab
                  facility={results?.facility}
                  onCommissaryClick={() => setShowCommissaryModal(true)}
                />
              )}
              {activeTab === "get-help" &&
                (hasOrgs ? (
                  <GetHelpFoundTab
                    orgs={orgs}
                    onCallModalClick={() => setShowCallModal(true)}
                  />
                ) : (
                  <GetHelpNotFoundTab />
                ))}
              {activeTab === "legal-options" && (
                <LegalOptionsTab
                  fieldOffice={results?.fieldOffice}
                  districtCourt={results?.districtCourt}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Commissary modal */}
      <Modal
        open={showCommissaryModal}
        onClose={() => setShowCommissaryModal(false)}
        title={t("resultsKnown.modal.commissary.title")}
      >
        <div className="space-y-4 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
          <p>{t("resultsKnown.modal.commissary.p1")}</p>
          <p>{t("resultsKnown.modal.commissary.p2")}</p>
        </div>
      </Modal>

      {/* What to expect modal */}
      <Modal
        open={showCallModal}
        onClose={() => setShowCallModal(false)}
        title={t("resultsKnown.modal.call.title")}
      >
        <div className="space-y-4 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
          <p>
            <span className="font-bold">{t("resultsKnown.modal.call.p1.bold")}</span>{" "}
            {t("resultsKnown.modal.call.p1.body")}
          </p>
          <p>
            <span className="font-bold">{t("resultsKnown.modal.call.p2.bold")}</span>{" "}
            {t("resultsKnown.modal.call.p2.body")}
          </p>
          <p>
            <span className="font-bold">{t("resultsKnown.modal.call.p3.bold")}</span>{" "}
            {t("resultsKnown.modal.call.p3.body")}
          </p>
        </div>
      </Modal>
    </div>
  );
}
