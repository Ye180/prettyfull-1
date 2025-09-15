import { Button, Drawer, DrawerContent, DrawerTrigger } from "@prettyfull/ui";

import { FilterIcon } from "../../../../../../../packages/ui/src/icons/filter.icon";
import Filter from "./apps/filter";

const DrawerLayout = () => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center justify-center  py-2  border px-6 border-black/20 rounded-lg cursor-pointer w-fit md:hidden hover:bg-black hover:text-white"
				>
					<FilterIcon />
					<span>Filter </span>
				</Button>
			</DrawerTrigger>
			<DrawerContent
				title="Filter & Trier "
				className="w-full p-5 border-none outline-none  md:hidden lg:hidden xl:hidden 2xl:hidden"
			>
				<Filter />
			</DrawerContent>
		</Drawer>
	);
};

export default DrawerLayout;
