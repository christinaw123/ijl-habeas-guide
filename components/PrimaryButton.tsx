import Link from "next/link";
import type { ReactNode } from "react";

export default function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
    >
      {children}
    </Link>
  );
}
