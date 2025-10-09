import Banner from "@/features/collections/organims/banner";
import FilterLayout from "@/features/collections/organims/filter-layout";
import GridCollectionLayout from "@/features/collections/organims/grid-layout";
import CategoryCollection from "@/features/collections/organims/mini-category";
import NavbarCollection from "@/features/collections/organims/mini-navbar";
import Container from "../../../../../../../../packages/ui/src/layouts/helpers/container";

const Page = () => {
	return (
		<div className="space-y-12 max-md:pb-70 md:pb-30">
			<div className="h-[25vh] md:h-[45vh]  space-y-18 border-orange-100 p-2 md:p-4">
				<Banner />
			</div>

			<Container
				maxWidth="100vw"
				className="py-4 space-y-8 max-lg:px-4 lg:px-40 "
			>
				<div className="flex items-center justify-center ">
					<CategoryCollection />
				</div>

				<NavbarCollection />

				<div className="flex  items-start justify-center !w-full space-x-8  h-fit ">
					<FilterLayout className="h-fit " />
					<GridCollectionLayout />
				</div>
			</Container>
		</div>
	);
};

export default Page;
