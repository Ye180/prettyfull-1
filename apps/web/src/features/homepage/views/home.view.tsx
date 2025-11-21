"use client";
import { useGetSiteSlugNameContent } from "@/shared/api/get-content-by-slugname";
import SearchBar from "@/shared/components/molecules/core/search";
import Space from "@/shared/components/molecules/core/space";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useGetProductsMedusa } from "../api/medusa/get-products-medusa";
import Hero from "../organims/hero-video";

const HomeView = () => {
	const t = useTranslations("HomePage.containers");

	const params = useParams();

	const id = params?.id;

	const { data: slugNameContent, isLoading: slugNameLoading } =
		useGetSiteSlugNameContent(id as string);

	const { data: productMedusa, isLoading: loadingProductsMedusa } =
		useGetProductsMedusa();

	return (
		<div className="  w-full *:w-full lg:*:px-40  space-y-4 lg:space-y-4 mb-20">
			<SearchBar />
			<Hero video={true} />
			{/* <Hero video={false} firstSection={slugNameContent?.first} /> */}
			<Space />
			<GridCardProduct action_grid className=" max-sm:gap-y-8">
				<>
					{loadingProductsMedusa ? (
						<>
							{Array.from({ length: 8 }).map((_, index) => (
								<CardProduct
									key={`skeleton-${index}`}
									product={undefined as any}
								/>
							))}
						</>
					) : (
						<>
							{productMedusa?.map((product) => (
								<CardProduct key={product.id} product={product as any} />
							))}
						</>
					)}{" "}
				</>
			</GridCardProduct>

			{/* <NewsArrivals second={slugNameContent?.secondSection} />
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
			<Recommendation /> */}
		</div>
	);
};

export default HomeView;

// const t = useTranslations("HomePage.containers");
// return (
// 	<div className="  w-full [&>*]:w-full lg:[&>*]:px-40  space-y-4 lg:space-y-4 mb-20">
// 		<SearchBar />

// 		<Hero video={true} />
// 		<Space />
// 		<NewsArrivals />
// 		<Space />
// 		<PictureBar
// 			imageDesktop="/home/promo-desktop-1.jpg"
// 			imageMobile="/home/promo-phone.jpg"
// 		/>
// 		<Space />
// 		<ModeCollection />
// 		{/* <Space /> */}
// 		<Container maxWidth="100vw" className="w-full py-8 lg:px-40">
// 			<h2 className="text-center">{t("paragraph1")}</h2>
// 		</Container>
// 		{/* <Space /> */}
// 		<TrendReport />
// 		<Space />

// 		<PictureBar
// 			imageDesktop="/home/promo-desktop-1.jpg"
// 			imageMobile="/home/promo-phone.jpg"
// 		/>
// 		<Space />
// 		<ShopGrid />
// 		<Space />
// 		<GridCategory />
// 		<Space />

// 		<PictureBar
// 			imageDesktop="/home/promo-desktop-1.jpg"
// 			imageMobile="/home/promo-phone.jpg"
// 		/>
// 		<Space />
// 		<Recommendation />
// 	</div>
// );

// ("use client");
// import SearchBar from "@/shared/components/molecules/core/search";
// import Space from "@/shared/components/molecules/core/space";
// import { useTranslations } from "next-intl";
// import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
// import GridCategory from "../organims/grids-category";
// import Hero from "../organims/hero-video";
// import ModeCollection from "../organims/mode-collection";
// import NewsArrivals from "../organims/news-arrivals";
// import PictureBar from "../organims/picture-bar";
// import Recommendation from "../organims/recommendation";
// import ShopGrid from "../organims/shop-grid";
// import TrendReport from "../organims/trend-report";
