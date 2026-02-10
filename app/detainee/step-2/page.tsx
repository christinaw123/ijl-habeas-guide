// app/detainee/step-2/page.tsx
"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFlowState } from "@/lib/flow/useFlowState";

export default function Step2KnowsWhereHeldPage() {
  const router = useRouter();
  const { flow, setFlow, hydrated } = useFlowState();
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!flow.arrest.state) router.replace("/detainee/step-1");
  }, [hydrated, flow.arrest.state, router]);

  if (!hydrated) return null;

  const valid = flow.detention.knowsWhereHeld !== null;

  const onContinue = () => {
    setTouched(true);
    if (!valid) return;

    if (flow.detention.knowsWhereHeld === false) {
      router.push("/detainee/results/unknown");
      return;
    }
    router.push("/detainee/step-3");
  };

  return (
    <div className="bg-white">
      <div className="border-b border-[#5A5A8A]">
        <Container>
          <div className="py-6">
            <Link href="/detainee/step-1" className="inline-flex items-center gap-3 font-[var(--font-proxima)] text-[14px] leading-[20px] text-[#2F2E2E]">
              <span aria-hidden className="text-lg">←</span>
              Back
            </Link>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex flex-col items-center gap-3 px-4 py-6">
          <h1 className="oswald font-medium text-[32px] leading-[47px] text-center ijl-title-color">
            Do you know where the person is being held?
          </h1>

          <div className="mt-6 w-full max-w-[640px] bg-white border border-[#E6E7E8] rounded-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.12)] p-6">
            <div className="flex flex-col gap-4">
              {[{ label: "Yes", value: true }, { label: "No", value: false }].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() =>
                    setFlow((prev) => ({
                      ...prev,
                      detention: {
                        ...prev.detention,
                        knowsWhereHeld: opt.value,
                        detainedState: opt.value ? prev.detention.detainedState : null,
                        facilityId: opt.value ? prev.detention.facilityId : null,
                      },
                    }))
                  }
                  className={[
                    "w-full rounded-[10px] border px-4 py-4 text-left font-[var(--font-proxima)]",
                    flow.detention.knowsWhereHeld === opt.value ? "border-[#5A5A8A]" : "border-[#E6E7E8]",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {touched && !valid && (
              <div className="mt-3 text-sm font-[var(--font-proxima)] text-red-600">
                Please select Yes or No to continue.
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
