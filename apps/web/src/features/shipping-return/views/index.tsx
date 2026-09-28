"use client";

import { useTranslations } from "next-intl";
import BannerContent from "@/shared/components/molecules/core/banner-content";
import Content from "../organims/content";

const ShippingPrivacyViews = () => {
	const t = useTranslations("ShippingReturnPage");

	return (
		<div className="px-4 space-y-12 pb-18 md:space-y-20">
			<BannerContent label={t("pageTitle")} />
			<Content />
		</div>
	);
};

export default ShippingPrivacyViews;
