import { Input, NavLink } from "@prettyfull/ui";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";

const BottomHeader = () => {
	return (
		<div className="flex items-center justify-start gap-6 mt-4  text-[1.5rem] ">
			<div className="items-center justify-between w-full sm:hidden max-sm:flex max-sm:gap-2">
				<div className="items-center justify-start w-[100%] gap-2 py-1 text-gray-500 border-b border-gray-300 sm:hidden outline-gray-700 max-sm:flex ">
					<Search className="" />
					<Input
						placeholder="Rechercher..."
						className="h-4 border-none outline-1 text-black font-light px-2 py-4  border-gray-300 focus:ring-0 focus:border-none  text-[1.8rem] max-md:flex  placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.5rem]"
					/>
				</div>
			</div>
			<div className="max-sm:hidden sm:flex items-center justify-start gap-6 mt-4  text-[1.5rem]">
				{[
					{ href: "/collection", label: "Tailleur GT" },
					{ href: "/special-offer", label: "Jooging" },
					{ href: "/store", label: "Decembre" },
					{ href: "/store", label: "Zara Shoes" },
					{ href: "/store", label: "Herve Leger" },
					{ href: "/store", label: "Accessoires" },
					{ href: "/store", label: "Sexy-hot" },
				].map((link, index) => (
					<NavLink href={link.href} key={index} className="!text-[1.6rem] ">
						{" "}
						{link.label}
					</NavLink>
				))}
			</div>
		</div>
	);
};

export default BottomHeader;
