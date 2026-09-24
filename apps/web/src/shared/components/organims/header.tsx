"use client";

import { useGetParentsCategoryMedusa } from "@/features/homepage/api/medusa/get-parent-category-medusa";
import NavBarHeaders from "../molecules/header/navbar";

const Header = ({
	main_category,
	loading,
}: {
	main_category?: any;
	loading?: boolean;
}) => {
	const {
		data: fallbackCategories,
	} = useGetParentsCategoryMedusa();

	const categories = main_category || fallbackCategories || [];

	return (
		<header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
			<div className="max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8">
				<NavBarHeaders
					main_category={categories}
					secondary_category={[]}
				/>
			</div>
		</header>
	);
};

export default Header;
