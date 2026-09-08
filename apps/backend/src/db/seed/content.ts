import { db } from "../index.js";
import * as t from "../schema/index.js";
import { SEED_CATEGORIES } from "./catalog-data.js";

/**
 * Contenu éditorial de démonstration (§2.6) : bannières de la page d'accueil,
 * pages statiques et mises en avant.
 *
 * Les `sectionKey` des mises en avant reprennent les clés déjà attendues par
 * le storefront (`third_section`, `sixth_section`, `eight_section`), pour que
 * la page d'accueil existante soit pilotable depuis le panel sans refonte.
 */
export const seedContent = async (
	categoryIdBySlug: Map<string, string>,
	productIdBySlug: Map<string, string>,
): Promise<void> => {
	await db.insert(t.banners).values([
		{
			title: "Nouvelle collection",
			subtitle: "Des pièces pensées pour vous, disponibles dès maintenant.",
			imageUrl: "/banner/banner1.jpg",
			mobileImageUrl: "/banner/banner2.jpg",
			linkUrl: "/collections/nouveautes",
			ctaLabel: "Découvrir",
			placement: "home_hero",
			status: "published",
			position: 0,
			translations: {
				en: { title: "New collection", ctaLabel: "Discover" },
			},
		},
		{
			title: "Soldes jusqu'à -30 %",
			subtitle: "Sélection limitée, pendant que les tailles sont encore là.",
			imageUrl: "/banner/banner4.jpg",
			linkUrl: "/collections/soldes",
			ctaLabel: "En profiter",
			placement: "home_promo",
			status: "published",
			position: 1,
			translations: { en: { title: "Up to 30% off", ctaLabel: "Shop now" } },
		},
		{
			title: "L'essentiel du vestiaire",
			imageUrl: "/collections/banner-mode.jpg",
			linkUrl: "/collections/ensembles",
			placement: "home_secondary",
			status: "published",
			position: 2,
		},
	]);

	const now = new Date();

	await db.insert(t.staticPages).values([
		{
			slug: "conditions-generales-de-vente",
			title: "Conditions générales de vente",
			excerpt: "Les règles applicables à toute commande passée sur PrettyFull.",
			content: [
				"## 1. Objet",
				"",
				"Les présentes conditions régissent les ventes conclues sur la boutique PrettyFull.",
				"",
				"## 2. Commandes",
				"",
				"Toute commande vaut acceptation des prix et descriptions des articles disponibles.",
				"",
				"## 3. Prix",
				"",
				"Les prix sont indiqués en francs CFA, toutes taxes comprises.",
				"",
				"## 4. Paiement",
				"",
				"Le paiement s'effectue par Wave ou à la livraison, selon l'option retenue au moment de la commande.",
			].join("\n"),
			status: "published",
			publishedAt: now,
			metaTitle: "CGV — PrettyFull",
		},
		{
			slug: "livraison-et-retours",
			title: "Livraison et retours",
			excerpt: "Délais, zones desservies et modalités de retour.",
			content: [
				"## Livraison",
				"",
				"- **Abidjan** : 24 à 48 heures, 1 500 FCFA — offerte dès 50 000 FCFA d'achat.",
				"- **Sous-région** : 3 à 7 jours, 8 000 FCFA.",
				"- **International** : 7 à 14 jours, tarif calculé selon le poids.",
				"",
				"## Retours",
				"",
				"Les articles peuvent être retournés sous 14 jours, non portés et dans leur emballage d'origine.",
			].join("\n"),
			status: "published",
			publishedAt: now,
		},
		{
			slug: "a-propos",
			title: "À propos de PrettyFull",
			excerpt: "Une sélection de mode féminine pensée depuis Abidjan.",
			content: [
				"PrettyFull réunit une sélection de pièces féminines choisies une à une :",
				"des matières agréables, des coupes qui tiennent dans le temps, et des",
				"quantités volontairement limitées.",
				"",
				"La boutique est basée à Abidjan et livre dans toute l'Afrique de l'Ouest.",
			].join("\n"),
			status: "published",
			publishedAt: now,
		},
	]);

	// Catégories vedettes : celles porteuses d'une section d'accueil.
	const categoryEntries = SEED_CATEGORIES.filter((category) => category.sectionKey).flatMap(
		(category, index) => {
			const categoryId = categoryIdBySlug.get(category.slug);
			return categoryId
				? [
						{
							kind: "category" as const,
							categoryId,
							productId: null,
							sectionKey: category.sectionKey!,
							position: index,
							isActive: true,
						},
					]
				: [];
		},
	);

	// Produits vedettes de la vitrine d'accueil.
	const featuredProductSlugs = [
		"robe-cocktail-satinee",
		"robe-longue-fluide",
		"ensemble-tailleur",
		"blazer-structure",
	];

	const productEntries = featuredProductSlugs.flatMap((slug, index) => {
		const productId = productIdBySlug.get(slug);
		return productId
			? [
					{
						kind: "product" as const,
						productId,
						categoryId: null,
						sectionKey: "home_featured",
						position: index,
						isActive: true,
					},
				]
			: [];
	});

	await db.insert(t.featuredEntries).values([...categoryEntries, ...productEntries]);

	console.log(
		`  contenu : 3 bannières, 3 pages statiques, ${categoryEntries.length + productEntries.length} mises en avant`,
	);
};
