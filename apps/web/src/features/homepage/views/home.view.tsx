"use client";
import SearchBar from "@/shared/components/molecules/core/search";
import Space from "@/shared/components/molecules/core/space";
import { useTranslations } from "next-intl";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import Hero from "../organims/hero";
import ModeCollection from "../organims/mode-collection";
import NewsArrivals from "../organims/news-arrivals";
import Recommendation from "../organims/recommendation";
import TrendReport from "../organims/trend-report";

const HomeView = () => {
	const t = useTranslations("HomePage.containers");
	return (
		<div className="  w-full [&>*]:w-full lg:[&>*]:px-40  space-y-4 lg:space-y-4 mb-20">
			<SearchBar />

			<Hero />
			<Space />
			<NewsArrivals />
			<Space />

			<Container maxWidth="100vw" className="h-[40vh] lg:h-[70vh] lg:px-40 ">
				<div className="h-full bg-black/60 overflow-hidden rounded-xl bg-[url(/home/promo-phone.jpg)] lg:bg-[url(/home/promo-desktop-1.jpg)] shadow-lg cursor-pointer   bg-cover  bg-center bg-no-repeat" />
			</Container>
			<Space />
			<ModeCollection />
			{/* <Space /> */}
			<Container maxWidth="100vw" className="w-full py-8 lg:px-40">
				<h2 className="text-center">{t("paragraph1")}</h2>
			</Container>
			{/* <Space /> */}
			<TrendReport />
			<Space />
			<Container maxWidth="100vw" className="h-[40vh] lg:h-[70vh] lg:px-40 ">
				<div className="h-full bg-black/60 overflow-hidden rounded-xl bg-[url(/home/promo-phone.jpg)] lg:bg-[url(/home/promo-desktop-1.jpg)] shadow-lg cursor-pointer   bg-cover  bg-center bg-no-repeat" />
			</Container>
			<Space />

			<Recommendation />
		</div>
	);
};

export default HomeView;
