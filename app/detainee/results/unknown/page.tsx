"use client";

import Container from "@/components/Container";
import Link from "next/link";

export default function UnknownResults() {
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
        <div className="px-4 py-8">
          <h1 className="oswald font-medium text-[32px] leading-[47px] ijl-title-color text-center">
            We don’t have the detention location
          </h1>
          <p className="font-[var(--font-proxima)] mt-4 text-center">
            Placeholder page for users who don’t know where the person is being held. We’ll create tailored resources here.
          </p>
        </div>
      </Container>
    </div>
  );
}
