import Banner from "@/features/collections/organims/banner";
import FilterLayout from "@/features/collections/organims/filter-layout";
import GridCollectionLayout from "@/features/collections/organims/grid-layout";
import NavbarCollection from "@/features/collections/organims/mini-navbar";
import Container from "../../../../../../../../packages/ui/src/layouts/helpers/container";

const Page = () => {
	return (
		<div className="pb-20 space-y-12">
			<div className="h-[25vh] md:h-[45vh]  space-y-18 border-orange-100 p-2 md:p-4">
				<Banner />
			</div>
			<Container maxWidth="100vw" className="space-y-8 max-lg:px-4 lg:px-40 ">
				<NavbarCollection />

				<div className="relative flex items-start justify-center !w-full space-x-8  h-fit ">
					<FilterLayout />
					<GridCollectionLayout />
				</div>
			</Container>
		</div>
	);
};

export default Page;
