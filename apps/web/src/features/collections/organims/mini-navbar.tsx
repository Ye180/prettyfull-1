import DrawerLayout from "@/features/homepage/molecules/collections/drawer-layout";

const NavbarCollection = () => {
	return (
		<nav className="flex items-center justify-between w-full max-md:pb-8 ">
			<div className="flex items-start justify-start h-full mt-2 max-md:hidden">
				{["Hot", "Promotion", "Tendance", "Promotion"].map((tag, index) => (
					<button
						key={index}
						className="text-normal font-normal mr-2 px-2.5 py-0.5 rounded cursor-pointer"
					>
						{tag}
					</button>
				))}
			</div>
			<h3 className="!text-[3.5rem] font-semibold flex tracking-wide ">
				Formal Shop
			</h3>
			<DrawerLayout />
		</nav>
	);
};

export default NavbarCollection;
