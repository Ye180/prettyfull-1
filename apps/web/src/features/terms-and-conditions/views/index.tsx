import BannerContent from "@/shared/components/molecules/core/banner-content";
import Content from "../organims/content";

const TermsAndConditionsViews = () => {
	return (
		<div className="px-4 space-y-12 pb-18 md:space-y-20">
			<BannerContent label="Terms and conditions" />
			<Content />
		</div>
	);
};

export default TermsAndConditionsViews;
