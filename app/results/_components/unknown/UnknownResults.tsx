"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "@/components/Modal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { FlowState } from "@/lib/flow/types";
import type { UnknownResultsData } from "@/server/types";
import { ROUTES } from "@/lib/routes";
import type { Facility, Org, Tab } from "@/app/results/_lib/types";
import { toFacility, toOrg } from "@/app/results/_lib/mappers";
import SearchIceTab from "./SearchIceTab";
import OtherSearchesTab from "./OtherSearchesTab";
import CallFacilitiesTab from "./CallFacilitiesTab";
import IfFoundTab from "./IfFoundTab";
import GetHelpTab from "./GetHelpTab";
import ResultsLayout from "../ResultsLayout";

// Results when the user doesn't know where the person is held.
export default function UnknownResults({ flow }: { flow: FlowState }) {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<Tab>("search-ice");
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [arrestInfoOpen, setArrestInfoOpen] = useState(false);
  const [aNumberOpen, setANumberOpen] = useState(false);
  const [whatToExpectOpen, setWhatToExpectOpen] = useState(false);
  const [facilities, setFacilities] = useState<Facility[] | null>(null);
  const [orgs, setOrgs] = useState<Org[] | null>(null);

  useEffect(() => {
    if (!flow.arrest.state) return;
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
  }, [flow.arrest.state, flow.arrest.county_codes, flow.arrest.city]);

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
    <>
      <ResultsLayout
        backHref={ROUTES.detention}
        backLabel={t("resultsUnknown.back")}
        title={t("resultsUnknown.title")}
        badges={[
          {
            label: t("resultsUnknown.arrestedIn"),
            value: arrestLocation,
            ariaLabel: t("resultsUnknown.editLocation"),
            href: ROUTES.arrest,
          },
        ]}
        intro={t("resultsUnknown.intro")}
        notice={
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-proxima font-bold text-[14px] text-amber-900">
                {t("resultsUnknown.alert.title")}
              </h3>
              <p className="font-proxima text-[14px] text-amber-800">
                {t("resultsUnknown.alert.body")}
              </p>
              <button
                onClick={() => setArrestInfoOpen(true)}
                className="font-proxima text-[12px] font-medium text-amber-900 underline"
              >
                {t("resultsUnknown.alert.link")}
              </button>
            </div>
          </div>
        }
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
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
      </ResultsLayout>

      {/* ── Modal: What happens after an arrest ─────────────────────── */}
      <Modal
        open={arrestInfoOpen}
        onClose={() => setArrestInfoOpen(false)}
        title={t("resultsUnknown.modal.arrestInfo.title")}
      >
        <div className="space-y-4">
          <p className="font-proxima text-base text-foreground">
            {t("resultsUnknown.modal.arrestInfo.p1")}
          </p>
          <p className="font-proxima text-base text-foreground">
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
            <div className="border border-(--ijl-border) rounded-lg p-6 w-full max-w-[280px] bg-white">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 bg-gray-50" />
              </div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-3/4 mx-auto" />
              <div className="border-2 border-dashed border-amber-400 bg-amber-50 rounded-lg p-4 mb-6">
                <div className="text-amber-700 font-proxima text-[12px] font-medium mb-1">
                  {t("resultsUnknown.modal.aNumber.fileNo")}
                </div>
                <div className="text-amber-900 font-proxima text-[18px] font-bold">
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
            <p className="font-proxima text-base text-foreground">
              {t("resultsUnknown.modal.aNumber.p1")}
            </p>
            <p className="font-proxima text-base text-foreground">
              {t("resultsUnknown.modal.aNumber.p2")}
            </p>
            <div className="bg-[#F5F5F4] rounded-lg p-4">
              <p className="font-proxima text-base text-foreground">
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
          <p className="font-proxima text-base text-foreground">
            <span className="font-bold">
              {t("resultsUnknown.modal.whatToExpect.p1.bold")}
            </span>{" "}
            {t("resultsUnknown.modal.whatToExpect.p1.body")}
          </p>
          <p className="font-proxima text-base text-foreground">
            <span className="font-bold">
              {t("resultsUnknown.modal.whatToExpect.p2.bold")}
            </span>{" "}
            {t("resultsUnknown.modal.whatToExpect.p2.body")}
          </p>
          <p className="font-proxima text-base text-foreground">
            <span className="font-bold">
              {t("resultsUnknown.modal.whatToExpect.p3.bold")}
            </span>{" "}
            {t("resultsUnknown.modal.whatToExpect.p3.body")}
          </p>
        </div>
      </Modal>
    </>
  );
}
