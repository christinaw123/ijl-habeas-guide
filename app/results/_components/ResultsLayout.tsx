"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import BackButton from "@/components/layout/BackButton";

export type LocationBadge = {
  label: string;
  value: string;
  ariaLabel: string;
  href: string;
};

// Shared frame for both results views: back link, title, the "arrested in" /
// "detained in" badges, intro, an optional notice, the tab bar, and the
// active tab's content. Each view supplies its own tabs and content.
export default function ResultsLayout<T extends string>({
  backHref,
  backLabel,
  title,
  badges,
  intro,
  notice,
  tabs,
  activeTab,
  onTabChange,
  children,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  badges: LocationBadge[];
  intro: string;
  notice?: ReactNode;
  tabs: { id: T; label: string }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  children: ReactNode;
}) {
  const router = useRouter();

  const badgeBase =
    "flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFEFEF] hover:bg-[#E5E5E5] transition-colors cursor-pointer group w-fit";
  const badgeText =
    "font-[var(--font-proxima)] text-[14px] text-[var(--foreground)]";

  return (
    <div className="bg-white">
      <BackButton href={backHref} label={backLabel} />
      <div className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Title */}
          <h1 className="oswald text-[36px] font-medium text-[var(--ijl-title)] leading-[1.3]">
            {title}
          </h1>

          {/* Location badges: clicking one goes back to edit that answer */}
          <div className="space-y-2">
            {badges.map((badge) => (
              <button
                key={badge.label}
                onClick={() => router.push(badge.href)}
                className={badgeBase}
                aria-label={badge.ariaLabel}
              >
                <span className={badgeText}>{badge.label}</span>
                <span className={`${badgeText} font-semibold`}>{badge.value}</span>
                <Pencil className="w-3.5 h-3.5 text-[var(--ijl-muted)] group-hover:text-[var(--foreground)] transition-colors" />
              </button>
            ))}
          </div>

          {/* Intro */}
          <p className="font-[var(--font-proxima)] text-[18px] text-[var(--foreground)]">
            {intro}
          </p>

          {notice}

          {/* Tab bar (scrolls horizontally on narrow screens) */}
          <div className="border-b border-[var(--ijl-border)] flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={[
                  "whitespace-nowrap font-[var(--font-proxima)] text-[14px] px-4 py-2 border-b-2 transition-all flex-shrink-0",
                  activeTab === tab.id
                    ? "border-[var(--ijl-accent)] font-semibold text-[var(--foreground)]"
                    : "border-transparent text-[var(--ijl-muted)] hover:text-[var(--foreground)]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active tab */}
          <div className="pb-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
