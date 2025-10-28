"use client";
import SearchBar from "@/shared/components/molecules/core/search";
import Space from "@/shared/components/molecules/core/space";
import { useTranslations } from "next-intl";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import GridCategory from "../organims/grids-category";
import Hero from "../organims/hero-video";
import ModeCollection from "../organims/mode-collection";
import NewsArrivals from "../organims/news-arrivals";
import PictureBar from "../organims/picture-bar";
import Recommendation from "../organims/recommendation";
import ShopGrid from "../organims/shop-grid";
import TrendReport from "../organims/trend-report";

const HomeView = () => {
	const t = useTranslations("HomePage.containers");
	return (
		<div className="  w-full [&>*]:w-full lg:[&>*]:px-40  space-y-4 lg:space-y-4 mb-20">
			<SearchBar />

			<Hero video={true} />
			<Space />
			<NewsArrivals />
			<Space />
			<PictureBar
				imageDesktop="/home/promo-desktop-1.jpg"
				imageMobile="/home/promo-phone.jpg"
			/>
			<Space />
			<ModeCollection />
			{/* <Space /> */}
			<Container maxWidth="100vw" className="w-full py-8 lg:px-40">
				<h2 className="text-center">{t("paragraph1")}</h2>
			</Container>
			{/* <Space /> */}
			<TrendReport />
			<Space />

			<PictureBar
				imageDesktop="/home/promo-desktop-1.jpg"
				imageMobile="/home/promo-phone.jpg"
			/>
			<Space />
			<ShopGrid />
			<Space />
			<GridCategory />
			<Space />

			<PictureBar
				imageDesktop="/home/promo-desktop-1.jpg"
				imageMobile="/home/promo-phone.jpg"
			/>
			<Space />
			<Recommendation />
		</div>
	);
};

export default HomeView;
