export type ArrestLocation = {
    state: string;              // required
    county: string | null;      // optional, null means unknown
  };
  
  export type DetentionInfo = {
    knowsWhereHeld: boolean | null; // required at step 2
    detainedState: string | null;   // required if knowsWhereHeld === true
    facilityId: string | null;      // required if knowsWhereHeld === true
  };
  
  export type DetaineeFlowState = {
    arrest: ArrestLocation;
    detention: DetentionInfo;
  };
  
  export const FLOW_STORAGE_KEY = "ijl_detainee_flow_v1";
  