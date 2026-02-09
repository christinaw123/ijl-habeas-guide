import Image from "next/image";
import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-[#5A5A8A]">
      {/* Left-aligned wrapper (NOT centered) */}
      <div className="w-full px-4">
        <div className="h-[72px] w-full flex items-center">
          {/* Logo */}
          <Link href="/" className="block w-[122px] h-[40px] relative">
            <Image
              src="/IJLlogo.png"
              alt="Immigrant Justice Lab"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Toggle */}
          <div className="ml-auto flex items-center">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
