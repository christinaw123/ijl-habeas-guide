"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SetStateAction } from "react";
import { FLOW_STORAGE_KEY } from "./storageKeys";
import { defaultFlowState } from "./defaults";
import type { FlowState } from "./types";

export function isValidFlowState(v: unknown): v is FlowState {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  const obj = v as Record<string, unknown>;
  if (typeof obj.arrest !== "object" || obj.arrest === null || Array.isArray(obj.arrest)) return false;
  if (typeof obj.detention !== "object" || obj.detention === null || Array.isArray(obj.detention)) return false;
  const a = obj.arrest as Record<string, unknown>;
  const d = obj.detention as Record<string, unknown>;
  if (typeof a.state !== "string" || a.state.length > 200) return false;
  if (a.city !== null && a.city !== undefined && (typeof a.city !== "string" || a.city.length > 300)) return false;
  if (a.county_codes !== null && a.county_codes !== undefined) {
    if (!Array.isArray(a.county_codes) || a.county_codes.length > 50) return false;
    if (a.county_codes.some((c) => typeof c !== "string" || c.length > 100)) return false;
  }
  if (a.cityNotListed !== undefined && typeof a.cityNotListed !== "boolean") return false;
  if (d.knowsWhereHeld !== null && d.knowsWhereHeld !== undefined && typeof d.knowsWhereHeld !== "boolean") return false;
  if (d.detainedState !== null && d.detainedState !== undefined && (typeof d.detainedState !== "string" || d.detainedState.length > 200)) return false;
  if (d.facilityId !== null && d.facilityId !== undefined && (typeof d.facilityId !== "string" || d.facilityId.length > 500)) return false;
  return true;
}

// useLayoutEffect fires before the browser paints (eliminates the null flash).
// On the server it doesn't exist, so fall back to useEffect for SSR safety.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useFlowState() {
  const [flow, setFlowState] = useState<FlowState>(defaultFlowState);
  const [hydrated, setHydrated] = useState(false);
  // Latest flow + hydration status, readable synchronously inside setFlow.
  const flowRef = useRef<FlowState>(defaultFlowState);
  const hydratedRef = useRef(false);

  // Read localStorage synchronously before the first paint so pages never
  // render their `if (!hydrated) return null` blank state visibly.
  useIsomorphicLayoutEffect(() => {
    try {
      const raw = localStorage.getItem(FLOW_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isValidFlowState(parsed)) {
          flowRef.current = { ...defaultFlowState, ...parsed };
          setFlowState(flowRef.current);
        } else {
          localStorage.removeItem(FLOW_STORAGE_KEY);
        }
      }
    } catch {
      // ignore parse errors
    } finally {
      hydratedRef.current = true;
      setHydrated(true);
    }
  }, []);

  // Persist synchronously, so a page can call setFlow and then navigate
  // immediately: the next page reads localStorage on mount and must see it.
  const setFlow = useCallback((action: SetStateAction<FlowState>) => {
    const next = typeof action === "function" ? action(flowRef.current) : action;
    flowRef.current = next;
    if (hydratedRef.current) {
      try {
        localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
    }
    setFlowState(next);
  }, []);

  // Fallback write-back whenever flow changes (after hydration to avoid clobbering).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(flow));
    } catch {
      // ignore storage errors
    }
  }, [flow, hydrated]);

  const reset = () => {
    try {
      localStorage.removeItem(FLOW_STORAGE_KEY);
    } catch {}
    flowRef.current = defaultFlowState;
    hydratedRef.current = true;
    setFlowState(defaultFlowState);
    setHydrated(true);
  };

  return { flow, setFlow, hydrated, reset };
}
