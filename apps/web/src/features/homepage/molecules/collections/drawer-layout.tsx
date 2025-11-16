import {
	Button,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "@prettyfull/ui";
import { FilterIcon } from "../../../../../../../packages/ui/src/icons/filter.icon";
import Filter from "./apps/filter";

// Temporary type workarounds until @prettyfull/ui exports proper Drawer props
const DrawerContentAny = DrawerContent as unknown as React.ComponentType<any>;
const DrawerTriggerAny = DrawerTrigger as unknown as React.ComponentType<any>;

const DrawerLayout = () => {
	return (
		<Drawer>
			<DrawerTriggerAny asChild>
				<Button
					variant="outline"
					className="flex items-center justify-center px-6 py-2 border rounded-lg cursor-pointer border-black/20 w-fit md:hidden hover:bg-black hover:text-white"
				>
					<FilterIcon />
					<span>Filter </span>
				</Button>
			</DrawerTriggerAny>
			<DrawerContentAny
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
			</DrawerContentAny>
		</Drawer>
	);
};

export default DrawerLayout;
