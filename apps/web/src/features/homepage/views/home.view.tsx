"use client";
import { useGetSiteSlugNameContent } from "@/shared/api/get-content-by-slugname";
import SearchBar from "@/shared/components/molecules/core/search";
import Space from "@/shared/components/molecules/core/space";
import { CardProduct } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useGetProductsMedusa } from "../api/medusa/get-products-medusa";

const HomeView = () => {
	const t = useTranslations("HomePage.containers");

	const params = useParams();

	const id = params?.id;

	const { data: slugNameContent, isLoading: slugNameLoading } =
		useGetSiteSlugNameContent(id as string);

	console.log("slugNameContent", slugNameContent);

	const { data: productMedusa, isLoading: loadingProductsMedusa } =
		useGetProductsMedusa();

	console.log("Products from Medusa:", productMedusa);

	return (
		<div className="  w-full *:w-full lg:*:px-40  space-y-4 lg:space-y-4 mb-20">
			<SearchBar />
			{/* <Hero video={false} firstSection={slugNameContent?.first} /> */}
			<Space />
			{loadingProductsMedusa ? (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{Array.from({ length: 8 }).map((_, index) => (
						<CardProduct key={`skeleton-${index}`} product={undefined as any} />
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{productMedusa?.map((product) => (
						<CardProduct key={product.id} product={product as any} />
					))}
				</div>
			)}{" "}
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
