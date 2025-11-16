import {
	Button,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "@prettyfull/ui";

import { FilterIcon } from "../../../../../../../packages/ui/src/icons/filter.icon";
import Filter from "./apps/filter";

const DrawerLayout = () => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center justify-center px-6 py-2 border rounded-lg cursor-pointer border-black/20 w-fit md:hidden hover:bg-black hover:text-white"
				>
					<FilterIcon />
					<span>Filter </span>
				</Button>
			</DrawerTrigger>
			<DrawerContent
				title="Filter & Trier "
				className="w-full p-5 border-none outline-none  md:hidden lg:hidden xl:hidden 2xl:hidden max-h-[90%] "
			>
				<div className=" overflow-x-scroll scrollbar-hide h-[75vh] rounded-lg p-4">
					<Filter />
				</div>

				<DrawerFooter>
					<div className="justify-between hidden w-full gap-5 mt-8 max-md:flex">
						<Button variant="outline">Effacer</Button>
						<Button>Appliquer</Button>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default DrawerLayout;
