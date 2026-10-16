"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useFlowState } from "@/lib/flow/useFlowState";
import { LOADING_NEXT_KEY } from "@/lib/flow/storageKeys";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ROUTES } from "@/lib/routes";

export default function LoadingPage() {
  const router = useRouter();
  const { flow, hydrated } = useFlowState();
  const { t } = useLanguage();

  useEffect(() => {
    if (!hydrated) return;

    // Guards
    if (!flow.arrest.state) {
      router.replace(ROUTES.arrest);
      return;
    }
    if (flow.detention.knowsWhereHeld !== true) {
      router.replace(ROUTES.detention);
      return;
    }

    // Read and clear the stored destination (written synchronously by the caller)
    const next = localStorage.getItem(LOADING_NEXT_KEY) ?? "step3";
    localStorage.removeItem(LOADING_NEXT_KEY);

    const destination =
      next === "results" ? ROUTES.resultsKnown : ROUTES.facility;

    const timer = setTimeout(() => {
      router.replace(destination);
    }, 1500);
    return () => clearTimeout(timer);
  }, [hydrated, flow, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-[var(--ijl-accent)] animate-spin mx-auto" />
        <h2 className="oswald text-xl font-medium text-[var(--ijl-title)]">
          {t("loading.title")}
        </h2>
        <p className="font-[var(--font-proxima)] text-[var(--ijl-accent)]">
          {t("loading.subtitle")}
        </p>
      </div>
    </div>
  );
}
