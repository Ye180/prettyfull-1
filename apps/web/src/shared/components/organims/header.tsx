"use client";

// import { getItem } from "@/lib/utils/local-storage";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
// Importe useState et useEffect
import { sdk } from "@/lib/api/sdk";
import { setItem } from "@/lib/utils/local-storage";
import { useEffect, useMemo } from "react";
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

	const category_local = localStorage.getItem("sous-category");

	console.log("Category:", category_local);

	// Chercher d'abord avec division (query param), sinon avec params.id (URL)
	const activeHandle = division || params.id;

	const children_category_active = main_category?.find(
		(cat: any) => cat.handle === activeHandle
	);

	useEffect(() => {
		// Mettre à jour UNIQUEMENT si on a de nouvelles sous-catégories
		// Ne jamais effacer les sous-catégories existantes
		if (
			children_category_active?.category_children &&
			children_category_active.category_children.length > 0
		) {
			setItem("sous-category", children_category_active.category_children);
		}
		// Si pas de sous-catégories disponibles, on garde celles en localStorage
	}, [children_category_active]);

	const normalizedSlug = Array.isArray(params.id)
		? params.id[0]
		: (params.id ?? division ?? "");

	// const { data: children_category, isLoading: secondaryLoading } =
	// 	useGetChildrenCategory(normalizedSlug as string);

	// Récupérer le parent slug depuis l'URL ou depuis les params
	const parentSlug = useMemo(() => {
		// D'abord vérifier le query param division
		if (division) return division;

		// Sinon, essayer de trouver le parent dans main_category à partir de params.id
		if (params.id && main_category) {
			const found = main_category.find((cat: any) => cat.handle === params.id);
			return found?.handle;
		}

		return undefined;
	}, [division, params.id, main_category]);

	const parentCategory = sdk.store.category
		.list({
			handle: params.id,
		})
		.then(({ product_categories }) => {
			return product_categories[0];
		});

	// 2. Récupérer les enfants directs du parentSlug depuis l'API Medusa

	return (
		<header className="py-8 bg-white max-sm:h-fit ">
			<nav className="flex flex-col justify-start px-4 mx-auto gap-y-4 sm:px-6 lg:px-8 max-auto ">
				<NavBarHeaders
					main_category={main_category}
					secondary_category={
						children_category_active?.category_children || category_local
					}
				/>
				<BottomHeader
					secondary_category={children_category_active?.category_children}
					loading={loading}
					parentSlug={parentSlug}
				/>
			</nav>
		</header>
	);
};

export default Header;
