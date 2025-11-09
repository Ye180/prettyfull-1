"use client";

import { useGetChildrenCategory } from "@/features/homepage/api/get-children-category";
import { getItem } from "@/lib/utils/local-storage";
import { useParams } from "next/navigation";
import BottomHeader from "../molecules/header/bottom";
import NavBarHeaders from "../molecules/header/navbar";

const Header = ({ main_category }: { main_category: any }) => {
	const id = useParams();

	const category = getItem("category");

	const { data: children_category, isLoading: secondaryLoading } =
		useGetChildrenCategory(id.id as string);

	return (
		<header className="py-8 bg-white max-sm:h-fit ">
			<nav className="flex flex-col justify-start px-4 mx-auto gap-y-4 sm:px-6 lg:px-8 max-auto ">
				<NavBarHeaders
					main_category={main_category}
					secondary_category={children_category}
				/>
				<BottomHeader
					secondary_category={children_category || category}
					loading={secondaryLoading}
				/>
			</nav>
		</header>
	);
};

export default Header;
