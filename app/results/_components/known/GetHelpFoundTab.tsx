"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { LocalOrg } from "@/server/types";
import OrgCard from "./OrgCard";

export default function GetHelpFoundTab({
  orgs,
  onCallModalClick,
}: {
  orgs: LocalOrg[];
  onCallModalClick: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <h2 className="oswald text-[24px] font-medium text-(--ijl-title)">
        {t("resultsKnown.help.heading")}
      </h2>

      <p className="font-proxima text-[18px] text-foreground">
        {t("resultsKnown.help.found.intro")}
      </p>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-(--ijl-cta-bg) px-4 py-1.5 rounded-full">
          <span className="font-proxima text-[12px] text-foreground">
            {t("resultsKnown.help.found.badge")}
          </span>
        </div>
        <button
          onClick={onCallModalClick}
          className="font-proxima text-[12px] text-(--ijl-accent) underline hover:no-underline"
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
