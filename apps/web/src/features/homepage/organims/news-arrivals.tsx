import { ArrowLinearIcon } from "@/components/icons/arrow-linear-icon";
import { LoadingPrettyfull } from "@/shared/components/molecules/core/loading-prettyfull";
import Title from "@/shared/components/molecules/core/title";
import { Button } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Box from "../../../../../../packages/ui/src/layouts/helpers/box";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCategoryByHandler } from "../api/medusa/get-chidren-metadata";

const SKELETON_COUNT = 3;

const BOX_CLASS =
	"flex-none bg-blue-200 flex items-end justify-center text-4xl shadow-md h-200 max-sm:w-160 max-xs:w-[85%] sm:w-full mt-4 aspect-auto bg-cover bg-center bg-no-repeat transition-all duration-300 ease-in-out cursor-pointer snap-center relative";

const GRID_CLASS =
	"flex overflow-y-hidden gap-x-4 md:gap-x-16 max-sm:snap-x md:w-full sm:grid sm:grid-cols-3 h-200 md:overflow-hidden lg:overflow-visible lg:gap-x-6 lg:grid-cols-3 lg:grid-rows-1 lg:h-240 lg:space-y-0 lg:space-x-0 lg:scrollbar-hide lg:scroll-smooth lg:snap-x lg:snap-mandatory lg:pt-8";

const CategoryCard = ({
	name,
	imageUrl,
	priority,
}: {
	name: string;
	imageUrl: string;
	priority: boolean;
}) => (
	<Box className={BOX_CLASS}>
		<Image
			src={imageUrl}
			alt={name}
			fill
			sizes="(max-width: 640px) 85vw, 33vw"
			className="object-cover w-full h-full"
			priority={priority}
		/>
		<div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/70 to-black/0" />
		<div className="flex justify-between items-center pb-16 w-full p-8 static z-20 hover:[&>button]:bg-black hover:[&>button>*]:text-white">
			<h4 className="text-[16px] text-white">{name}</h4>
			<Button
				variant="default"
				className="text-black bg-white py-4 px-4 w-fit rounded-full hover:*:text-white *:text-black"
			>
				<ArrowLinearIcon className="rotate-45" />
			</Button>
		</div>
	</Box>
);

const LoadingSkeleton = () => (
	<div className={GRID_CLASS}>
		{Array.from({ length: SKELETON_COUNT }, (_, i) => (
			<Box key={i} className={BOX_CLASS}>
				<LoadingPrettyfull />
			</Box>
		))}
	</div>
);

const NewsArrivals = () => {
	const t = useTranslations("HomePage.news");
	const params = useParams();

	const results = useGetCategoryByHandler(
		params.id as string,
		"second-section",
	);

	const queryResult = results[0];
	const isLoading = queryResult?.isLoading ?? true;
	const categories = useMemo(
		() => queryResult?.data ?? [],
		[queryResult?.data],
	);

	if (isLoading || categories.length === 0) {
		return <LoadingSkeleton />;
	}

	return (
		<Container maxWidth="100vw" className="px-4 w-full lg:px-40">
			<Title title={t("title")} buttonLabel={t("viewAll")} />
			<div className="overflow-hidden w-full h-fit">
				<div className={GRID_CLASS}>
					{categories.map((category, index) => (
						<CategoryCard
							key={category.id ?? category.handle ?? index}
							name={category.name || ""}
							imageUrl={
								category.product_category_image?.[1]?.url + "?view=1" || ""
							}
							priority={index === 0}
						/>
					))}
				</div>
			</div>
		</Container>
	);
};

export default NewsArrivals;
