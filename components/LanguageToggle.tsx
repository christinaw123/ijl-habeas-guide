"use client";

import Image from "next/image";
import { useState } from "react";

const LANGS = [{ label: "English", value: "en", flag: "/flags/us.png" }];

export default function LanguageToggle() {
  const [lang, setLang] = useState("en");
  const current = LANGS[0];

  return (
    <div className="w-[132px] h-[32px] border border-[#959595] bg-white px-[15px] py-[10.8px] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative w-[22px] h-[22px]">
          <Image src={current.flag} alt="" fill className="object-contain" />
        </div>

        <label className="sr-only" htmlFor="lang">
          Language
        </label>
        <select
          id="lang"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="appearance-none bg-transparent font-[var(--font-proxima)] text-[16px] font-normal leading-[22.4px] text-[#2F2E2E] focus:outline-none"
        >
          {LANGS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* caret */}
      <svg width="12" height="7" viewBox="0 0 12 7" aria-hidden="true">
        <path d="M1 1.25L6 6.25L11 1.25" stroke="#2F2E2E" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}
