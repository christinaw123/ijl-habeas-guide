"use client";

import { useEffect, useState } from "react";
import { FLOW_STORAGE_KEY } from "./types";
import { defaultFlowState } from "./defaults";
import type { DetaineeFlowState } from "./types";

export function useFlowState() {
  const [flow, setFlow] = useState<DetaineeFlowState>(defaultFlowState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FLOW_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DetaineeFlowState;
        setFlow((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      // ignore parse errors
      // console.warn("flow parse", err);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(flow));
    } catch (err) {
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
