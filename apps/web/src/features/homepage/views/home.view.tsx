"use client";
import { useGetProductsSameCollection } from "@/shared/api/medusa/get-products-same-collection";
import SearchBar from "@/shared/components/molecules/core/search";
import Space from "@/shared/components/molecules/core/space";
import { useRegionStore } from "@/stores/useRegion";
import {
	CardProduct,
	GridCardProduct,
	normalizeCollectionProducts,
	RawCollectionProduct,
} from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
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

	const region = useRegionStore((state) => state.region);

	const [regionId, setRegionId] = useState(region?.id);

	useEffect(() => {
		setRegionId(region?.id);
	}, [region]);

	const {
		data: productSameCollection,
		isLoading: loadingProductsSameCollection,
	} = useGetProductsSameCollection();

	return (
		<div className="  w-full *:w-full lg:*:px-40  space-y-4 lg:space-y-4 mb-20">
			<SearchBar />
			{/* <ModeCollection /> */}
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
			<Container maxWidth="100vw" className="py-8 w-full lg:px-40">
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
				className="flex gap-x-12 justify-between items-start px-4 lg:px-40 max-md:flex-col h-fit max-md:space-y-12"
			>
				<GridCardProduct className="max-sm:gap-y-8">
					<>
						{loadingProductsSameCollection ? (
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
								{productSameCollection?.map((group) => {
									const normalized = normalizeCollectionProducts(
										group as RawCollectionProduct
									);
									return (
										<CardProduct
											key={normalized.collectionId}
											product={normalized}
										/>
									);
								})}
							</>
						)}{" "}
					</>
				</GridCardProduct>
			</Container>
		</div>
	);
};

export default HomeView;
