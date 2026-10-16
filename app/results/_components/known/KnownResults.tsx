"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { FlowState } from "@/lib/flow/types";
import type { ResultsData } from "@/server/types";
import { ROUTES } from "@/lib/routes";
import ResultsLayout from "../ResultsLayout";
import ContactTab from "./ContactTab";
import GetHelpFoundTab from "./GetHelpFoundTab";
import GetHelpNotFoundTab from "./GetHelpNotFoundTab";
import LegalOptionsTab from "./LegalOptionsTab";

type Tab = "contact-person" | "get-help" | "legal-options";

// Results when the user knows which facility the person is held in.
export default function KnownResults({ flow }: { flow: FlowState }) {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<Tab>("contact-person");
  const [showCommissaryModal, setShowCommissaryModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const [results, setResults] = useState<ResultsData | null | undefined>(
    undefined
  );
  const loading = !!flow.detention.facilityId && results === undefined;

  useEffect(() => {
    if (!flow.detention.facilityId) return;
    fetch(`/api/results/known?facilityCode=${encodeURIComponent(flow.detention.facilityId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setResults)
      .catch(() => setResults(null));
  }, [flow.detention.facilityId]);

  const arrestCity = flow.arrest.city ?? t("resultsKnown.unknownCity");
  const arrestState = flow.arrest.state ?? t("resultsKnown.unknownState");
  const facilityLabel =
    results?.facility.facility_display ?? t("resultsKnown.unknownFacility");

  const orgs = results?.orgs ?? [];
  const hasOrgs = orgs.length > 0;

  const tabs: { id: Tab; label: string }[] = [
    { id: "contact-person", label: t("resultsKnown.tab.contact") },
    { id: "get-help", label: t("resultsKnown.tab.help") },
    { id: "legal-options", label: t("resultsKnown.tab.legal") },
  ];

  return (
    <>
      <ResultsLayout
        backHref={ROUTES.facility}
        backLabel={t("resultsKnown.back")}
        title={t("resultsKnown.title")}
        badges={[
          {
            label: t("resultsKnown.arrestedIn"),
            value: `${arrestCity}, ${arrestState}`,
            ariaLabel: t("resultsKnown.arrestedIn"),
            href: ROUTES.arrest,
          },
          {
            label: t("resultsKnown.detainedIn"),
            value: facilityLabel,
            ariaLabel: t("resultsKnown.detainedIn"),
            href: ROUTES.facility,
          },
        ]}
        intro={t(
          hasOrgs ? "resultsKnown.intro.orgsFound" : "resultsKnown.intro.noOrgs"
        )}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {loading ? (
          <Spinner className="py-16" />
        ) : (
          <>
            {activeTab === "contact-person" && (
              <ContactTab
                facility={results?.facility}
                onCommissaryClick={() => setShowCommissaryModal(true)}
              />
            )}
            {activeTab === "get-help" &&
              (hasOrgs ? (
                <GetHelpFoundTab
                  orgs={orgs}
                  onCallModalClick={() => setShowCallModal(true)}
                />
              ) : (
                <GetHelpNotFoundTab />
              ))}
            {activeTab === "legal-options" && (
              <LegalOptionsTab
                fieldOffice={results?.fieldOffice}
                districtCourt={results?.districtCourt}
              />
            )}
          </>
        )}
      </ResultsLayout>

      {/* Commissary modal */}
      <Modal
        open={showCommissaryModal}
        onClose={() => setShowCommissaryModal(false)}
        title={t("resultsKnown.modal.commissary.title")}
      >
        <div className="space-y-4 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
          <p>{t("resultsKnown.modal.commissary.p1")}</p>
          <p>{t("resultsKnown.modal.commissary.p2")}</p>
        </div>
      </Modal>

      {/* What to expect modal */}
      <Modal
        open={showCallModal}
        onClose={() => setShowCallModal(false)}
        title={t("resultsKnown.modal.call.title")}
      >
        <div className="space-y-4 font-[var(--font-proxima)] text-[16px] text-[var(--foreground)]">
          <p>
            <span className="font-bold">{t("resultsKnown.modal.call.p1.bold")}</span>{" "}
            {t("resultsKnown.modal.call.p1.body")}
          </p>
          <p>
            <span className="font-bold">{t("resultsKnown.modal.call.p2.bold")}</span>{" "}
            {t("resultsKnown.modal.call.p2.body")}
          </p>
          <p>
            <span className="font-bold">{t("resultsKnown.modal.call.p3.bold")}</span>{" "}
            {t("resultsKnown.modal.call.p3.body")}
          </p>
        </div>
      </Modal>
    </>
  );
}
