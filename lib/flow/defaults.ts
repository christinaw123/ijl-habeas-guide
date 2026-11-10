import type { FlowState } from "./types";

export const defaultFlowState: FlowState = {
  arrest: { state: "", city: null, county_codes: null, cityNotListed: false },
  detention: { knowsWhereHeld: null, detainedState: null, facilityId: null },
};
