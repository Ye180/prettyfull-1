"use client";
import SearchBar from "@/shared/components/molecules/core/search";
import Space from "@/shared/components/molecules/core/space";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetProductsMedusa } from "../api/medusa/get-products-medusa";
import Hero from "../organims/hero-video";
import ModeCollection from "../organims/mode-collection";
import NewsArrivals from "../organims/news-arrivals";
import PictureBar from "../organims/picture-bar";
import ShopGrid from "../organims/shop-grid";
import TrendReport from "../organims/trend-report";

const HomeView = () => {
	const t = useTranslations("HomePage.containers");

	const params = useParams();

	const id = params?.id;

	const { data: productMedusa, isLoading: loadingProductsMedusa } =
		useGetProductsMedusa();

	// sdk.store.region.list().then(({ regions, count, limit, offset }) => {
	// 	console.log(regions);
	// });

	return (
		<div className="  w-full *:w-full lg:*:px-40  space-y-4 lg:space-y-4 mb-20">
			<SearchBar />
			<Hero video={false} />

			<Space />
			<NewsArrivals />
			<Space />
			<PictureBar
				imageDesktop="/home/promo-desktop-1.jpg"
				imageMobile="/home/promo-phone.jpg"
			/>
			<Space />
			<ModeCollection />
			<Space />
			<Container maxWidth="100vw" className="w-full py-8 lg:px-40">
				<h2 className="text-center">{t("paragraph1")}</h2>
			</Container>
			<Space />
			<TrendReport />
			<Space />

			<PictureBar
				imageDesktop="/banner/banner8.jpg"
				imageMobile="/home/promo-phone.jpg"
			/>
			<Space />
			<ShopGrid />
			<Space />
			{/* <GridCategory /> */}
			<Space />

			<PictureBar
				imageDesktop="/banner/banner4.jpg"
				imageMobile="/home/promo-phone.jpg"
			/>
			<Space />
			{/* <Recommendation /> */}

			<Container
				maxWidth="100vw"
				className="flex items-start justify-between px-4 lg:px-40 max-md:flex-col h-fit max-md:space-y-12 gap-x-12"
			>
				<GridCardProduct className=" max-sm:gap-y-8">
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
			</Container>
		</div>
	);
};

export default HomeView;
