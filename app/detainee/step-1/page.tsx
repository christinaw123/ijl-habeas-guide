// app/detainee/step-1/page.tsx
"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { COUNTIES_BY_STATE, STATES } from "@/lib/flow/mockData";

export default function Step1ArrestLocationPage() {
  const router = useRouter();
  const { flow, setFlow, hydrated } = useFlowState();
  const [touched, setTouched] = useState(false);

  const counties = useMemo(() => {
    return flow.arrest.state ? COUNTIES_BY_STATE[flow.arrest.state] ?? [] : [];
  }, [flow.arrest.state]);

  if (!hydrated) return null;

  const stateValid = flow.arrest.state.trim().length > 0;

  const onContinue = () => {
    setTouched(true);
    if (!stateValid) return;
    router.push("/detainee/step-2");
  };

  return (
    <div className="bg-white">
      <div className="border-b border-[#5A5A8A]">
        <Container>
          <div className="py-6">
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-[var(--font-proxima)] text-[14px] leading-[20px] text-[#2F2E2E]"
            >
              <span aria-hidden className="text-lg">←</span>
              Back
            </Link>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex flex-col items-center gap-3 px-4 py-6">
          <h1 className="oswald font-medium text-[32px] leading-[47px] text-center ijl-title-color">
            Where was the person arrested?
          </h1>

          <p className="font-[var(--font-proxima)] font-normal text-[16px] leading-[21px] text-center text-[#000000] px-[10px] py-4 max-w-[600px]">
            Select the state (required) and county (optional) where the arrest occurred.
          </p>

          <div className="mt-6 w-full max-w-[640px] bg-white border border-[#E6E7E8] rounded-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.12)] p-6">
            <label className="block font-[var(--font-proxima)] font-semibold text-[#2F2E2E]">
              State <span className="text-[#5A5A8A]">(Required)</span>
            </label>

            <select
              className="mt-2 w-full rounded-[10px] bg-[#F3F5F7] px-4 py-3 font-[var(--font-proxima)]"
              value={flow.arrest.state}
              onChange={(e) => {
                const nextState = e.target.value;
                setFlow((prev) => ({
                  ...prev,
                  arrest: { state: nextState, county: null },
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

            {touched && !stateValid && (
              <div className="mt-2 text-sm font-[var(--font-proxima)] text-red-600">
                Please select a state to continue.
              </div>
            )}

            {flow.arrest.state && (
              <div className="mt-6">
                <label className="block font-[var(--font-proxima)] font-semibold text-[#2F2E2E]">
                  County <span className="text-[#5A5A8A]">(Optional)</span>
                </label>

                <select
                  className="mt-2 w-full rounded-[10px] bg-[#F3F5F7] px-4 py-3 font-[var(--font-proxima)]"
                  value={flow.arrest.county ?? "__unknown__"}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFlow((prev) => ({
                      ...prev,
                      arrest: { ...prev.arrest, county: v === "__unknown__" ? null : v },
                    }));
                  }}
                >
                  <option value="__unknown__">I don’t know the county</option>
                  {counties.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
