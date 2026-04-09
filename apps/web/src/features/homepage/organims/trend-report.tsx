import { ArrowLinearIcon } from "@/components/icons/arrow-linear-icon";
import { LoadingPrettyfull } from "@/shared/components/molecules/core/loading-prettyfull";
import Title from "@/shared/components/molecules/core/title";
import { Button } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import Box from "../../../../../../packages/ui/src/layouts/helpers/box";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCategoryByHandler } from "../api/medusa/get-chidren-metadata";

const TrendReport = ({ five }: { five?: any }) => {
	const t = useTranslations("HomePage.trendReport");

	const params = useParams();

	const BOX_CLASS =
		"relative  flex justify-center items-center shadow-md max-md:h-140 h-240 mt-4 hover:[&>button]:bg-black hover:[&>button>*]:text-white transition-all duration-300 ease-in-out cursor-pointer";

	const results = useGetCategoryByHandler(params.id as string, "fifty_section");

	const categories = results[0]?.data;

	const isLoading = results[0]?.isLoading;

	return (
		<Container maxWidth="100vw" className="px-4 w-full h-fit lg:px-40">
			{isLoading && (
				<div className="">
					<div className="space-y-6">
						<div className="mb-8 h-12 bg-gray-200 rounded-lg animate-pulse" />
						<div className="grid overflow-x-auto grid-cols-2 gap-x-4 md:grid-cols-4 md:gap-x-20">
							{Array.from({ length: 4 }, (_, i) => (
								<Box key={i} className={BOX_CLASS}>
									<LoadingPrettyfull className="h-full" />
								</Box>
							))}
						</div>
					</div>
				</div>
			)}

			{!isLoading && results && categories && categories.length > 0 && (
				<>
					<Title
						title={five?.title || t("title")}
						buttonLabel={five?.button || t("viewAll")}
					/>
					<div className="grid overflow-x-auto grid-cols-2 gap-x-4 md:grid-cols-4 md:gap-x-20">
						{categories?.map((category, index) => (
							<Box key={index} className={cn(BOX_CLASS)}>
								<Image
									src={
										category?.product_category_image?.[1]?.url + "?view=1" ||
										"/images/placeholder.png"
									}
									alt={category?.name}
									width={500}
									height={800}
									className="object-cover object-center absolute top-0 left-0 z-0 w-full h-full"
									priority
								/>
								<div className="absolute bottom-0 left-0 w-full h-full bg-black/30"></div>
								<div className="flex justify-between items-center">
									<div className="static z-20 w-full text-center text-white">
										<h3 className="text-[8rem] uppercase">{category?.name}</h3>
									</div>
								</div>
								<Button
									variant="default"
									className=" text-black bg-white py-4 px-4 w-fit rounded-full absolute right-8 top-8 hover:*:text-white *:text-black max-sm:py-2 max-sm:px-2"
								>
									<ArrowLinearIcon className="rotate-45" />
								</Button>
							</Box>
						))}
					</div>
				</>
			)}
		</Container>
	);
};

export default TrendReport;
