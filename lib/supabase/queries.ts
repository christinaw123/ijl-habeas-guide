import { supabase } from "./client";
import { STATE_ABBREVIATIONS } from "@/lib/data/stateAbbreviations";
import { haversineDistanceMiles } from "@/lib/geo";

export type Facility = { id: string; name: string };

export type FacilityDetails = {
  facility_code: string;
  facility_display: string;
  address_standardized: string;
  city: string;
  state: string;
  zip: string;
  county_code: string | null;
  ICE_url: string | null;
  facility_url: string | null;
  display_telephone_number: string | null;
  flag_generic_fo_url: string | null;
  latitude: number | null;
  longitude: number | null;
};

const FACILITY_COLUMNS =
  "facility_code, facility_display, address_standardized, city, state, zip, county_code, ICE_url, facility_url, display_telephone_number, flag_generic_fo_url, latitude, longitude";

// county_code is legal-but-unusable when blank or "{ST}_" with no county part
// (e.g. Guantánamo) — the contract requires omitting district info, not erroring.
function hasUsableCountyCode(countyCode: string | null): countyCode is string {
  return !!countyCode && !/^[^_]*_$/.test(countyCode);
}

export type FieldOffice = {
  office_name: string;
  street_address: string;
  suite_floor: string | null;
  city: string;
  state: string;
  zip: string;
  phone: string;
};

export type DistrictCourt = {
  display_name: string;
  display_address: string | null;
  main_url: string | null;
  telephone_number: string | null;
  website_url: string | null;
};

export type LocalOrg = {
  id: number;
  organization: string;
  org_type: string | null;
  email: string | null;
  phone: string | null;
  url: string | null;
  action_text_1: string | null;
  action_text_2: string | null;
};

export type ResultsData = {
  facility: FacilityDetails;
  fieldOffice: FieldOffice | null;
  districtCourt: DistrictCourt | null;
  orgs: LocalOrg[];
};

export async function getCountiesByState(state: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("county_field_office")
    .select("county")
    .eq("state", state)
    .order("county");

  if (error) { console.error("getCountiesByState error:", error); return []; }
  if (!data) return [];

  // Deduplicate — .select distinct isn't supported directly in the JS client
  const seen = new Set<string>();
  const counties: string[] = [];
  for (const row of data) {
    if (row.county && !seen.has(row.county)) {
      seen.add(row.county);
      counties.push(row.county);
    }
  }
  return counties;
}

export async function getFacilitiesByState(state: string): Promise<Facility[]> {
  const { data, error } = await supabase
    .from("facilities_live")
    .select("facility_code, facility_display")
    .eq("state", state)
    .not("facility_code", "is", null)
    .not("facility_display", "is", null)
    .neq("facility_display", "")
    .order("facility_display");

  if (error) {
    console.error("getFacilitiesByState error:", error);
    return [];
  }
  if (!data) return [];

  return data
    .filter((row) => row.facility_code && row.facility_display?.trim())
    .map((row) => ({ id: row.facility_code, name: row.facility_display }));
}

// Run the standard field-office / district / orgs lookup for a known county_code.
async function lookupByCountyCode(countyCode: string) {
  const stateAbbr = countyCode.split("_")[0];
  const stateWideCoverageCode = `${stateAbbr}_All`;

  const [fieldOfficeResult, countyDistResult, stateDistResult, orgsResult] =
    await Promise.all([
      supabase
        .from("county_field_office")
        .select("field_offices(office_name, street_address, suite_floor, city, state, zip, phone)")
        .eq("county_code", countyCode)
        .limit(1),

      supabase
        .from("county_district")
        .select("district")
        .eq("county_code", countyCode)
        .limit(1),

      supabase
        .from("county_district")
        .select("district")
        .eq("county_code", stateWideCoverageCode)
        .limit(1),

      supabase
        .from("org_county_coverage")
        .select(
          "local_orgs(id, organization, org_type, email, phone, url, action_text_1, action_text_2)"
        )
        .in("county_code", [countyCode, stateWideCoverageCode]),
    ]);

  const fieldOfficeRow = fieldOfficeResult.data?.[0];
  const fieldOffice =
    fieldOfficeRow?.field_offices
      ? (fieldOfficeRow.field_offices as unknown as FieldOffice)
      : null;

  // Prefer county-level district; fall back to state-wide entry
  const districtName =
    countyDistResult.data?.[0]?.district ??
    stateDistResult.data?.[0]?.district ??
    null;

  // Look up the district court address from us_districts_addresses
  let districtCourt: DistrictCourt | null = null;
  if (districtName) {
    const { data: dcData } = await supabase
      .from("us_districts_addresses")
      .select("display_name, display_address, main_url, telephone_number, website_url")
      .eq("display_name", districtName)
      .limit(1);
    districtCourt = (dcData?.[0] as DistrictCourt) ?? null;
  }

  const orgs: LocalOrg[] = [];
  const seenOrgIds = new Set<number>();
  for (const row of orgsResult.data ?? []) {
    if (!row.local_orgs) continue;
    const org = row.local_orgs as unknown as LocalOrg;
    if (!seenOrgIds.has(org.id)) {
      seenOrgIds.add(org.id);
      orgs.push(org);
    }
  }

  return { fieldOffice, districtCourt, orgs };
}

