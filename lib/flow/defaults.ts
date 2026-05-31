import type { DetaineeFlowState } from "./types";

export const defaultFlowState: DetaineeFlowState = {
  arrest: { state: "", city: null, county_codes: null },
  detention: { knowsWhereHeld: null, detainedState: null, facilityId: null },
};
