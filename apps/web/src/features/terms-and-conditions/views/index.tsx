"use client";

import LegalPage from "@/shared/components/organims/legal-page";
import { useTranslations } from "next-intl";
import { getTermsItems } from "../data";

const TermsAndConditionsViews = () => {
	const t = useTranslations("TermsPage");

	return (
		<LegalPage
			eyebrow={t("eyebrow")}
			title={t("pageTitle")}
			intro={t("intro")}
			sections={getTermsItems(t)}
			contactLabel={t("contactLabel")}
			contactCta={t("contactCta")}
		/>
	);
};

export default TermsAndConditionsViews;
