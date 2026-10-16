"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFlowState } from "@/lib/flow/useFlowState";
import { ROUTES } from "@/lib/routes";
import KnownResults from "./_components/known/KnownResults";
import UnknownResults from "./_components/unknown/UnknownResults";

// One results page; the layout depends on whether the user knows where the
// person is held (answered on /detention, facility picked on /facility).
export default function ResultsPage() {
  const router = useRouter();
  const { flow, hydrated } = useFlowState();

  // Send the user back to the first step they haven't answered yet.
  const redirectTo = !hydrated
    ? null
    : !flow.arrest.state
      ? ROUTES.arrest
      : flow.detention.knowsWhereHeld === null
        ? ROUTES.detention
        : flow.detention.knowsWhereHeld && !flow.detention.facilityId
          ? ROUTES.facility
          : null;

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  if (!hydrated || redirectTo) return null;

  return flow.detention.knowsWhereHeld ? (
    <KnownResults flow={flow} />
  ) : (
    <UnknownResults flow={flow} />
  );
}
