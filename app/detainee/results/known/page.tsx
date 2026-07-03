"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import {
  Phone, Globe, Mail, MapPin, Pencil, Scale, Landmark,
  Users, Clock, ExternalLink, X,
} from "lucide-react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type {
  ResultsData,
  LocalOrg,
  FacilityDetails,
  FieldOffice,
  DistrictCourt,
} from "@/lib/supabase/queries";
import { sanitizeUrl } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
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
        aria-labelledby="modal-title"
        className="relative bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded text-[var(--ijl-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2
          id="modal-title"
          className="oswald text-[24px] font-medium text-[var(--ijl-title)] mb-4 pr-8"
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Org card
// ---------------------------------------------------------------------------
function OrgCard({ org }: { org: LocalOrg }) {
  const { t } = useLanguage();
  const isLegal = org.org_type === "legal";
  return (
    <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white p-6 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        {isLegal ? (
          <Scale className="w-4 h-4 text-[var(--muted-foreground)]" />
        ) : (
          <Users className="w-4 h-4 text-[var(--muted-foreground)]" />
        )}
        <span className="font-[var(--font-proxima)] text-[12px] uppercase tracking-wide text-[var(--muted-foreground)] font-semibold">
          {isLegal
            ? t("resultsKnown.org.legalSupport")
            : t("resultsKnown.org.generalSupport")}
        </span>
      </div>

      <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--card-foreground)]">
        {org.organization}
      </h3>

      {org.action_text_1 && (
        <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
          {org.action_text_1}
        </p>
      )}

      <div className="space-y-2 pt-1">
        {sanitizeUrl(org.url) && (
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
            <a
              href={sanitizeUrl(org.url)!}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)] hover:underline break-all"
            >
              {org.url!.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
        {org.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
            <a
              href={`tel:${org.phone.replace(/\D/g, "")}`}
              className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              {org.phone}
            </a>
          </div>
        )}
        {org.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
            <a
              href={`mailto:${org.email}`}
              className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)] hover:underline"
            >
              {org.email}
            </a>
          </div>
        )}
        {org.action_text_2 && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
            <span className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)]">
              {org.action_text_2}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Contact the Person
