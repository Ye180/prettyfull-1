"use client";

import { useGetPrimaryCategories } from "@/features/homepage/api/medusa/get-primary-categories";
import type { StoreCategory } from "@/lib/store-api/types";
import NavBarHeaders from "../molecules/header/navbar";

const Header = ({ main_category }: { main_category?: StoreCategory[] }) => {
	const { data: fallbackCategories } = useGetPrimaryCategories();

	const categories = main_category || fallbackCategories || [];

	return (
		<header className="sticky top-0 z-40 bg-white">
			<div className="hidden justify-center items-center px-4 py-2 w-full text-[1.2rem] font-medium text-white bg-amber-600 sm:flex">
				Livraison gratuite dès 25 000 FCFA d&apos;achat
			</div>
			<div className="px-3 pt-3 pb-3 w-full sm:px-4 lg:px-6 xl:px-10">
				<div className="px-3 bg-white rounded-lg border border-gray-200 sm:px-5">
					<NavBarHeaders main_category={categories} />
				</div>
			</div>
		</header>
	);
};

export default Header;
