import Container from "@/components/Container";
import Link from "next/link";

export default function FindHelpPage() {
  return (
    <div className="bg-white">
      {/* Back row */}
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

      {/* Page Header */}
      <Container>
        <div className="flex flex-col items-center gap-3 px-4 py-3">
          <h1 className="oswald font-medium text-[32px] leading-[47px] text-center ijl-title-color">
            Page Title
          </h1>

          <p className="font-[var(--font-proxima)] font-normal text-[16px] leading-[21px] text-center text-[#000000] px-[10px] py-4 max-w-[600px]">
            Deserunt exercitation incididunt reprehenderit laboris eu elit nulla incididunt
          </p>
        </div>
      </Container>

      {/* Card List */}
      <Container>
        {/* Figma: padding 0px 160px on desktop.
            We'll do responsive: small screens use px-4, large screens use px-[160px]. */}
        <div className="flex flex-col items-center gap-[21px] px-4 lg:px-[160px] pb-16">
          {/* Subtitle */}
          <div className="w-full max-w-[600px]">
            <div className="oswald font-medium text-[20px] leading-[30px] ijl-title-color">
              Subtitle
            </div>
          </div>

          {/* Org Card */}
          <div className="w-full max-w-[600px] bg-white border border-[#E6E7E8] rounded-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.25)] p-[25px]">
            <div className="flex flex-col gap-6">
              <div>
                <div className="font-[var(--font-proxima)] font-bold text-[16px] leading-[21px] text-[#2F2E2E]">
                  Card Title Duis Ea Id Culpa Ut Excepteur Pariatur
                </div>
                <div className="mt-3 font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#2F2E2E]">
                  Labore nulla nulla nisi et eiusmod duis commodo laboris non aliqua ullamco nostrud occaecat sunt aute.
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="font-[var(--font-proxima)] font-semibold text-[14px] leading-[20px] text-[#2F2E2E]">
                  Exercitation anim mollit minim eu occaecat.
                </div>

                <a
                  href="#"
                  className="inline-flex items-center gap-3 font-[var(--font-proxima)] font-semibold text-[14px] leading-[20px] text-[#5A5A8A]"
                >
                  <span aria-hidden>📄</span>
                  Enim Excepteur
                </a>

                <div className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#2F2E2E]">
                  Labore nulla nulla nisi et eiusmod duis commodo laboris non aliqua ullamco nostrud occaecat sunt aute.
                </div>
              </div>

              {/* Divider area */}
              <div className="pt-[17px] border-t border-[#E6E7E8]">
                <div className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#2F2E2E]">
                  For questions or additional information:
                </div>
                <a
                  href="mailto:probono@legalhelp.org"
                  className="mt-2 inline-flex items-center gap-3 font-[var(--font-proxima)] font-semibold text-[14px] leading-[20px] text-[#5A5A8A]"
                >
                  <span aria-hidden>✉️</span>
                  probono@legalhelp.org
                </a>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="w-full max-w-[600px] bg-[#F2F4FA] border border-[#5A5A8A] rounded-[10px] shadow-[0px_1px_3px_rgba(0,0,0,0.25)] p-[25px]">
            <div className="flex flex-col gap-4">
              <div className="font-[var(--font-proxima)] font-bold text-[16px] leading-[21px] text-[#002E5D]">
                Card title duis ea id culpa excepteur
              </div>

              <div className="font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#2F2E2E]">
                If you need to find someone who has been detained…
              </div>

              <a
                href="#"
                className="font-[var(--font-proxima)] font-semibold text-[14px] leading-[20px] text-[#5A5A8A]"
              >
                Consectetur adipisicing labore
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
