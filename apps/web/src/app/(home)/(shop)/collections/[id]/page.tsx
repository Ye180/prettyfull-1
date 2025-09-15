import Banner from "@/features/collections/organims/banner";
import FilterLayout from "@/features/collections/organims/filter-layout";
import GridCollectionLayout from "@/features/collections/organims/grid-layout";
import NavbarCollection from "@/features/collections/organims/mini-navbar";
import Container from "../../../../../../../../packages/ui/src/layouts/helpers/container";

const Page = () => {
	return (
		<div>
			<div className="h-[25vh] md:h-[45vh]  space-y-18 border-orange-100 p-2 md:p-4">
				<Banner />

				<Container maxWidth="100vw" className="space-y-8 max-lg:px-4 lg:px-40 ">
					<NavbarCollection />

					<div className="flex relative justify-center items-end h-[200vh] space-x-8">
						<FilterLayout />
						<GridCollectionLayout />
					</div>
				</Container>
			</div>
		</div>
	);
};

export default Page;
