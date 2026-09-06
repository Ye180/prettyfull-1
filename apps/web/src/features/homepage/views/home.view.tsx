"use client";
import Space from "@/shared/components/molecules/core/space";
import { getMediaUrl } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCategoryByHandler } from "../api/medusa/get-chidren-metadata";
import Hero from "../organims/hero-video";
import ModeCollection from "../organims/mode-collection";
import NewsArrivals from "../organims/news-arrivals";
import PictureBar from "../organims/picture-bar";
import ShopGrid from "../organims/shop-grid";
import TrendReport from "../organims/trend-report";

const HomeView = () => {
	const t = useTranslations("HomePage.containers");
	const params = useParams();

	const results = useGetCategoryByHandler(params.id as string, [
		"third_section",
		"sixth_section",
		"eight_section",
	]);

	const banner = results.map((result) => result?.data?.[0]);

	const isLoading = results.some((result) => result?.isLoading);

	return (
		<div className="w-full lg:*:px-40  space-y-4 lg:space-y-4 mb-20">
			<Hero video={false} />
			<Space />
			<NewsArrivals />
			<Space />
			<PictureBar
				isLoading={isLoading}
				imageDesktop={
					getMediaUrl(banner[0]?.product_category_image?.[0]?.url) || ""
				}
				imageMobile={
					getMediaUrl(banner[0]?.product_category_image?.[1]?.url) || ""
				}
			/>
			<Space />
			<ModeCollection />
			<Space />
			<Container maxWidth="100vw" className="py-8 w-full lg:px-40">
				<h2 className="text-center">{t("paragraph1")}</h2>
			</Container>
			<Space />
			<TrendReport />
			<Space />

			<PictureBar
				isLoading={isLoading}
				imageDesktop={
					getMediaUrl(banner[0]?.product_category_image?.[0]?.url) || ""
				}
				imageMobile={
					getMediaUrl(banner[0]?.product_category_image?.[1]?.url) || ""
				}
			/>
			<Space />
			<ShopGrid />
			<Space />
			<PictureBar
				isLoading={isLoading}
				imageDesktop={
					getMediaUrl(banner[0]?.product_category_image?.[0]?.url) || ""
				}
				imageMobile={
					getMediaUrl(banner[0]?.product_category_image?.[1]?.url) || ""
				}
			/>
			<Space />
			{/* <Recommendation /> */}
		</div>
	);
};

export default HomeView;
