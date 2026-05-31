"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CircleCheck,
  ExternalLink,
  Edit2,
  MapPin,
  Phone,
  Globe,
  Users,
  Scale,
  Clock,
  ChevronDown,
  X,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { getUnknownResultsData, type FacilityDetails, type FieldOffice, type LocalOrg } from "@/lib/supabase/queries";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Tab = "search-ice" | "other-searches" | "call-facilities" | "if-found" | "get-help";

type Facility = {
  id: string;
  name: string;
  address: string[];
  phone?: string;
  phoneDisplay?: string;
  url?: string;
  urlDisplay?: string;
};

type Org = {
  id: number;
  type: "general" | "legal";
  name: string;
  abbr: string;
  description: string;
  url?: string;
  urlDisplay?: string;
  phone?: string;
  hours?: string;
};

// ---------------------------------------------------------------------------
// Supabase → local type mappers
// ---------------------------------------------------------------------------
function toFacility(f: FacilityDetails): Facility {
  const lines: string[] = [];
  if (f.address) lines.push(f.address);
  lines.push(`${f.city}, ${f.state} ${f.zip}`.trim());
  const phoneRaw = f.phone_info?.replace(/\D/g, "") || undefined;
  return {
    id: f.facility_code,
    name: f.facility_display,
    address: lines,
    phone: phoneRaw,
    phoneDisplay: f.phone_info ?? undefined,
    url: f.url ?? undefined,
    urlDisplay: f.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? undefined,
  };
}

