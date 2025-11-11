import Title from "@/shared/components/molecules/core/title";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { Category, useGetCategory } from "../api/get-category";

const GridCategory = () => {
	const t = useTranslations("HomePage.news");

	const { data: category, isLoading } = useGetCategory();

	console.log("category grid category", category);
	return (
		<Container maxWidth="100vw" className="w-full px-4 space-y-8 lg:px-40">
			<Title title="Shop By Category" buttonLabel={t("viewAll")} />
			<div className="grid gap-x-2 md:gap-4  grid-cols-3 h-[50vh] md:h-[70vh] ">
				{category &&
					category.slice(0, 5).map((item: Category, index: number) => (
						<div
							key={index}
							className="relative m-2 overflow-hidden bg-gray-200 shadow-md box"
						>
							<Image
								src={`https://dev-storage.prettyfull.shop/api/browse/prettyfull/categories/product_2.jpg?view=1`}
								alt={`${item.name} - vue ${index + 1}`}
								fill
								className="object-cover w-full h-32 "
							/>
							<div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black/30 to-black/0" />
							<div className="absolute z-10 text-white bottom-4 left-8 whitespace-nowrap ">
								<h4>{item.name}</h4>
							</div>
						</div>
					))}

				{/* {category &&
					category.slice(0, 5).map((item: Category, index: number) => (
						<div
							key={index}
							className="relative flex p-4 m-2 bg-gray-200 shadow-md lg:hidden "
						>
							<Image
								src={`https://dev-storage.prettyfull.shop/api/browse/prettyfull/categories/product_2.jpg?view=1`}
								alt="Category 1"
								fill
								className="object-cover w-full h-32 rounded-md"
							/>
							<div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black/30 to-black/0" />
							<div className="absolute z-10 text-white bottom-4 left-8 ">
								<h4>{item.name}</h4>
							</div>
						</div>
					))} */}
			</div>
		</Container>
	);
};

export default GridCategory;
