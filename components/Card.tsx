import type { ReactNode } from "react";

export function Card({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "muted";
}) {
  const base =
    "rounded-2xl border bg-white shadow-[0_4px_16px_rgba(15,23,42,0.08)]";
  const muted =
    "bg-slate-50 border-slate-300 shadow-[0_8px_24px_rgba(15,23,42,0.08)]";

  return (
    <div className={`${base} ${variant === "muted" ? muted : "border-slate-200"}`}>
      {children}
    </div>
  );
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-8 sm:p-9">{children}</div>;
}
