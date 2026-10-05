import { COLLECTION_PATHS, paths } from "@/lib/routes/paths-en";
import type { StoreCategory } from "@/lib/store-api/types";
import { getMediaUrl } from "@prettyfull/utils";
import type { PromoTile } from "./nav-mega-menu";

const BEST_SELLERS_IMAGE = "/products/shop/perfume.jpg";

/**
 * Les 2 visuels d'appel partagés par le mega-menu desktop et le tiroir
 * mobile : "Meilleures ventes" (générique) et "Nouveautés" (vrai rayon du
 * catalogue, avec sa vraie image) - jamais la catégorie elle-même en double
 * si elle est déjà celle qu'on consulte.
 */
export const buildNavPromoTiles = (
	categories: StoreCategory[],
	t: (key: string) => string,
	activeHandle?: string,
): PromoTile[] => {
	const newArrivals = categories.find((cat) => cat.handle === "nouveautes");
	const newArrivalsImage =
		getMediaUrl(newArrivals?.product_category_image?.[0]?.url) || BEST_SELLERS_IMAGE;

	return [
		{
			title: t("bestSellersTitle"),
			subtitle: t("bestSellersSubtitle"),
			image: BEST_SELLERS_IMAGE,
			href: paths.collections,
		},
		...(newArrivals && newArrivals.handle !== activeHandle
			? [
					{
						title: t("newArrivalsTitle"),
						subtitle: t("newArrivalsSubtitle"),
						image: newArrivalsImage,
						href: COLLECTION_PATHS.collectionDetail(newArrivals.handle),
					},
				]
			: []),
	];
};

/** Libellés de nav façon naturium : les deux rayons soins portent un nom court anglais. */
const NAV_LABEL_OVERRIDES: Record<string, string> = {
	"soins-visage": "Skincare",
	"soins-corps": "Bodycare",
};

export const navLabel = (category: StoreCategory): string =>
	NAV_LABEL_OVERRIDES[category.handle] ?? category.name;
