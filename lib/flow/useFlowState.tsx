"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { FLOW_STORAGE_KEY } from "./types";
import { defaultFlowState } from "./defaults";
import type { DetaineeFlowState } from "./types";

// useLayoutEffect fires before the browser paints (eliminates the null flash).
// On the server it doesn't exist, so fall back to useEffect for SSR safety.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useFlowState() {
  const [flow, setFlow] = useState<DetaineeFlowState>(defaultFlowState);
  const [hydrated, setHydrated] = useState(false);

  // Read localStorage synchronously before the first paint so pages never
  // render their `if (!hydrated) return null` blank state visibly.
  useIsomorphicLayoutEffect(() => {
    try {
      const raw = localStorage.getItem(FLOW_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DetaineeFlowState;
        setFlow((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    } finally {
      setHydrated(true);
    }
  }, []);

  // Write back whenever flow changes (after hydration to avoid clobbering).
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
    setFlow(defaultFlowState);
    setHydrated(true);
  };

  return { flow, setFlow, hydrated, reset };
}
