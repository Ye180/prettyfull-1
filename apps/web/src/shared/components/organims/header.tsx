"use client";

import { type FC } from "react";
import BottomHeader from "../molecules/header/bottom";
import NavBarHeaders from "../molecules/header/navbar";

const Header: FC = () => {
	return (
		<header className="py-8 bg-white max-sm:h-30 ">
			<nav className="flex flex-col justify-start px-4 mx-auto gap-y-4 sm:px-6 lg:px-8 max-auto ">
				<NavBarHeaders />

				<BottomHeader />

				{/* {isMobileMenuOpen && (
					<div className="pb-4 space-y-2 md:hidden">
						<NavLink href="/collection" variant="mobile">
							Collection
						</NavLink>
						<NavLink href="/special-offer" variant="mobile">
							Special Offer
						</NavLink>
						<NavLink href="/store" variant="mobile">
							Store
						</NavLink>
						<hr />
						<NavLink href="/about" variant="mobile">
							About
						</NavLink>
						<NavLink href="/help" variant="mobile">
							Help
						</NavLink>
					</div>
				)} */}
			</nav>
		</header>
	);
};

export default Header;
