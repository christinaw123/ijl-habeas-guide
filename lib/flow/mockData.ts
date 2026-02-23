import US_STATES from "@/lib/data/usStates.json";

export const STATES = US_STATES;
export const COUNTIES_BY_STATE: Record<string, string[]> = {
  Colorado: ["Denver County", "El Paso County", "Jefferson County"],
  Florida: ["Miami-Dade County", "Orange County", "Palm Beach County"],
  Hawaii: ["Honolulu County", "Maui County", "Hawaii County"],
};

export type Facility = { id: string; name: string };

export const FACILITIES_BY_STATE: Record<string, Facility[]> = {
  Florida: [
    { id: "fl_facility_a", name: "Central Detention Center" },
    { id: "fl_facility_b", name: "Southside Detention Facility" },
  ],
  Colorado: [
    { id: "co_facility_a", name: "Denver Processing Center" },
  ],
  Hawaii: [
    { id: "hi_facility_a", name: "Honolulu Holding Center" },
  ],
};
