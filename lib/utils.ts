import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SAFE_URL_SCHEMES = ["http:", "https:", "tel:", "mailto:"];

export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return SAFE_URL_SCHEMES.includes(parsed.protocol) ? url : null;
  } catch {
    return null;
  }
}

// Picks the single best "facility page" link to show. Prefers the facility's
// own site; falls back to its ICE page, but never when that ICE page is
// flagged as a shared field-office URL (flag_generic_fo_url) — per the data
// contract, that must never be presented as "the facility's own page."
export function primaryFacilityUrl(facility: {
  facility_url: string | null;
  ICE_url: string | null;
  flag_generic_fo_url: string | null;
}): string | null {
  if (facility.facility_url) return facility.facility_url;
  if (facility.ICE_url && facility.flag_generic_fo_url !== "generic-FO-url") {
    return facility.ICE_url;
  }
  return null;
}
