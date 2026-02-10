"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useFlowState } from "@/lib/flow/useFlowState";

export default function KnownResults() {
  const { flow } = useFlowState();

  return (
    <div className="bg-white">
      <div className="border-b border-[#5A5A8A]">
        <Container>
          <div className="py-6">
            <Link
              href="/detainee/step-3"
              className="inline-flex items-center gap-3 font-[var(--font-proxima)] text-[14px] leading-[20px] text-[#2F2E2E]"
            >
              <span aria-hidden className="text-lg">←</span>
              Back
            </Link>
          </div>
        </Container>
      </div>

      <Container>
        <div className="px-4 py-8">
          <h1 className="oswald font-medium text-[32px] leading-[47px] ijl-title-color text-center">
            Resources for {flow.arrest.state || "your state"}
          </h1>

          <p className="font-[var(--font-proxima)] mt-4 text-center">
            Placeholder results page for users who provided detained location.
          </p>
        </div>
      </Container>
    </div>
  );
}
