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

	const region = useRegionStore((state) => state.region);

	const [regionId, setRegionId] = useState(region?.id);

	useEffect(() => {
		setRegionId(region?.id);
	}, [region]);

	const {
		data: productSameCollection,
		isLoading: loadingProductsSameCollection,
	} = useGetProductsSameCollection();

	const results = useGetCategoryByHandler(params.id as string, [
		"third_section",
		"sixth_section",
		"eight_section",
	]);

	const banner = results.map((result) => result?.data?.[0]);

	const isLoading = results.some((result) => result?.isLoading);

	console.log("banner", banner);

	return (
		<div className="  w-full *:w-full lg:*:px-40  space-y-4 lg:space-y-4 mb-20">
			<SearchBar />
			<Hero video={false} />
			<Space />
			<NewsArrivals />
			<Space />
			<PictureBar
				isLoading={isLoading}
				imageDesktop={banner[0]?.product_category_image?.[3]?.url || ""}
				imageMobile={banner[0]?.product_category_image?.[2]?.url || ""}
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
				imageDesktop={banner[1]?.product_category_image?.[1]?.url || ""}
				imageMobile={banner[1]?.product_category_image?.[1]?.url || ""}
			/>
			<Space />
			<ShopGrid />
			<Space />
			{/* <GridCategory /> */}
			<Space />

			<PictureBar
				isLoading={isLoading}
				imageDesktop={banner[2]?.product_category_image?.[1]?.url || ""}
				imageMobile={banner[2]?.product_category_image?.[2]?.url || ""}
			/>
			<Space />
			{/* <Recommendation /> */}

			<Container
				maxWidth="100vw"
				className="flex gap-x-12 justify-between items-start px-4 lg:px-40 max-md:flex-col h-fit max-md:space-y-12"
			>
				<GridCardProduct>
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
										group as RawCollectionProduct,
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
