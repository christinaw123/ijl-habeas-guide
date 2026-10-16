// localStorage keys used by the guide flow.

// Value is kept as-is from before the route rename so in-progress sessions survive.
export const FLOW_STORAGE_KEY = "ijl_detainee_flow_v1";

// Where /loading should send the user next ("results" or the facility step).
// Written synchronously by the caller right before navigating to /loading.
export const LOADING_NEXT_KEY = "ijl_loading_next";
