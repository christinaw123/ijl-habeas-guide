// View-model types for the unknown-location results page.

export type Tab = "search-ice" | "other-searches" | "call-facilities" | "if-found" | "get-help";

export type Facility = {
  id: string;
  name: string;
  address: string[];
  phone?: string;
  phoneDisplay?: string;
  url?: string;
  urlDisplay?: string;
};

export type Org = {
  id: string;
  type: "general" | "legal";
  name: string;
  abbr: string;
  description: string;
  url?: string;
  urlDisplay?: string;
  phone?: string;
  hours?: string;
};
