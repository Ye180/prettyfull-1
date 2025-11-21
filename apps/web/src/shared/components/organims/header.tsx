"use client";

import { useGetChildrenCategory } from "@/features/homepage/api/backend/get-children-category";
// import { getItem } from "@/lib/utils/local-storage";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
// Importe useState et useEffect
import { useGetProductsByHandleMedusa } from "@/features/products/api/medusa/get-product-by-handle-medusa";
import { sdk } from "@/lib/api/sdk";
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

	const { data: product, isLoading } = useGetProductsByHandleMedusa(
		params.id as string
	);

	const children_category_active = main_category?.find(
		(cat: any) => cat.handle === params.id
	);

	const categoryByHandle = sdk.store.category
		.list({
			handle: params.id,
		})
		.then(({ product_categories }) => {
			return product_categories[0];
		});

	// 1. Initialise la catégorie à 'undefined' (comme sur le serveur)
	// const [category, setCategory] = useState<any>(getItem("category")); // Le tableau vide signifie "exécute-moi une seule fois au chargement"

	const normalizedSlug = Array.isArray(params.id)
		? params.id[0]
		: (params.id ?? division ?? "");

	const { data: children_category, isLoading: secondaryLoading } =
		useGetChildrenCategory(normalizedSlug as string);

	// Récupérer le parent slug depuis l'URL ou depuis les params
	const parentSlug = useMemo(() => {
		// D'abord vérifier le query param division
		if (division) return division;

		// Sinon, essayer de trouver le parent dans main_category à partir de params.id
		if (params.id && main_category) {
			const found = main_category.find((cat: any) => cat.slug === params.id);
			return found?.slug;
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

	// const { product_categories: directChildren } = sdk.store.category.list({
	// 	parent_category_id: parentCategory.id,
	// });

	return (
		<header className="py-8 bg-white max-sm:h-fit ">
			<nav className="flex flex-col justify-start px-4 mx-auto gap-y-4 sm:px-6 lg:px-8 max-auto ">
				<NavBarHeaders
					main_category={main_category}
					secondary_category={children_category_active?.category_children}
				/>
				<BottomHeader
					// 3. Le premier rendu sera `children_category || undefined`
					//    Le second rendu (après le useEffect) sera `children_category || [données du local storage]`
					secondary_category={children_category_active?.category_children}
					loading={loading}
					parentSlug={parentSlug}
				/>
			</nav>
		</header>
	);
};

export default Header;
