import BannerContent from "@/shared/components/molecules/core/banner-content";
import Content from "../organims/content";

const FaqViews = () => {
	return (
		<div className="px-4 space-y-12 pb-18 md:space-y-20">
			<BannerContent label="FAQ" />
			<Content />
		</div>
	);
};

export default FaqViews;
