"use client";

import { type FC } from "react";
import BottomHeader from "../molecules/header/bottom";
import NavBarHeaders from "../molecules/header/navbar";

const Header: FC = () => {
	return (
		<header className="py-8 bg-white max-sm:h-fit ">
			<nav className="flex flex-col justify-start px-4 mx-auto gap-y-4 sm:px-6 lg:px-8 max-auto ">
				<NavBarHeaders />
				<BottomHeader />
			</nav>
		</header>
	);
};

export default Header;
