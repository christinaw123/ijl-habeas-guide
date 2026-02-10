import type { DetaineeFlowState } from "./types";

export const defaultFlowState: DetaineeFlowState = {
  arrest: { state: "", county: null },
  detention: { knowsWhereHeld: null, detainedState: null, facilityId: null },
};
