import { closeDb } from "../index.js";
import {
	createCategory,
	getCategoryBySlug,
} from "../../modules/catalog/categories.service.js";
import {
	getProductBySlug,
	updateProduct,
} from "../../modules/catalog/products.service.js";

/**
 * Ajoute un second niveau de rayons sous les quatre familles qui s'y prêtent
 * (Vitamines, Minéraux, Protéines, Bien-être), pour alimenter le mega-menu de
 * navigation (§ nav-mega-menu). Nouveautés et Soldes restent plats : ce sont
 * des mises en avant marketing, pas des familles de produits.
 *
 * Script ponctuel plutôt qu'ajout à `db:seed` (qui vide toute la base) :
 * exécuté une fois sur une base déjà peuplée, via les mêmes fonctions de
 * service que l'admin utiliserait, pour un `depth`/`path` cohérents. Rejoué
 * sans risque : une sous-catégorie déjà créée est simplement retrouvée par
 * son slug plutôt que recréée, et un produit déjà rattaché n'est pas dupliqué.
 */

interface SubcategorySeed {
	parentSlug: string;
	slug: string;
	name: string;
	nameEn: string;
	/** Produit existant à rattacher en plus de sa catégorie d'origine. */
	productSlug: string;
}

const SUBCATEGORIES: SubcategorySeed[] = [
	// Vitamines
	{ parentSlug: "vitamines", slug: "multivitamines", name: "Multivitamines", nameEn: "Multivitamins", productSlug: "multivitamine-quotidienne" },
	{ parentSlug: "vitamines", slug: "vitamine-c", name: "Vitamine C", nameEn: "Vitamin C", productSlug: "vitamine-c-1000" },
	{ parentSlug: "vitamines", slug: "vitamine-d", name: "Vitamine D", nameEn: "Vitamin D", productSlug: "vitamine-d3-k2" },
	{ parentSlug: "vitamines", slug: "vitamines-b", name: "Vitamines B", nameEn: "Vitamin B", productSlug: "complexe-vitamine-b" },
	// Minéraux
	{ parentSlug: "mineraux", slug: "magnesium", name: "Magnésium", nameEn: "Magnesium", productSlug: "magnesium-marin" },
	{ parentSlug: "mineraux", slug: "zinc", name: "Zinc", nameEn: "Zinc", productSlug: "zinc-cuivre" },
	{ parentSlug: "mineraux", slug: "fer", name: "Fer", nameEn: "Iron", productSlug: "fer-vitamine-c" },
	{ parentSlug: "mineraux", slug: "calcium", name: "Calcium", nameEn: "Calcium", productSlug: "calcium-magnesium-d3" },
	// Protéines
	{ parentSlug: "proteines", slug: "whey", name: "Whey", nameEn: "Whey", productSlug: "proteine-whey-chocolat" },
	{ parentSlug: "proteines", slug: "proteine-vegetale", name: "Protéine végétale", nameEn: "Plant Protein", productSlug: "proteine-vegetale" },
	{ parentSlug: "proteines", slug: "collagene", name: "Collagène", nameEn: "Collagen", productSlug: "collagene-marin" },
	{ parentSlug: "proteines", slug: "recuperation", name: "Récupération", nameEn: "Recovery", productSlug: "bcaa-recuperation" },
	// Bien-être
	{ parentSlug: "bien-etre", slug: "omega-3", name: "Oméga-3", nameEn: "Omega-3", productSlug: "omega-3-huile-de-poisson" },
	{ parentSlug: "bien-etre", slug: "digestion", name: "Digestion", nameEn: "Digestion", productSlug: "probiotique-10-souches" },
	{ parentSlug: "bien-etre", slug: "sommeil-relaxation", name: "Sommeil & Relaxation", nameEn: "Sleep & Relaxation", productSlug: "melatonine-sommeil" },
	{ parentSlug: "bien-etre", slug: "articulations", name: "Articulations", nameEn: "Joints", productSlug: "curcuma-bioperine" },
];

const run = async () => {
	let created = 0;
	let reused = 0;
	let attached = 0;
	let alreadyAttached = 0;

	for (const seed of SUBCATEGORIES) {
		const parent = await getCategoryBySlug(seed.parentSlug);

		let subcategory = await getCategoryBySlug(seed.slug).catch(() => null);
		if (!subcategory) {
			subcategory = await createCategory({
				parentId: parent.id,
				name: seed.name,
				slug: seed.slug,
				description: null,
				imageUrl: parent.imageUrl,
				bannerUrl: null,
				status: "active",
				position: 0,
				isFeatured: false,
				metaTitle: null,
				metaDescription: null,
				translations: { en: { name: seed.nameEn } },
			});
			created++;
			console.log(`  + ${seed.parentSlug} > ${seed.slug}`);
		} else {
			reused++;
		}

		const product = await getProductBySlug(seed.productSlug);
		const existingIds = product.categories.map((category) => category.id);
		if (existingIds.includes(subcategory.id)) {
			alreadyAttached++;
			continue;
		}

		await updateProduct(product.id, { categoryIds: [...existingIds, subcategory.id] });
		attached++;
	}

	console.log(
		`\nterminé : ${created} sous-catégorie(s) créée(s), ${reused} déjà existante(s), ` +
			`${attached} produit(s) rattaché(s), ${alreadyAttached} déjà rattaché(s).`,
	);
};

run()
	.catch((error: unknown) => {
		console.error("échec :", error);
		process.exitCode = 1;
	})
	.finally(() => closeDb());
