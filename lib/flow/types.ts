export type ArrestLocation = {
  state: string;
  city: string | null;
  county_codes: string[] | null;
};

export type DetentionInfo = {
  knowsWhereHeld: boolean | null; // required at the detention step
  detainedState: string | null;   // required if knowsWhereHeld === true
  facilityId: string | null;      // required if knowsWhereHeld === true
};

export type FlowState = {
  arrest: ArrestLocation;
  detention: DetentionInfo;
};