export async function getResultsData(
  facilityCode: string
): Promise<ResultsData | null> {
  const { data: facilityRows, error: facilityErr } = await supabase
    .from("facilities_live")
    .select(FACILITY_COLUMNS)
    .eq("facility_code", facilityCode)
    .limit(1);

  if (facilityErr || !facilityRows || facilityRows.length === 0) return null;

  const facility = facilityRows[0] as FacilityDetails;

  // county_code missing or "{ST}_"-only (e.g. Guantánamo) — omit district info,
  // do not error, per the data contract's null-safe join rule.
  if (!hasUsableCountyCode(facility.county_code)) {
    return { facility, fieldOffice: null, districtCourt: null, orgs: [] };
  }

  const { fieldOffice, districtCourt, orgs } = await lookupByCountyCode(
    facility.county_code
  );
  return { facility, fieldOffice, districtCourt, orgs };
}

export type UnknownResultsData = {
  facilities: FacilityDetails[];
  fieldOffice: FieldOffice | null;
  orgs: LocalOrg[];
};

export async function getUnknownResultsData(
  state: string,
  countyCodes: string[] | null,
  city: string | null = null
): Promise<UnknownResultsData> {
  const stateAbbr = countyCodes?.length
    ? countyCodes[0].split("_")[0]
    : (STATE_ABBREVIATIONS[state] ?? null);

  const stateWideCode = stateAbbr ? `${stateAbbr}_All` : null;
  const orgCodes = [
    ...(countyCodes ?? []),
    ...(stateWideCode ? [stateWideCode] : []),
  ];

  const [cfoResult, arrestCoordsResult, orgResult] = await Promise.all([
    countyCodes?.length
      ? supabase
          .from("county_field_office")
          .select(
            "field_office, field_offices(office_name, street_address, suite_floor, city, state, zip, phone)"
          )
          .in("county_code", countyCodes)
          .limit(1)
      : Promise.resolve({ data: [], error: null }),

    // The arrest city's own coordinates, to sort the facility list by proximity below.
    countyCodes?.length && city
      ? supabase
          .from("place_county")
          .select("latitude, longitude")
          .eq("place_display", city)
          .in("county_code", countyCodes)
      : Promise.resolve({ data: [], error: null }),

    orgCodes.length > 0
      ? supabase
          .from("org_county_coverage")
          .select("local_orgs(id, organization, org_type, email, phone, url, action_text_1, action_text_2)")
          .in("county_code", orgCodes)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const cfoRow = (
    cfoResult as {
      data: Array<{ field_office: string | null; field_offices: unknown }> | null;
    }
  ).data?.[0];
  // The ICE field office's whole area of responsibility (e.g. "Boston"), not just the
  // arrest county — a county can have zero facilities of its own while still being
  // covered by a field office that runs facilities elsewhere in its AOR.
  const fieldOfficeAor = cfoRow?.field_office ?? null;
  const fieldOffice = cfoRow?.field_offices
    ? (cfoRow.field_offices as unknown as FieldOffice)
    : null;

  const coordRows =
    (arrestCoordsResult as { data: Array<{ latitude: number | null; longitude: number | null }> | null })
      .data ?? [];
  const validCoords = coordRows.filter(
    (r): r is { latitude: number; longitude: number } => r.latitude != null && r.longitude != null
  );
  const arrestCoords = validCoords.length
    ? {
        lat: validCoords.reduce((sum, r) => sum + r.latitude, 0) / validCoords.length,
        lng: validCoords.reduce((sum, r) => sum + r.longitude, 0) / validCoords.length,
      }
    : null;

  const facQuery = fieldOfficeAor
    ? supabase
        .from("facilities_live")
        .select(FACILITY_COLUMNS)
        .eq("ice_field_office", fieldOfficeAor)
        .not("facility_display", "is", null)
        .neq("facility_display", "")
    : countyCodes?.length
      ? supabase
          .from("facilities_live")
          .select(FACILITY_COLUMNS)
          .in("county_code", countyCodes)
          .not("facility_display", "is", null)
          .neq("facility_display", "")
      : supabase
          .from("facilities_live")
          .select(FACILITY_COLUMNS)
          // facilities_live.state is the abbreviation (e.g. "MA"); flow.arrest.state is
          // the full name, so this must go through STATE_ABBREVIATIONS, not eq(state).
          .eq("state", stateAbbr ?? state)
          .not("facility_display", "is", null)
          .neq("facility_display", "");

  const facResult = await facQuery;
  if (facResult.error) console.error("getUnknownResultsData facilities error:", facResult.error);

  const orgs: LocalOrg[] = [];
  const seenIds = new Set<number>();
  for (const row of (orgResult as { data: Array<{ local_orgs: unknown }> | null }).data ?? []) {
    if (!row.local_orgs) continue;
    const org = row.local_orgs as LocalOrg;
    if (!seenIds.has(org.id)) { seenIds.add(org.id); orgs.push(org); }
  }

  const rawFacilities = (facResult.data ?? []) as FacilityDetails[];

  // Sort by proximity to the arrest city when we know where that is; facilities missing
  // coordinates sort to the end. Falls back to alphabetical when we have no arrest coords.
  const facilities = arrestCoords
    ? [...rawFacilities].sort((a, b) => {
        const distA =
          a.latitude != null && a.longitude != null
            ? haversineDistanceMiles(arrestCoords.lat, arrestCoords.lng, a.latitude, a.longitude)
            : Infinity;
        const distB =
          b.latitude != null && b.longitude != null
            ? haversineDistanceMiles(arrestCoords.lat, arrestCoords.lng, b.latitude, b.longitude)
            : Infinity;
        return distA !== distB ? distA - distB : a.facility_display.localeCompare(b.facility_display);
      })
    : [...rawFacilities].sort((a, b) => a.facility_display.localeCompare(b.facility_display));

  return { facilities, fieldOffice, orgs };
}