// ---------------------------------------------------------------------------
function ContactTab({
  facility,
  onCommissaryClick,
}: {
  facility: FacilityDetails | undefined;
  onCommissaryClick: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <h2 className="oswald text-[24px] font-medium text-[var(--ijl-title)]">
        {t("resultsKnown.contact.heading")}
      </h2>

      {/* Facility card */}
      <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white p-6 shadow-sm">
        <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--card-foreground)] mb-3">
          {facility?.facility_display ?? t("resultsKnown.unknownFacility")}
        </h3>
        <div className="space-y-2">
          {(facility?.address || facility?.city) && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[var(--muted-foreground)] mt-1 shrink-0" />
              <div className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)]">
                {facility?.address && <div>{facility.address}</div>}
                {facility?.city && (
                  <div>
                    {facility.city}, {facility.state} {facility.zip}
                  </div>
                )}
              </div>
            </div>
          )}
          {facility?.phone_info && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
              <span className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                {facility.phone_info}
              </span>
            </div>
          )}
          {sanitizeUrl(facility?.url) && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
              <a
                href={sanitizeUrl(facility!.url)!}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)] hover:underline break-all"
              >
                {facility!.url!.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {!facility && (
            <p className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)]">
              {t("resultsKnown.contact.noDetails")}
            </p>
          )}
        </div>
      </div>

      {/* Commissary blurb */}
      <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
        {t("resultsKnown.contact.commissaryIntro")}{" "}
        <button
          onClick={onCommissaryClick}
          className="font-[var(--font-proxima)] text-[14px] text-[var(--ijl-accent)] underline hover:no-underline"
        >
          {t("resultsKnown.contact.commissaryLink")}
        </button>
      </p>

      {/* How to call */}
      <div className="space-y-5">
        <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
          {t("resultsKnown.contact.callHeading")}
        </h3>

        <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
          {t("resultsKnown.contact.callIntro")}
        </p>

        <div className="space-y-2">
          <h4 className="font-[var(--font-proxima)] font-bold text-[16px] text-[var(--foreground)]">
            {t("resultsKnown.contact.whatToSay.label")}
          </h4>
          <div className="bg-[#F5F5F4] rounded-lg p-4">
            <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)] italic">
              {t("resultsKnown.contact.whatToSay.script")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-[var(--font-proxima)] font-bold text-[16px] text-[var(--foreground)]">
            {t("resultsKnown.contact.tips.label")}
          </h4>
          <ul className="list-disc pl-5 space-y-2 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
            <li>{t("resultsKnown.contact.tips.1")}</li>
            <li>{t("resultsKnown.contact.tips.2")}</li>
            <li>{t("resultsKnown.contact.tips.3")}</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-[var(--font-proxima)] font-bold text-[16px] text-[var(--foreground)]">
            {t("resultsKnown.contact.toDetainee.label")}
          </h4>
          <ul className="list-disc pl-5 space-y-2 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
            <li>{t("resultsKnown.contact.toDetainee.1")}</li>
            <li>{t("resultsKnown.contact.toDetainee.2")}</li>
            <li>{t("resultsKnown.contact.toDetainee.3")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Get Help — orgs found
// ---------------------------------------------------------------------------
function GetHelpFoundTab({
  orgs,
  onCallModalClick,
}: {
  orgs: LocalOrg[];
  onCallModalClick: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <h2 className="oswald text-[24px] font-medium text-[var(--ijl-title)]">
        {t("resultsKnown.help.heading")}
      </h2>

      <p className="font-[var(--font-proxima)] text-[18px] text-[var(--foreground)]">
        {t("resultsKnown.help.found.intro")}
      </p>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-[var(--ijl-cta-bg)] px-4 py-1.5 rounded-full">
          <span className="font-[var(--font-proxima)] text-[12px] text-[var(--foreground)]">
            {t("resultsKnown.help.found.badge")}
          </span>
        </div>
        <button
          onClick={onCallModalClick}
          className="font-[var(--font-proxima)] text-[12px] text-[var(--ijl-accent)] underline hover:no-underline"
        >
          {t("resultsKnown.help.found.callLink")}
        </button>
      </div>

      <div className="space-y-4">
        {orgs.map((org) => (
          <OrgCard key={org.id} org={org} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Get Help — no orgs
// ---------------------------------------------------------------------------
function GetHelpNotFoundTab() {
  const { t } = useLanguage();
  const outlineBtn =
    "inline-flex items-center gap-2 h-9 px-3 text-[14px] font-[var(--font-proxima)] font-medium rounded-md border border-[var(--ijl-border)] text-[var(--foreground)] bg-white hover:bg-[var(--ijl-cta-bg)] transition-colors";
  return (
    <div className="space-y-6">
      <h2 className="oswald text-[24px] font-medium text-[var(--ijl-title)]">
        {t("resultsKnown.help.heading")}
      </h2>

      <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
        {t("resultsKnown.help.notFound.intro")}
      </p>

      <div className="space-y-3">
        <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
          {t("resultsKnown.help.notFound.legal.heading")}
        </h3>
        <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
          {t("resultsKnown.help.notFound.legal.desc")}
        </p>
        <a
          href="https://www.immi.org/en/"
          target="_blank"
          rel="noopener noreferrer"
          className={outlineBtn}
        >
          {t("resultsKnown.help.notFound.legal.cta")}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-3">
        <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
          {t("resultsKnown.help.notFound.community.heading")}
        </h3>
        <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
          {t("resultsKnown.help.notFound.community.desc")}
        </p>
        <a
          href="https://www.mutualaidhub.org/"
          target="_blank"
          rel="noopener noreferrer"
          className={outlineBtn}
        >
          {t("resultsKnown.help.notFound.community.cta")}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="border border-[var(--ijl-border)] rounded-lg bg-white p-6 shadow-sm space-y-3">
        <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
          {t("resultsKnown.help.notFound.list.heading")}
        </h3>
        <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
          {t("resultsKnown.help.notFound.list.desc")}
        </p>
        <a href="#" className={outlineBtn}>
          {t("resultsKnown.help.notFound.list.cta")}
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Legal Options
// ---------------------------------------------------------------------------
function LegalOptionsTab({
  fieldOffice,
  districtCourt,
}: {
  fieldOffice: FieldOffice | null | undefined;
  districtCourt: DistrictCourt | null | undefined;
}) {
  const { t } = useLanguage();

  const legalSections: { titleKey: string; bodyKey: string; href?: string }[] = [
    {
      titleKey: "resultsKnown.options.court.title",
      bodyKey: "resultsKnown.options.court.description",
      // href not yet set — immigration court page in progress
    },
    {
      titleKey: "resultsKnown.options.bonds.title",
      bodyKey: "resultsKnown.options.bonds.description",
      href: "/detainee/learn/bonds",
    },
    {
      titleKey: "resultsKnown.options.habeas.title",
      bodyKey: "resultsKnown.options.habeas.description",
      href: "/detainee/learn/habeas",
    },
  ];

  const learnMoreClass =
    "inline-flex items-center h-9 px-3 text-[14px] font-[var(--font-proxima)] font-medium rounded-md border border-[var(--ijl-border)] bg-white transition-colors";

  return (
    <div className="space-y-6">
      <h2 className="oswald text-[24px] font-medium text-[var(--ijl-title)]">
        {t("resultsKnown.legalTab.heading")}
      </h2>

      <div className="space-y-6">
        {legalSections.map((s) => (
          <div key={s.titleKey} className="space-y-3">
            <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
              {t(s.titleKey)}
            </h3>
            <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
              {t(s.bodyKey)}
            </p>
            {s.href ? (
              <Link
                href={s.href}
                className={`${learnMoreClass} text-[var(--foreground)] hover:bg-[var(--ijl-cta-bg)]`}
              >
                {t("resultsKnown.legalTab.learnMore")}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className={`${learnMoreClass} text-[var(--ijl-muted)] cursor-not-allowed opacity-50`}
              >
                {t("resultsKnown.legalTab.learnMore")}
              </button>
            )}
          </div>
        ))}
      </div>

      {(fieldOffice || districtCourt) && (
        <div className="space-y-3 pt-2">
          <h3 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--foreground)]">
            {t("resultsKnown.legalTab.additional.heading")}
          </h3>
          <p className="font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
            {t("resultsKnown.legalTab.additional.intro")}
          </p>

          {fieldOffice && (
            <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="font-[var(--font-proxima)] text-[12px] uppercase tracking-wide text-[var(--muted-foreground)] font-semibold">
                  {t("resultsKnown.other.iceOffice.title")}
                </span>
              </div>
              <h4 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--card-foreground)]">
                {fieldOffice.office_name}
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5 shrink-0" />
                  <div className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)]">
                    <div>{fieldOffice.street_address}</div>
                    {fieldOffice.suite_floor && <div>{fieldOffice.suite_floor}</div>}
                    <div>
                      {fieldOffice.city}, {fieldOffice.state} {fieldOffice.zip}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
                  <a
                    href={`tel:${fieldOffice.phone.replace(/\D/g, "")}`}
                    className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    {fieldOffice.phone}
                  </a>
                </div>
              </div>
            </div>
          )}

          {districtCourt && (
            <div className="border border-[var(--ijl-border)] rounded-[10px] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span className="font-[var(--font-proxima)] text-[12px] uppercase tracking-wide text-[var(--muted-foreground)] font-semibold">
                  {t("resultsKnown.other.court.title")}
                </span>
              </div>
              <h4 className="font-[var(--font-proxima)] font-bold text-[18px] text-[var(--card-foreground)]">
                {districtCourt.display_name}
              </h4>
              <div className="space-y-2">
                {districtCourt.display_address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[var(--muted-foreground)] mt-0.5 shrink-0" />
                    <span className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)]">
                      {districtCourt.display_address}
                    </span>
                  </div>
                )}
                {districtCourt.telephone_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
                    <a
                      href={`tel:${districtCourt.telephone_number.replace(/\D/g, "")}`}
                      className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      {districtCourt.telephone_number}
                    </a>
                  </div>
                )}
                {sanitizeUrl(districtCourt.main_url) && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
                    <a
                      href={sanitizeUrl(districtCourt.main_url)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)] hover:underline break-all"
                    >
                      {districtCourt.main_url!.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {sanitizeUrl(districtCourt.website_url) && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
                    <a
                      href={sanitizeUrl(districtCourt.website_url)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)] hover:underline break-all"
                    >
                      {t("resultsKnown.legalTab.district.habeasLink")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
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
    results?.facility.facility_display ??
    flow.detention.facilityId ??
    t("resultsKnown.unknownFacility");

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
      <BackButton href="/detainee/step-3" label={t("resultsKnown.back")} />
      <div className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Title */}
          <h1 className="oswald text-[36px] font-medium text-[var(--ijl-title)] leading-[1.3]">
            {t("resultsKnown.title")}
          </h1>

          {/* Location badges */}
          <div className="space-y-2">
            <button
              onClick={() => router.push("/detainee/step-1")}
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
              onClick={() => router.push("/detainee/step-3")}
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
