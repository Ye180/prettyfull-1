import Banner from "@/features/collections/organims/banner";

import FilterLayout from "@/features/collections/organims/filter-layout";

import GridCollectionLayout from "@/features/collections/organims/grid-layout";

import CategoryCollection from "@/features/collections/organims/mini-category";

import NavbarCollection from "@/features/collections/organims/mini-navbar";

import Container from "../../../../../../../../packages/ui/src/layouts/helpers/container";

const Page = () => {
	return (
		<div className="pb-32 space-y-16 ">
			<div className="relative h-[30vh] md:h-[45vh] px-4 bg-white">
				<Banner />
				{/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" /> */}
			</div>
			<Container maxWidth="100vw" className="px-4 space-y-12 lg:px-32">
				<div className="flex items-center justify-center">
					<CategoryCollection />
				</div>
				<div className="pb-4 border-b border-neutral-200">
					<NavbarCollection />
				</div>
				<div className="flex items-start justify-center gap-8 !w-full ">
					<FilterLayout className="h-[200vh] mt-4 border bg-white backdrop-blur-md border-gray-200" />
					<div className="flex-1 py-4">
						<GridCollectionLayout />
					</div>
				</div>
			</Container>
		</div>
	);
};
// overflow-y-auto h-[calc(200vh-8rem)]  scrollbar-hide
export default Page;
