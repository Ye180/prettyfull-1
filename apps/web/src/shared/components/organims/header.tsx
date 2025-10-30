"use client";

import { useGetCategory } from "@/features/homepage/api/get-category";
import { type FC } from "react";
import BottomHeader from "../molecules/header/bottom";
import NavBarHeaders from "../molecules/header/navbar";

const Header: FC = () => {
	const { data: main_category } = useGetCategory({ first: true });

	const { data: second_category } = useGetCategory({ second: true });
	return (
		<header className="py-8 bg-white max-sm:h-fit ">
			<nav className="flex flex-col justify-start px-4 mx-auto gap-y-4 sm:px-6 lg:px-8 max-auto ">
				<NavBarHeaders
					main_category={main_category}
					secondary_category={second_category}
				/>
				<BottomHeader secondary_category={second_category} />
			</nav>
		</header>
	);
};

export default Header;
