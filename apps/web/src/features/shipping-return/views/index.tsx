"use client";

import LegalPage from "@/shared/components/organims/legal-page";
import { useTranslations } from "next-intl";
import { getShippingReturnItems } from "../data";

const ShippingReturnViews = () => {
	const t = useTranslations("ShippingReturnPage");

	return (
		<LegalPage
			eyebrow={t("eyebrow")}
			title={t("pageTitle")}
			intro={t("intro")}
			sections={getShippingReturnItems(t)}
			contactLabel={t("contactLabel")}
			contactCta={t("contactCta")}
		/>
	);
};

export default ShippingReturnViews;
