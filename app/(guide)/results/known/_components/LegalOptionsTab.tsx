"use client";

import Link from "next/link";
import { Phone, Globe, MapPin, Scale, Landmark, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { sanitizeUrl } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { FieldOffice, DistrictCourt } from "@/lib/supabase/queries";

export default function LegalOptionsTab({
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
      href: ROUTES.learnBonds,
    },
    {
      titleKey: "resultsKnown.options.habeas.title",
      bodyKey: "resultsKnown.options.habeas.description",
      href: ROUTES.learnHabeas,
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
