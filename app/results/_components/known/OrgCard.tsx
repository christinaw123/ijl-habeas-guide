"use client";

import { Phone, Mail, Scale, Users, Clock, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { sanitizeUrl } from "@/lib/utils";
import type { LocalOrg } from "@/server/types";

export default function OrgCard({ org }: { org: LocalOrg }) {
  const { t } = useLanguage();
  const isLegal = org.org_type === "legal";
  return (
    <div className="border border-(--ijl-border) rounded-[10px] bg-white p-6 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        {isLegal ? (
          <Scale className="w-4 h-4 text-(--muted-foreground)" />
        ) : (
          <Users className="w-4 h-4 text-(--muted-foreground)" />
        )}
        <span className="font-proxima text-[12px] uppercase tracking-wide text-(--muted-foreground) font-semibold">
          {isLegal
            ? t("resultsKnown.org.legalSupport")
            : t("resultsKnown.org.generalSupport")}
        </span>
      </div>

      <h3 className="font-proxima font-bold text-[18px] text-(--card-foreground)">
        {org.organization}
      </h3>

      {org.action_text && (
        <p className="font-proxima text-[16px] text-foreground">
          {org.action_text}
        </p>
      )}

      <div className="space-y-2 pt-1">
        {sanitizeUrl(org.url) && (
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-(--muted-foreground) shrink-0" />
            <a
              href={sanitizeUrl(org.url)!}
              target="_blank"
              rel="noopener noreferrer"
              className="font-proxima text-[16px] text-(--ijl-accent) hover:underline break-all"
            >
              {org.url!.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
        {org.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-(--muted-foreground) shrink-0" />
            <a
              href={`tel:${org.phone.replace(/\D/g, "")}`}
              className="font-proxima text-[16px] text-(--muted-foreground) hover:text-foreground"
            >
              {org.phone}
            </a>
          </div>
        )}
        {org.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-(--muted-foreground) shrink-0" />
            <a
              href={`mailto:${org.email}`}
              className="font-proxima text-[16px] text-(--ijl-accent) hover:underline"
            >
              {org.email}
            </a>
          </div>
        )}
        {/* This slot previously read action_text_2, a column that never existed in
            local_orgs. The Sheet of Record now carries a real `response time`, which is
            what the clock was always for. */}
        {org.response_time && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-(--muted-foreground) shrink-0" />
            <span className="font-proxima text-[16px] text-(--muted-foreground)">
              {org.response_time}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
