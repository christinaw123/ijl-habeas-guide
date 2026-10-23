export type ArrestLocation = {
  state: string;
  city: string | null;
  county_codes: string[] | null;
  // True when the user picked "My city isn't listed": results fall back to the whole state.
  // Missing from sessions saved before the city became required.
  cityNotListed: boolean;
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
