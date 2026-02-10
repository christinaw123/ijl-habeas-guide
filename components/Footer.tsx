import Container from "@/components/Container";

export default function Footer() {
  return (
    <footer className="bg-[#00274c] py-8 px-4 w-full">
      <div className="mx-auto flex flex-col gap-6">
        <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-white text-center opacity-90">
          This tool provides general legal information, not legal advice.
        </p>

        <p className="font-['Inter',sans-serif] font-normal text-[12px] leading-[18px] tracking-[-0.1504px] text-white text-center opacity-75 italic">
          We've made this tool available in multiple languages using automated translation. Translations may not be perfect. If something doesn't make sense, try switching to English or get help in your language.
        </p>

        <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-white text-center opacity-90">
          Legal or community organization? <a href="#" className="font-bold underline hover:text-blue-200">Get listed here</a>
        </p>
        
        <div className="h-px bg-white/20 w-full" />
        
        <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-white text-center opacity-90">
          © 2026 Immigrant Justice Lab at University of Michigan + Michigan Immigrant Rights Center (MIRC)
        </p>
      </div>
    </footer>
  );
}
