// app/detainee/step-3/page.tsx
"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { FACILITIES_BY_STATE, STATES } from "@/lib/flow/mockData";

export default function Step3DetainedLocationPage() {
  const router = useRouter();
  const { flow, setFlow, hydrated } = useFlowState();
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!flow.arrest.state) router.replace("/detainee/step-1");
    if (flow.detention.knowsWhereHeld === null) router.replace("/detainee/step-2");
    if (flow.detention.knowsWhereHeld === false) router.replace("/detainee/results/unknown");
  }, [hydrated, flow, router]);

  const facilities = useMemo(() => {
    const s = flow.detention.detainedState;
    return s ? FACILITIES_BY_STATE[s] ?? [] : [];
  }, [flow.detention.detainedState]);

  if (!hydrated) return null;

  const stateValid = !!flow.detention.detainedState;
  const facilityValid = !!flow.detention.facilityId;
  const valid = stateValid && facilityValid;

  const onContinue = () => {
    setTouched(true);
    if (!valid) return;
    router.push("/detainee/results/known");
  };

  return (
    <div className="bg-white">
      <div className="border-b border-[#5A5A8A]">
        <Container>
          <div className="py-6">
            <Link href="/detainee/step-2" className="inline-flex items-center gap-3 font-[var(--font-proxima)] text-[14px] leading-[20px] text-[#2F2E2E]">
              <span aria-hidden className="text-lg">←</span>
              Back
            </Link>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex flex-col items-center gap-3 px-4 py-6">
          <h1 className="oswald font-medium text-[32px] leading-[47px] text-center ijl-title-color">
            Where is the person detained?
          </h1>

          <p className="font-[var(--font-proxima)] text-[16px] leading-[21px] text-center text-[#5A5A8A] max-w-[560px] mt-3">
            Select the detained state and detention facility.
          </p>

          <div className="mt-6 w-full max-w-[640px] bg-white border border-[#E6E7E8] rounded-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.12)] p-6">
            <label className="block font-[var(--font-proxima)] font-semibold text-[#2F2E2E]">
              State <span className="text-[#5A5A8A]">(Required)</span>
            </label>

            <select
              className="mt-2 w-full rounded-[10px] bg-[#F3F5F7] px-4 py-3 font-[var(--font-proxima)]"
              value={flow.detention.detainedState ?? ""}
              onChange={(e) => {
                const next = e.target.value || null;
                setFlow((prev) => ({
                  ...prev,
                  detention: {
                    ...prev.detention,
                    detainedState: next,
                    facilityId: null,
                  },
                }));
              }}
            >
              <option value="">Select a state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {flow.detention.detainedState && (
              <div className="mt-6">
                <label className="block font-[var(--font-proxima)] font-semibold text-[#2F2E2E]">
                  Detention Facility <span className="text-[#5A5A8A]">(Required)</span>
                </label>

                <select
                  className="mt-2 w-full rounded-[10px] bg-[#F3F5F7] px-4 py-3 font-[var(--font-proxima)]"
                  value={flow.detention.facilityId ?? ""}
                  onChange={(e) =>
                    setFlow((prev) => ({
                      ...prev,
                      detention: { ...prev.detention, facilityId: e.target.value || null },
                    }))
                  }
                >
                  <option value="">Select a facility</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {touched && !valid && (
              <div className="mt-3 text-sm font-[var(--font-proxima)] text-red-600">
                Please select the required fields to continue.
              </div>
            )}

            <button
              type="button"
              onClick={onContinue}
              className="mt-8 w-full rounded-[10px] bg-[#0A0A14] py-3 font-[var(--font-proxima)] font-semibold text-white"
            >
              Continue
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
