import { supabase } from "./client";
import { STATE_ABBREVIATIONS } from "@/lib/data/stateAbbreviations";

export type Facility = { id: string; name: string };

export type FacilityDetails = {
  facility_code: string;
  facility_display: string;
  address: string;
  city: string;
  state: string;
  county: string | null;
  zip: string;
  county_code: string | null;
  phone_info: string | null;
  url: string | null;
};

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
    .from("facilities")
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
    .from("facilities")
    .select(
      "facility_code, facility_display, address, city, state, county, zip, county_code, phone_info, url"
    )
    .eq("facility_code", facilityCode)
    .limit(1);

  if (facilityErr || !facilityRows || facilityRows.length === 0) return null;

  const facility = facilityRows[0] as FacilityDetails;
  const { county_code, county, state } = facility;

  // Case 1: county_code is already set — run the standard lookup directly.
  if (county_code) {
    const { fieldOffice, districtCourt, orgs } = await lookupByCountyCode(county_code);
    return { facility, fieldOffice, districtCourt, orgs };
  }

  // Case 2: county_code is missing but the facility has a county name.
  // Derive the county_code by combining the state abbreviation (extracted from
  // any county_district entry for this state) with the facility's county field.
  // e.g. state="Nebraska", county="Lincoln" → stateAbbr="NE" → "NE_Lincoln"
  if (county) {
    const { data: stateRows } = await supabase
      .from("county_district")
      .select("county_code")
      .eq("state", state)
      .limit(1);

    const stateAbbr = stateRows?.[0]?.county_code?.split("_")[0];
    if (stateAbbr) {
      const derivedCountyCode = `${stateAbbr}_${county}`;
      const { fieldOffice, districtCourt, orgs } =
        await lookupByCountyCode(derivedCountyCode);
      return { facility, fieldOffice, districtCourt, orgs };
    }
  }

  // Case 3: no county info at all — return with empty relational data.
  return { facility, fieldOffice: null, districtCourt: null, orgs: [] };
}

export type UnknownResultsData = {
  facilities: FacilityDetails[];
  fieldOffice: FieldOffice | null;
  orgs: LocalOrg[];
};

export async function getUnknownResultsData(
  state: string,
  countyCodes: string[] | null
): Promise<UnknownResultsData> {
  const stateAbbr = countyCodes?.length
    ? countyCodes[0].split("_")[0]
    : (STATE_ABBREVIATIONS[state] ?? null);

  const stateWideCode = stateAbbr ? `${stateAbbr}_All` : null;
  const orgCodes = [
    ...(countyCodes ?? []),
    ...(stateWideCode ? [stateWideCode] : []),
  ];

  const [facResult, fieldOfficeResult, orgResult] = await Promise.all([
    countyCodes?.length
      ? supabase
          .from("facilities")
          .select("facility_code, facility_display, address, city, state, county, zip, county_code, phone_info, url")
          .in("county_code", countyCodes)
          .not("facility_display", "is", null)
          .neq("facility_display", "")
          .order("facility_display")
      : supabase
          .from("facilities")
          .select("facility_code, facility_display, address, city, state, county, zip, county_code, phone_info, url")
          .eq("state", state)
          .not("facility_display", "is", null)
          .neq("facility_display", "")
          .order("facility_display"),

    countyCodes?.length
      ? supabase
          .from("county_field_office")
          .select("field_offices(office_name, street_address, suite_floor, city, state, zip, phone)")
          .in("county_code", countyCodes)
          .limit(1)
      : Promise.resolve({ data: [], error: null }),

    orgCodes.length > 0
      ? supabase
          .from("org_county_coverage")
          .select("local_orgs(id, organization, org_type, email, phone, url, action_text_1, action_text_2)")
          .in("county_code", orgCodes)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (facResult.error) console.error("getUnknownResultsData facilities error:", facResult.error);

  const fieldOfficeRow = (fieldOfficeResult as { data: Array<{ field_offices: unknown }> | null }).data?.[0];
  const fieldOffice = fieldOfficeRow?.field_offices
    ? (fieldOfficeRow.field_offices as unknown as FieldOffice)
    : null;

  const orgs: LocalOrg[] = [];
  const seenIds = new Set<number>();
  for (const row of (orgResult as { data: Array<{ local_orgs: unknown }> | null }).data ?? []) {
    if (!row.local_orgs) continue;
    const org = row.local_orgs as LocalOrg;
    if (!seenIds.has(org.id)) { seenIds.add(org.id); orgs.push(org); }
  }

  // Exclude records sourced from field offices — those have corrupt address data.
  // The correct field office is now returned separately via county_field_office → field_offices.
  const facilities = ((facResult.data ?? []) as FacilityDetails[]).filter(
    (f) => !f.url?.includes("ERROR") && !f.facility_display?.endsWith("Field Office")
  );
  return { facilities, fieldOffice, orgs };
}
