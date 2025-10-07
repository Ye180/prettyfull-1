import { Drawer, DrawerContent, DrawerTrigger } from "./components/ui/drawer";
import { F7CartFillBadgePlus } from "./icons/add-cart.icon";
import Size from "./size";

const DrawerCart = () => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<button
					className="absolute p-2 text-2xl bg-white rounded-full cursor-pointer right-2 bottom-5 w-fit md:hidden"
					onClick={(e) => e.stopPropagation()}
				>
					<F7CartFillBadgePlus />
				</button>
			</DrawerTrigger>
			<DrawerContent
				title="Size"
				className="w-full p-5 border-none outline-none  md:hidden lg:hidden xl:hidden 2xl:hidden max-h-[90%] "
			>
				<div className="p-4 overflow-x-scroll rounded-lg scrollbar-hide h-fit">
					<Size size={["S", "M", "L", "XL", "XXL", "XXXL", "4XL", "5XL"]} />
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default DrawerCart;
