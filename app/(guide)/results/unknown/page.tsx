"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Edit2 } from "lucide-react";
import BackButton from "@/components/layout/BackButton";
import Modal from "@/components/Modal";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { UnknownResultsData } from "@/lib/supabase/queries";
import { ROUTES } from "@/lib/routes";
import type { Facility, Org, Tab } from "./_components/types";
import { toFacility, toOrg } from "./_components/mappers";
import SearchIceTab from "./_components/SearchIceTab";
import OtherSearchesTab from "./_components/OtherSearchesTab";
import CallFacilitiesTab from "./_components/CallFacilitiesTab";
import IfFoundTab from "./_components/IfFoundTab";
import GetHelpTab from "./_components/GetHelpTab";

export default function UnknownResults() {
  const router = useRouter();
  const { flow, hydrated } = useFlowState();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<Tab>("search-ice");
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [arrestInfoOpen, setArrestInfoOpen] = useState(false);
  const [aNumberOpen, setANumberOpen] = useState(false);
  const [whatToExpectOpen, setWhatToExpectOpen] = useState(false);
  const [facilities, setFacilities] = useState<Facility[] | null>(null);
  const [orgs, setOrgs] = useState<Org[] | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (flow.detention.knowsWhereHeld !== false) {
      router.replace(ROUTES.knowsLocation);
    }
  }, [hydrated, flow.detention.knowsWhereHeld, router]);

  useEffect(() => {
    if (!hydrated || !flow.arrest.state) return;
    const params = new URLSearchParams({ state: flow.arrest.state });
    if (flow.arrest.county_codes?.length) {
      params.set("countyCodes", flow.arrest.county_codes.join(","));
    }
    if (flow.arrest.city) {
      params.set("city", flow.arrest.city);
    }
    fetch(`/api/results/unknown?${params}`)
      .then((r) => (r.ok ? r.json() : { facilities: [], fieldOffice: null, orgs: [] }))
      .then(({ facilities, orgs }: UnknownResultsData) => {
        setFacilities(facilities.map(toFacility));
        setOrgs(orgs.map(toOrg));
      })
      .catch(() => {
        setFacilities([]);
        setOrgs([]);
      });
  }, [hydrated, flow.arrest.state, flow.arrest.county_codes, flow.arrest.city]);

  if (!hydrated || flow.detention.knowsWhereHeld !== false) return null;

  const arrestLocation = flow.arrest.city
    ? `${flow.arrest.city}, ${flow.arrest.state}`
    : flow.arrest.state;

  const TABS: { id: Tab; label: string }[] = [
    { id: "search-ice", label: t("resultsUnknown.tabs.searchIce") },
    { id: "other-searches", label: t("resultsUnknown.tabs.otherSearches") },
    { id: "call-facilities", label: t("resultsUnknown.tabs.callFacilities") },
    { id: "if-found", label: t("resultsUnknown.tabs.ifFound") },
    { id: "get-help", label: t("resultsUnknown.tabs.getHelp") },
  ];

  return (
    <div className="bg-white min-h-screen">
      <BackButton href={ROUTES.knowsLocation} label={t("resultsUnknown.back")} />

      {/* Main content */}
      <div className="px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Title */}
          <h1 className="oswald font-medium text-[36px] leading-[1.2] ijl-title-color">
            {t("resultsUnknown.title")}
          </h1>

          {/* Arrested in badge — clicking edits location */}
          <button
            onClick={() => router.push(ROUTES.arrest)}
            aria-label={t("resultsUnknown.editLocation")}
            className="flex items-center gap-2 px-4 py-[6px] rounded-full w-fit bg-[#efefef] hover:bg-[#e5e5e5] transition-colors cursor-pointer group"
          >
            <span className="font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]">
              {t("resultsUnknown.arrestedIn")}
            </span>
            <span className="font-[var(--font-proxima)] text-[14px] font-medium text-[var(--foreground)] group-hover:text-[var(--ijl-accent)] transition-colors">
              {arrestLocation}
            </span>
            <Edit2 className="w-4 h-4 text-[var(--ijl-muted)] group-hover:text-[var(--foreground)] transition-colors ml-1" />
          </button>

          {/* Intro */}
          <p className="font-[var(--font-proxima)] text-[18px] text-[var(--foreground)]">
            {t("resultsUnknown.intro")}
          </p>

          {/* Timing alert */}
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-[var(--font-proxima)] font-bold text-[14px] text-amber-900">
                {t("resultsUnknown.alert.title")}
              </h3>
              <p className="font-[var(--font-proxima)] text-[14px] text-amber-800">
                {t("resultsUnknown.alert.body")}
              </p>
              <button
                onClick={() => setArrestInfoOpen(true)}
                className="font-[var(--font-proxima)] text-[12px] font-medium text-amber-900 underline"
              >
                {t("resultsUnknown.alert.link")}
              </button>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="border-b border-[var(--ijl-border)] flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "whitespace-nowrap font-[var(--font-proxima)] text-[14px] px-4 py-2 border-b-2 transition-all flex-shrink-0",
                  activeTab === tab.id
                    ? "border-[var(--ijl-accent)] font-semibold text-[var(--foreground)]"
                    : "border-transparent text-[var(--ijl-muted)] hover:text-[var(--foreground)]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Search ICE ────────────────────────────────────────── */}
          {activeTab === "search-ice" && (
            <SearchIceTab
              onANumberClick={() => setANumberOpen(true)}
              onNavigate={setActiveTab}
            />
          )}

          {/* ── Tab: Other Searches ────────────────────────────────────── */}
          {activeTab === "other-searches" && <OtherSearchesTab onNavigate={setActiveTab} />}

          {/* ── Tab: Call Facilities ───────────────────────────────────── */}
          {activeTab === "call-facilities" && (
            <CallFacilitiesTab
              facilities={facilities}
              arrestLocation={arrestLocation}
              accordionOpen={accordionOpen}
              onToggleAccordion={() => setAccordionOpen((v) => !v)}
              onNavigate={setActiveTab}
            />
          )}

          {/* ── Tab: If You Find Them ─────────────────────────────────── */}
          {activeTab === "if-found" && <IfFoundTab onNavigate={setActiveTab} />}

          {/* ── Tab: Get Help ─────────────────────────────────────────── */}
          {activeTab === "get-help" && (
            <GetHelpTab
              orgs={orgs}
              onWhatToExpectClick={() => setWhatToExpectOpen(true)}
              onNavigate={setActiveTab}
            />
          )}
        </div>
      </div>

      {/* ── Modal: What happens after an arrest ─────────────────────── */}
      <Modal
        open={arrestInfoOpen}
        onClose={() => setArrestInfoOpen(false)}
        title={t("resultsUnknown.modal.arrestInfo.title")}
      >
        <div className="space-y-4">
          <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
            {t("resultsUnknown.modal.arrestInfo.p1")}
          </p>
          <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
            {t("resultsUnknown.modal.arrestInfo.p2")}
          </p>
        </div>
      </Modal>

      {/* ── Modal: What is an A-number ──────────────────────────────── */}
      <Modal
        open={aNumberOpen}
        onClose={() => setANumberOpen(false)}
        title={t("resultsUnknown.modal.aNumber.title")}
        maxWidth="max-w-2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Document illustration */}
          <div className="flex items-center justify-center">
            <div className="border border-[var(--ijl-border)] rounded-lg p-6 w-full max-w-[280px] bg-white">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 bg-gray-50" />
              </div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-3/4 mx-auto" />
              <div className="border-2 border-dashed border-amber-400 bg-amber-50 rounded-lg p-4 mb-6">
                <div className="text-amber-700 font-[var(--font-proxima)] text-[12px] font-medium mb-1">
                  {t("resultsUnknown.modal.aNumber.fileNo")}
                </div>
                <div className="text-amber-900 font-[var(--font-proxima)] text-[18px] font-bold">
                  A-123-456-789
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>
            </div>
          </div>
          {/* Text */}
          <div className="space-y-4">
            <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              {t("resultsUnknown.modal.aNumber.p1")}
            </p>
            <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
              {t("resultsUnknown.modal.aNumber.p2")}
            </p>
            <div className="bg-[#F5F5F4] rounded-lg p-4">
              <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                <span className="font-bold">
                  {t("resultsUnknown.modal.aNumber.noNumber")}
                </span>{" "}
                {t("resultsUnknown.modal.aNumber.noNumberDesc")}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Modal: What to expect when you call ─────────────────────── */}
      <Modal
        open={whatToExpectOpen}
        onClose={() => setWhatToExpectOpen(false)}
        title={t("resultsUnknown.modal.whatToExpect.title")}
      >
        <div className="space-y-4">
          <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
            <span className="font-bold">
              {t("resultsUnknown.modal.whatToExpect.p1.bold")}
            </span>{" "}
            {t("resultsUnknown.modal.whatToExpect.p1.body")}
          </p>
          <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
            <span className="font-bold">
              {t("resultsUnknown.modal.whatToExpect.p2.bold")}
            </span>{" "}
            {t("resultsUnknown.modal.whatToExpect.p2.body")}
          </p>
          <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
            <span className="font-bold">
              {t("resultsUnknown.modal.whatToExpect.p3.bold")}
            </span>{" "}
            {t("resultsUnknown.modal.whatToExpect.p3.body")}
          </p>
        </div>
      </Modal>
    </div>
  );
}
