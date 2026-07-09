import { ArrowLinearIcon } from "@/components/icons/arrow-linear-icon";
import { LoadingPrettyfull } from "@/shared/components/molecules/core/loading-prettyfull";
import Title from "@/shared/components/molecules/core/title";
import { Button } from "@prettyfull/ui";
import { cn, getMediaUrl } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Box from "../../../../../../packages/ui/src/layouts/helpers/box";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCategoryByHandler } from "../api/medusa/get-chidren-metadata";

const BOX_CLASS =
	"flex-none flex items-end justify-center text-4xl  shadow-md h-200 lg:h-260 max-sm:w-160 max-xs:w-[85%] sm:w-full mt-4 aspect-auto bg-cover bg-center bg-no-repeat transition-all duration-300 ease-in-out cursor-pointer snap-center relative";

const GRID_CLASS =
	"flex overflow-y-hidden gap-x-4 md:gap-x-16 max-sm:snap-x md:w-full sm:grid sm:grid-cols-3 h-fit md:overflow-hidden lg:grid-cols-3 lg:grid-rows-1 lg:h-fit lg:scrollbar-hide lg:pt-8 scrollbar-hide horizontal-scroll";

const CategoryCard = ({
	name,
	imageUrl,
	priority,
	className,
}: {
	name: string;
	imageUrl: string;
	priority: boolean;
	className?: string;
}) => (
	<Box className={cn(BOX_CLASS, className)}>
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
			<h4 className=" text-[2.5rem]! md:text-[3rem]! whitespace-nowrap truncate leading-snug text-white">
				{name}
			</h4>
			<Button
				variant="default"
				className="text-black bg-white py-4 px-4 max-md:py-4 max-md:px-4 w-fit h-fit! rounded-full hover:*:text-white *:text-black"
			>
				<ArrowLinearIcon className="rotate-45!" />
			</Button>
		</div>
	</Box>
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

	return (
		<Container maxWidth="100vw" className="px-4 w-full lg:px-40">
			{isLoading && (
				<div className="space-y-6">
					<div className="mb-8 h-12 bg-gray-200 rounded-lg animate-pulse" />
					<div className={cn(GRID_CLASS)}>
						{Array.from({ length: 3 }, (_, i) => (
							<Box key={i} className={BOX_CLASS}>
								<LoadingPrettyfull className="h-full" />
							</Box>
						))}
					</div>
				</div>
			)}

			{!isLoading && results && categories.length > 0 && (
				<>
					<Title title={t("title")} buttonLabel={t("viewAll")} />
					<div className="overflow-hidden w-full h-fit">
						<div className={cn(GRID_CLASS)}>
							{categories.map((category, index) => (
								<CategoryCard
									key={category.id ?? category.handle ?? index}
									name={category.name || ""}
									imageUrl={
										getMediaUrl(category.product_category_image?.[0]?.url) || ""
									}
									priority={index === 0}
								/>
							))}
						</div>
					</div>
				</>
			)}
		</Container>
	);
};

export default NewsArrivals;
