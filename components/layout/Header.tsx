import Image from "next/image";
import Link from "next/link";
import LanguageToggle from "@/components/layout/LanguageToggle";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-(--ijl-border)">
      {/* Logo sits at the reading start (left in LTR, right in RTL) */}
      <div className="w-full px-4">
        <div className="mx-auto max-w-2xl h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="block w-30.5 h-10 relative">
            <Image
              src="/IJLlogo.png"
              alt="Immigrant Justice Lab"
              fill
              className="object-contain object-left rtl:object-right"
              priority
            />
          </Link>

          {/* Toggle */}
          <div className="ms-auto flex items-center">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
