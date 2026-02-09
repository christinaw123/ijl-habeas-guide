import Container from "@/components/Container";

export default function Footer() {
  return (
    <footer className="bg-[#002E5D]">
      {/* Tool Footer */}
      <div className="py-6">
        <Container>
          <div className="flex flex-col items-center gap-6">
          <a
  href="#"
  className="h-[40px] w-[166px] bg-[#5A5A8A] px-[24px] py-[12px] flex items-center justify-center"
>
  <span className="font-[var(--font-proxima)] text-[16px] font-normal leading-[16px] text-white whitespace-nowrap">
    Return to Main Site
  </span>
</a>

            <p className="w-full text-center font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#9292B1]">
              This tool provides general legal information, not legal advice.
            </p>
          </div>
        </Container>
      </div>

      {/* Mobile Footer */}
      <div className="py-4">
        <Container>
          <div className="flex flex-col items-center gap-6">
            <div className="w-full border-t border-[#9292B1]" />
            <p className="w-full text-center font-[var(--font-proxima)] font-normal text-[14px] leading-[20px] text-[#9292B1]">
              © 2025 Immigrant Justice Lab at University of Michigan + Michigan Immigrant Rights Center (MIRC)
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
