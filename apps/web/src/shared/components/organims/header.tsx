'use client';

import { useGetChildrenCategory } from "@/features/homepage/api/get-children-category";
import { useParams } from "next/navigation";
import BottomHeader from "../molecules/header/bottom";
import NavBarHeaders from "../molecules/header/navbar";

const Header = ({ main_category }: { main_category: any }) => {
	const id = useParams();

	console.log("id", id);
	// const id = main_category?.slug;

	const { data: children_category } = useGetChildrenCategory(id.id as string);

	console.log("children_category", children_category);
	return (
		<header className="py-8 bg-white max-sm:h-fit ">
			<nav className="flex flex-col justify-start px-4 mx-auto gap-y-4 sm:px-6 lg:px-8 max-auto ">
				<NavBarHeaders
					main_category={main_category}
					secondary_category={children_category}
				/>
				<BottomHeader secondary_category={children_category} />
			</nav>
		</header>
	);
};

export default Header;