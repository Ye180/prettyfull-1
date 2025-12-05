"use client";

import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import BottomHeader from "../molecules/header/bottom";
import NavBarHeaders from "../molecules/header/navbar";

const Header = ({
	main_category,
	loading,
}: {
	main_category: any;
	loading: boolean;
}) => {
	const params = useParams();
	const [division] = useQueryState("division");

	// Determine active category handle from URL or query param
	const activeHandle = division || params.id;

	// Find the active category and its children
	const activeCategory = useMemo(() => {
		if (!main_category || !activeHandle) return null;
		return main_category.find((cat: any) => cat.handle === activeHandle);
	}, [main_category, activeHandle]);

	// Determine parent slug for bottom header navigation
	const parentSlug = useMemo(() => {
		if (division) return division;
		if (params.id && main_category) {
			const found = main_category.find((cat: any) => cat.handle === params.id);
			return found?.handle;
		}
		return undefined;
	}, [division, params.id, main_category]);

	return (
		<header className="py-8 bg-white max-sm:h-fit">
			<nav className="flex flex-col gap-y-4 justify-start px-4 mx-auto sm:px-6 lg:px-8 max-auto">
				<NavBarHeaders
					main_category={main_category}
					secondary_category={activeCategory?.category_children || []}
				/>
				<BottomHeader
					secondary_category={activeCategory?.category_children || []}
					loading={loading}
					parentSlug={parentSlug}
				/>
			</nav>
		</header>
	);
};

export default Header;
