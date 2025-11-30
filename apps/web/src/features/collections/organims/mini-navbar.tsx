import DrawerLayout from "@/features/homepage/molecules/collections/drawer-layout";

const NavbarCollection = () => {
	return (
		<nav className="flex justify-between items-center w-full max-md:pb-8">
			<div className="flex justify-start items-start mt-2 h-full max-md:hidden">
				{["Hot", "Promotion", "Tendance", "Promotion"].map((tag, index) => (
					<button
						key={index}
						className="text-normal font-normal mr-2 px-2.5 py-0.5 rounded cursor-pointer"
					>
						{tag}
					</button>
				))}
			</div>
			<h3 className="text-[3.5rem]! font-semibold flex tracking-wide ">
				Formal Shop
			</h3>
			<DrawerLayout />
		</nav>
	);
};

export default NavbarCollection;
