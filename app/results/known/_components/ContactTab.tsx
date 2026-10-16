"use client";

import { Phone, Globe, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { sanitizeUrl, primaryFacilityUrl } from "@/lib/utils";
import type { FacilityDetails } from "@/server/types";

export default function ContactTab({
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
          {(facility?.address_standardized || facility?.city) && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[var(--muted-foreground)] mt-1 shrink-0" />
              <div className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)]">
                {facility?.address_standardized && <div>{facility.address_standardized}</div>}
                {facility?.city && (
                  <div>
                    {facility.city}, {facility.state} {facility.zip}
                  </div>
                )}
              </div>
            </div>
          )}
          {facility?.display_telephone_number && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
              <span className="font-[var(--font-proxima)] text-[16px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                {facility.display_telephone_number}
              </span>
            </div>
          )}
          {facility && sanitizeUrl(primaryFacilityUrl(facility)) && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
              <a
                href={sanitizeUrl(primaryFacilityUrl(facility))!}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[var(--font-proxima)] text-[16px] text-[var(--ijl-accent)] hover:underline break-all"
              >
                {primaryFacilityUrl(facility)!.replace(/^https?:\/\//, "")}
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
