import type { ReactNode } from "react";

export default function FeatureCard({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mt-4 text-center text-xl leading-snug text-slate-600">
        {description}
      </p>
      <div className="mt-8">{cta}</div>
    </section>
  );
}