function toOrg(o: LocalOrg): Org {
  const abbr =
    o.organization
      .split(/\s+/)
      .filter((w) => /^[A-Z]/.test(w))
      .map((w) => w[0])
      .join("") || o.organization.substring(0, 3).toUpperCase();
  return {
    id: o.id,
    type: o.org_type === "legal" ? "legal" : "general",
    name: o.organization,
    abbr,
    description: o.action_text_1 ?? o.action_text_2 ?? "",
    url: o.url ?? undefined,
    urlDisplay: o.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? undefined,
    phone: o.phone?.replace(/\D/g, "") || undefined,
  };
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
function Modal({
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
        className={`relative bg-white rounded-xl p-6 w-full ${maxWidth} shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded text-[var(--ijl-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="oswald text-[24px] font-medium text-[var(--ijl-title)] mb-4 pr-8">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
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
  const [fieldOffice, setFieldOffice] = useState<FieldOffice | null>(null);
  const [orgs, setOrgs] = useState<Org[] | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (flow.detention.knowsWhereHeld !== false) {
      router.replace("/detainee/step-2");
    }
  }, [hydrated, flow.detention.knowsWhereHeld, router]);

  useEffect(() => {
    if (!hydrated || !flow.arrest.state) return;
    getUnknownResultsData(flow.arrest.state, flow.arrest.county_codes ?? null).then(
      ({ facilities, fieldOffice, orgs }) => {
        setFacilities(facilities.map(toFacility));
        setFieldOffice(fieldOffice);
        setOrgs(orgs.map(toOrg));
      }
    );
  }, [hydrated, flow.arrest.state, flow.arrest.county_codes]);

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
      <BackButton href="/detainee/step-2" label={t("resultsUnknown.back")} />

      {/* Main content */}
      <main className="px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Title */}
          <h1 className="oswald font-medium text-[36px] leading-[1.2] ijl-title-color">
            {t("resultsUnknown.title")}
          </h1>

          {/* Arrested in badge — clicking edits location */}
          <button
            onClick={() => router.push("/detainee/step-1")}
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
            <div className="space-y-6">
              <h2 className="oswald font-medium text-[24px] ijl-title-color">
                {t("resultsUnknown.searchIce.heading")}
              </h2>
              <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                {t("resultsUnknown.searchIce.intro")}
              </p>

              {/* Card: Gather info */}
              <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-4">
                <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
                  {t("resultsUnknown.searchIce.gather.heading")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CircleCheck className="w-5 h-5 text-[var(--ijl-accent)] mt-0.5 flex-shrink-0" />
                    <span className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      {t("resultsUnknown.searchIce.gather.anumber")}{" "}
                      <button
                        onClick={() => setANumberOpen(true)}
                        className="text-[var(--ijl-accent)] underline text-[14px]"
                      >
                        {t("resultsUnknown.searchIce.gather.anumberLink")}
                      </button>
                    </span>
                  </div>
                  <p className="font-[var(--font-proxima)] text-[14px] text-[var(--ijl-muted)] pl-8">
                    {t("resultsUnknown.searchIce.gather.or")}
                  </p>
                  <div className="flex items-start gap-3">
                    <CircleCheck className="w-5 h-5 text-[var(--ijl-accent)] mt-0.5 flex-shrink-0" />
                    <span className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      {t("resultsUnknown.searchIce.gather.name")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleCheck className="w-5 h-5 text-[var(--ijl-accent)] mt-0.5 flex-shrink-0" />
                    <span className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      {t("resultsUnknown.searchIce.gather.dob")}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleCheck className="w-5 h-5 text-[var(--ijl-accent)] mt-0.5 flex-shrink-0" />
                    <span className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      {t("resultsUnknown.searchIce.gather.country")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card: Search the locator */}
              <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-4">
                <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
                  {t("resultsUnknown.searchIce.locator.heading")}
                </h3>
                <div className="space-y-2">
                  <h4 className="font-[var(--font-proxima)] font-bold text-base text-[var(--foreground)] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[var(--ijl-accent)]" />
                    {t("resultsUnknown.searchIce.tips.label")}
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                    <li>{t("resultsUnknown.searchIce.tips.1")}</li>
                    <li>{t("resultsUnknown.searchIce.tips.2")}</li>
                    <li>{t("resultsUnknown.searchIce.tips.3")}</li>
                  </ul>
                </div>
                <Button size="lg" asChild>
                  <a
                    href="https://locator.ice.gov/odls/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("resultsUnknown.searchIce.cta")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>

              {/* Bottom nav */}
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setActiveTab("other-searches")}>
                  {t("resultsUnknown.searchIce.next")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Tab: Other Searches ────────────────────────────────────── */}
          {activeTab === "other-searches" && (
            <div className="space-y-6">
              <h2 className="oswald font-medium text-[24px] ijl-title-color">
                {t("resultsUnknown.otherSearches.heading")}
              </h2>
              <p className="font-[var(--font-proxima)] text-[18px] text-[var(--foreground)]">
                {t("resultsUnknown.otherSearches.intro")}
              </p>

              {/* Card: VINE */}
              <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-4">
                <div>
                  <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
                    {t("resultsUnknown.otherSearches.vine.heading")}
                  </h3>
                  <p className="font-[var(--font-proxima)] text-[14px] text-[var(--ijl-muted)]">
                    {t("resultsUnknown.otherSearches.vine.sub")}
                  </p>
                </div>
                <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                  {t("resultsUnknown.otherSearches.vine.intro")}
                </p>

                <div className="space-y-6">
                  {/* VINELink */}
                  <div className="space-y-3">
                    <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      <ExternalLink className="inline w-4 h-4 mr-1 -mt-0.5" />
                      <span className="font-bold">VINELink</span>{" "}
                      {t("resultsUnknown.otherSearches.vinelink.desc")}
                    </p>
                    <ul className="list-disc pl-5 space-y-1 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      <li>
                        <span className="font-bold">
                          {t("resultsUnknown.otherSearches.vinelink.need1")}
                        </span>
                      </li>
                    </ul>
                    <p className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)] pl-5">
                      {t("resultsUnknown.searchIce.gather.or")}
                    </p>
                    <ul className="list-disc pl-5 space-y-1 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      <li>{t("resultsUnknown.otherSearches.vinelink.need2")}</li>
                    </ul>
                    <Button size="lg" asChild>
                      <a
                        href="https://www.vinelink.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("resultsUnknown.otherSearches.vinelink.cta")}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>

                  {/* DHS VINELink */}
                  <div className="space-y-3">
                    <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      <ExternalLink className="inline w-4 h-4 mr-1 -mt-0.5" />
                      <span className="font-bold">DHS VINELink</span>{" "}
                      {t("resultsUnknown.otherSearches.dhsVinelink.desc")}
                    </p>
                    <ul className="list-disc pl-5 space-y-1 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      <li>
                        <span className="font-bold">
                          {t("resultsUnknown.otherSearches.dhsVinelink.need1")}
                        </span>
                      </li>
                    </ul>
                    <p className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)] pl-5">
                      {t("resultsUnknown.searchIce.gather.or")}
                    </p>
                    <ul className="list-disc pl-5 space-y-1 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      <li>{t("resultsUnknown.otherSearches.dhsVinelink.need2a")}</li>
                      <li>{t("resultsUnknown.otherSearches.dhsVinelink.need2b")}</li>
                      <li>{t("resultsUnknown.otherSearches.dhsVinelink.need2c")}</li>
                    </ul>
                    <Button size="lg" asChild>
                      <a
                        href="https://www.vinelink.com/vinelink-dhs/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("resultsUnknown.otherSearches.dhsVinelink.cta")}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Card: EOIR ACIS */}
              <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-4">
                <div>
                  <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
                    {t("resultsUnknown.otherSearches.eoir.heading")}
                  </h3>
                  <p className="font-[var(--font-proxima)] text-[14px] text-[var(--ijl-muted)]">
                    {t("resultsUnknown.otherSearches.eoir.sub")}
                  </p>
                </div>
                <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                  {t("resultsUnknown.otherSearches.eoir.intro")}
                </p>
                <ul className="list-disc pl-5 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                  <li>
                    <span className="font-bold">
                      {t("resultsUnknown.otherSearches.eoir.need1")}
                    </span>
                  </li>
                </ul>
                <Button size="lg" asChild>
                  <a
                    href="https://acis.eoir.justice.gov/en/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("resultsUnknown.otherSearches.eoir.cta")}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>

              {/* Bottom nav */}
              <div className="flex justify-between items-center pt-2">
                <Button variant="ghost" onClick={() => setActiveTab("search-ice")}>
                  <ArrowLeft className="w-4 h-4" />
                  {t("resultsUnknown.nav.back")}
                </Button>
                <Button onClick={() => setActiveTab("call-facilities")}>
                  {t("resultsUnknown.tabs.callFacilities")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Tab: Call Facilities ───────────────────────────────────── */}
          {activeTab === "call-facilities" && (
            <div className="space-y-6">
              <h2 className="oswald font-medium text-[24px] ijl-title-color">
                {t("resultsUnknown.callFacilities.heading")}
              </h2>
              <p className="font-[var(--font-proxima)] text-[18px] text-[var(--foreground)]">
                {t("resultsUnknown.callFacilities.intro")}
              </p>

              {/* Accordion: How to call */}
              <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setAccordionOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-6 py-4 font-[var(--font-proxima)] text-[18px] font-bold text-[var(--foreground)] hover:bg-[var(--ijl-cta-bg)] transition-colors text-left"
                  aria-expanded={accordionOpen}
                >
                  {t("resultsUnknown.callFacilities.accordion.title")}
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--ijl-muted)] transition-transform flex-shrink-0 ml-2 ${
                      accordionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {accordionOpen && (
                  <div className="px-6 pb-6 space-y-4">
                    <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      {t("resultsUnknown.callFacilities.accordion.intro")}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-[var(--font-proxima)] font-bold text-base text-[var(--foreground)]">
                        {t("resultsUnknown.callFacilities.accordion.whatToSay")}
                      </h4>
                      <div className="bg-[#F5F5F4] rounded-lg p-4">
                        <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)] italic">
                          {t("resultsUnknown.callFacilities.accordion.script")}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-[var(--font-proxima)] font-bold text-base text-[var(--foreground)]">
                        {t("resultsUnknown.callFacilities.accordion.tips.label")}
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                        <li>{t("resultsUnknown.callFacilities.accordion.tips.1")}</li>
                        <li>{t("resultsUnknown.callFacilities.accordion.tips.2")}</li>
                        <li>{t("resultsUnknown.callFacilities.accordion.tips.3")}</li>
                        <li>{t("resultsUnknown.callFacilities.accordion.tips.4")}</li>
                      </ul>
                    </div>
                    <div className="bg-[#F5F5F4] rounded-lg p-4 space-y-2">
                      <h4 className="font-[var(--font-proxima)] font-bold text-base text-[var(--foreground)]">
                        {t("resultsUnknown.callFacilities.accordion.rights.title")}
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                        <li>{t("resultsUnknown.callFacilities.accordion.rights.1")}</li>
                        <li>{t("resultsUnknown.callFacilities.accordion.rights.2")}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Facilities intro */}
              <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)] italic">
                {t("resultsUnknown.callFacilities.facilitiesIntro")} {arrestLocation}
              </p>

              {/* Field office card — sourced from field_offices table via county_code */}
              {fieldOffice && (
                <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-2">
                  <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
                    {fieldOffice.office_name}
                  </h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[var(--ijl-muted)] mt-1 flex-shrink-0" />
                    <div className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)]">
                      <div>{fieldOffice.street_address}</div>
                      {fieldOffice.suite_floor && <div>{fieldOffice.suite_floor}</div>}
                      <div>{fieldOffice.city}, {fieldOffice.state} {fieldOffice.zip}</div>
                    </div>
                  </div>
                  {fieldOffice.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[var(--ijl-muted)] flex-shrink-0" />
                      <a
                        href={`tel:${fieldOffice.phone.replace(/\D/g, "")}`}
                        className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)] hover:text-[var(--foreground)]"
                      >
                        {fieldOffice.phone}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Facility cards */}
              {facilities === null ? (
                <p className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)]">
                  Loading...
                </p>
              ) : facilities.length === 0 ? (
                <p className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)]">
                  No facilities found for this area.
                </p>
              ) : (
              <div className="space-y-4">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-2"
                  >
                    <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
                      {facility.name}
                    </h3>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[var(--ijl-muted)] mt-1 flex-shrink-0" />
                      <div className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)]">
                        {facility.address.map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </div>
                    </div>
                    {facility.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[var(--ijl-muted)] flex-shrink-0" />
                        <a
                          href={`tel:${facility.phone}`}
                          className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)] hover:text-[var(--foreground)]"
                        >
                          {facility.phoneDisplay}
                        </a>
                      </div>
                    )}
                    {facility.url && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[var(--ijl-muted)] flex-shrink-0" />
                        <a
                          href={facility.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-[var(--font-proxima)] text-base text-[var(--ijl-accent)] hover:underline"
                        >
                          {facility.urlDisplay}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}

              {/* Bottom nav */}
              <div className="flex justify-between items-center pt-2">
                <Button variant="ghost" onClick={() => setActiveTab("other-searches")}>
                  <ArrowLeft className="w-4 h-4" />
                  {t("resultsUnknown.nav.back")}
                </Button>
                <Button onClick={() => setActiveTab("if-found")}>
                  {t("resultsUnknown.callFacilities.next")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Tab: If You Find Them ─────────────────────────────────── */}
          {activeTab === "if-found" && (
            <div className="space-y-6">
              <h2 className="oswald font-medium text-[24px] ijl-title-color">
                {t("resultsUnknown.ifFound.heading")}
              </h2>
              <p className="font-[var(--font-proxima)] text-[18px] text-[var(--foreground)]">
                {t("resultsUnknown.ifFound.intro")}
              </p>

              {/* Steps card */}
              <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-4">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E6E7E8] flex items-center justify-center">
                    <span className="font-[var(--font-proxima)] font-medium text-[var(--foreground)] text-[14px]">
                      1
                    </span>
                  </div>
                  <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)] pt-1">
                    {t("resultsUnknown.ifFound.step1")}
                  </p>
                </div>
                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E6E7E8] flex items-center justify-center">
                    <span className="font-[var(--font-proxima)] font-medium text-[var(--foreground)] text-[14px]">
                      2
                    </span>
                  </div>
                  <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)] pt-1">
                    {t("resultsUnknown.ifFound.step2")}
                  </p>
                </div>
                {/* Step 3 — contains inline link */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E6E7E8] flex items-center justify-center">
                    <span className="font-[var(--font-proxima)] font-medium text-[var(--foreground)] text-[14px]">
                      3
                    </span>
                  </div>
                  <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)] pt-1">
                    <Link
                      href="/detainee/step-3"
                      className="text-[var(--ijl-accent)] underline font-medium"
                    >
                      {t("resultsUnknown.ifFound.step3.link")}
                    </Link>{" "}
                    {t("resultsUnknown.ifFound.step3.suffix")}
                  </p>
                </div>
              </div>

              {/* Bottom nav */}
              <div className="flex justify-between items-center pt-2">
                <Button variant="ghost" onClick={() => setActiveTab("call-facilities")}>
                  <ArrowLeft className="w-4 h-4" />
                  {t("resultsUnknown.nav.back")}
                </Button>
                <Button onClick={() => setActiveTab("get-help")}>
                  {t("resultsUnknown.ifFound.next")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Tab: Get Help ─────────────────────────────────────────── */}
          {activeTab === "get-help" && (
            <div className="space-y-6">
              <h2 className="oswald font-medium text-[24px] ijl-title-color">
                {t("resultsUnknown.getHelp.heading")}
              </h2>
              <p className="font-[var(--font-proxima)] text-[18px] text-[var(--foreground)]">
                {t("resultsUnknown.getHelp.intro")}
              </p>

              {/* Badge + modal link */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-[#efefef] px-4 py-[6px] rounded-full">
                  <span className="font-[var(--font-proxima)] text-[12px] text-[var(--foreground)]">
                    {t("resultsUnknown.getHelp.badge")}
                  </span>
                </div>
                <button
                  onClick={() => setWhatToExpectOpen(true)}
                  className="font-[var(--font-proxima)] text-[12px] text-[var(--ijl-accent)] underline hover:no-underline"
                >
                  {t("resultsUnknown.getHelp.callLink")}
                </button>
              </div>

              {/* Org cards */}
              {orgs === null ? (
                <p className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)]">
                  Loading...
                </p>
              ) : orgs.length === 0 ? (
                <p className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)]">
                  No organizations found for this area.
                </p>
              ) : (
              <div className="space-y-4">
                {orgs.map((org) => (
                  <div
                    key={org.id}
                    className="border border-[var(--ijl-border)] rounded-[10px] bg-white shadow-sm p-6 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      {org.type === "legal" ? (
                        <Scale className="w-4 h-4 text-[var(--ijl-muted)]" />
                      ) : (
                        <Users className="w-4 h-4 text-[var(--ijl-muted)]" />
                      )}
                      <span className="font-[var(--font-proxima)] text-[12px] uppercase tracking-wide text-[var(--ijl-muted)] font-semibold">
                        {org.type === "legal"
                          ? t("resultsUnknown.getHelp.org.legalSupport")
                          : t("resultsUnknown.getHelp.org.generalSupport")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
                        {org.name}
                      </h3>
                      <p className="font-[var(--font-proxima)] text-[14px] text-[var(--ijl-muted)]">
                        ({org.abbr})
                      </p>
                    </div>
                    <p className="font-[var(--font-proxima)] text-base text-[var(--foreground)]">
                      {org.description}
                    </p>
                    <div className="space-y-2">
                      {org.url && (
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-[var(--ijl-muted)] flex-shrink-0" />
                          <a
                            href={org.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-[var(--font-proxima)] text-base text-[var(--ijl-accent)] hover:underline"
                          >
                            {org.urlDisplay}
                          </a>
                        </div>
                      )}
                      {org.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[var(--ijl-muted)] flex-shrink-0" />
                          <a
                            href={`tel:${org.phone}`}
                            className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)] hover:text-[var(--foreground)]"
                          >
                            {org.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
                          </a>
                        </div>
                      )}
                      {org.hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[var(--ijl-muted)] flex-shrink-0" />
                          <span className="font-[var(--font-proxima)] text-base text-[var(--ijl-muted)]">
                            {org.hours}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              )}

              {/* Bottom nav */}
              <div className="pt-2">
                <Button variant="ghost" onClick={() => setActiveTab("if-found")}>
                  <ArrowLeft className="w-4 h-4" />
                  {t("resultsUnknown.nav.back")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

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
