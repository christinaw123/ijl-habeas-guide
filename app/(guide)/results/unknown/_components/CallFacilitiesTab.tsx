"use client";

import { Phone, Globe, MapPin, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { sanitizeUrl } from "@/lib/utils";
import type { Tab, Facility } from "./types";

export default function CallFacilitiesTab({
  facilities,
  arrestLocation,
  accordionOpen,
  onToggleAccordion,
  onNavigate,
}: {
  facilities: Facility[] | null;
  arrestLocation: string;
  accordionOpen: boolean;
  onToggleAccordion: () => void;
  onNavigate: (tab: Tab) => void;
}) {
  const { t } = useLanguage();
  return (
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
          onClick={onToggleAccordion}
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
            {sanitizeUrl(facility.url) && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[var(--ijl-muted)] flex-shrink-0" />
                <a
                  href={sanitizeUrl(facility.url)!}
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
        <Button variant="ghost" onClick={() => onNavigate("other-searches")}>
          <ArrowLeft className="w-4 h-4" />
          {t("resultsUnknown.nav.back")}
        </Button>
        <Button onClick={() => onNavigate("if-found")}>
          {t("resultsUnknown.callFacilities.next")}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
