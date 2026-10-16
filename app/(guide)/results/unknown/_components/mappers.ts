// Map Supabase rows to the view-model types the tabs render.
import type { FacilityDetails, LocalOrg } from "@/server/types";
import { primaryFacilityUrl } from "@/lib/utils";
import type { Facility, Org } from "./types";

export function toFacility(f: FacilityDetails): Facility {
  const lines: string[] = [];
  if (f.address_standardized) lines.push(f.address_standardized);
  lines.push(`${f.city}, ${f.state} ${f.zip}`.trim());
  const phoneRaw = f.display_telephone_number?.replace(/\D/g, "") || undefined;
  const url = primaryFacilityUrl(f) ?? undefined;
  return {
    id: f.facility_code,
    name: f.facility_display,
    address: lines,
    phone: phoneRaw,
    phoneDisplay: f.display_telephone_number ?? undefined,
    url,
    urlDisplay: url?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? undefined,
  };
}

export function toOrg(o: LocalOrg): Org {
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
    description: o.action_text ?? o.description ?? "",
    url: o.url ?? undefined,
    urlDisplay: o.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") ?? undefined,
    phone: o.phone?.replace(/\D/g, "") || undefined,
  };
}
