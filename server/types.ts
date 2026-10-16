// Shapes returned by the /api/* routes. This is the one file in server/ that
// frontend code may import from (type-only), since it's the API contract.

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

// Mirrors the `local_orgs` table as loaded from the Sheet of Record's local_orgs tab.
// `id` is a uuid. `org_type` carries combined values straight from the sheet (e.g.
// "legal, social", plus "bond" / "social"), so test it with care — an exact === "legal"
// comparison misses the combined ones.
export type LocalOrg = {
  id: string;
  organization: string;
  org_type: string | null;
  email: string | null;
  phone: string | null;
  url: string | null;
  description: string | null;
  action_text: string | null;
  form_url: string | null;
  response_time: string | null;
  languages: string | null;
  address: string | null;
};

export type ResultsData = {
  facility: FacilityDetails;
  fieldOffice: FieldOffice | null;
  districtCourt: DistrictCourt | null;
  orgs: LocalOrg[];
};

export type UnknownResultsData = {
  facilities: FacilityDetails[];
  fieldOffice: FieldOffice | null;
  orgs: LocalOrg[];
};

export type PlaceResult = {
  place_display: string;
  county_codes: string[];
};
