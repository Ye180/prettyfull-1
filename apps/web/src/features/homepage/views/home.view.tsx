"use client";
import { useGetSiteSlugNameContent } from "@/shared/api/get-content-by-slugname";
import SearchBar from "@/shared/components/molecules/core/search";
import Space from "@/shared/components/molecules/core/space";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
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

	const params = useParams();

	const id = params?.id;

	const { data: slugNameContent, isLoading: slugNameLoading } =
		useGetSiteSlugNameContent(id as string);

	console.log("slugNameContent", slugNameContent);

	return (
		<div className="  w-full *:w-full lg:*:px-40  space-y-4 lg:space-y-4 mb-20">
			<SearchBar />

			<Hero video={false} firstSection={slugNameContent?.first} />
			<Space />
			<NewsArrivals second={slugNameContent?.secondSection} />
			<Space />
			<PictureBar third={slugNameContent?.thirdSection} />
			<Space />
			<ModeCollection fourth={slugNameContent?.fourthSection} />
			<Space />
			<Container maxWidth="100vw" className="w-full py-8 lg:px-40">
				<h2 className="text-center">{t("paragraph1")}</h2>
			</Container>
			<Space />
			<TrendReport five={slugNameContent?.fiveSection} />
			<Space />

			<PictureBar third={slugNameContent?.sixSection} />
			<Space />
			<ShopGrid />
			<Space />
			<GridCategory />
			<Space />

			<PictureBar third={slugNameContent?.eightSection} />
			<Space />
			<Recommendation />
		</div>
	);
};

export default HomeView;
