"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC]">
      <main className="px-4 py-8 md:py-16">
        <div className="mx-auto flex flex-col gap-8 max-w-[640px]">
          {/* Title + description */}
          <section className="flex flex-col gap-4">
            <h1 className="oswald font-regular text-[32px] leading-[42px] text-[#0F172B]">
              Have you or someone you know been detained by immigration
              officials?
            </h1>

            <p className="font-[var(--font-proxima)] font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-[#45556C]">
              Use this tool to find information on how to locate and contact a
              detainee, legal information, and information about detention
              facilities and community and legal aid support organizations.
            </p>
          </section>

          {/* Card */}
          <section className="flex justify-center">
            <div className="bg-white rounded-[10px] border border-[#E2E8F0] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] px-6 py-8 w-full flex flex-col items-center gap-3">
              <h2 className="oswald font-medium text-[24px] leading-[28px] text-[#0F172B] text-center">
                Detainee Justice Tool
              </h2>

              <p className="font-[var(--font-proxima)] font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-[#45556C] text-center max-w-[420px]">
                Answer some questions to find relevant information.
              </p>

              <Link
                href="/detainee/step-1"
                className="mt-2 bg-[#030213] text-white rounded-[12px] h-[40px] w-full max-w-[274px] flex items-center justify-center font-[var(--font-proxima)] font-medium text-[14px] leading-[20px] tracking-[-0.1504px] hover:bg-[#0A0A1A] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </section>

          {/* Privacy + scams section */}
          <section className="mt-4 flex flex-col gap-8 pb-8">
            {/* Your Privacy */}
            <div className="flex flex-col gap-2">
              <h3 className="oswald font-medium text-[18px] leading-[26px] text-[#0F172B]">
                Your Privacy
              </h3>
              <p className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                This site is private and secure. We do not ask for or save any
                information about you.
              </p>
            </div>

            <hr className="border-t border-[#E2E8F0]" />

            {/* Stay Safe From Scams */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="oswald font-medium text-[18px] leading-[26px] text-[#0F172B]">
                  Stay Safe From Scams
                </h3>
                <p className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                  These organizations are verified to help immigrants. They
                  should never ask for money upfront or before you meet with
                  them.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="oswald font-medium text-[16px] leading-[24px] text-[#0F172B]">
                  Protect yourself
                </h4>
                <ul className="list-disc pl-5 flex flex-col gap-2">
                  <li className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                    <span className="font-bold">Stay safe:</span> Be careful
                    about sharing personal information. Confirm you are speaking
                    with a real organization before giving details about
                    yourself or your family.
                  </li>
                  <li className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                    <span className="font-bold">Avoid scams:</span> Do not send
                    money to anyone you have not met in person. Scammers pretend
                    to be lawyers or government workers.
                  </li>
                  <li className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                    <span className="font-bold">Protect your money:</span>{" "}
                    Always meet with a lawyer in person before paying them.
                    Never send money to someone claiming to be a lawyer if you
                    haven&apos;t met them.
                  </li>
                  <li className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#45556C]">
                    <span className="font-bold">Read before signing:</span> Do
                    not sign anything you don&apos;t understand. Ask questions
                    and get documents translated into your language if needed.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
