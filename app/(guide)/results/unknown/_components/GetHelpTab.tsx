"use client";

import { Phone, Scale, Users, Clock, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { sanitizeUrl } from "@/lib/utils";
import type { Tab, Org } from "./types";

export default function GetHelpTab({
  orgs,
  onWhatToExpectClick,
  onNavigate,
}: {
  orgs: Org[] | null;
  onWhatToExpectClick: () => void;
  onNavigate: (tab: Tab) => void;
}) {
  const { t } = useLanguage();
  return (
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
          onClick={onWhatToExpectClick}
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
              {sanitizeUrl(org.url) && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[var(--ijl-muted)] flex-shrink-0" />
                  <a
                    href={sanitizeUrl(org.url)!}
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
        <Button variant="ghost" onClick={() => onNavigate("if-found")}>
          <ArrowLeft className="w-4 h-4" />
          {t("resultsUnknown.nav.back")}
        </Button>
      </div>
    </div>
  );
}
