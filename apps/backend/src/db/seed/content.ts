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
			title: "Des compléments pensés pour votre santé",
			subtitle: "Vitamines, minéraux et compléments naturels testés en laboratoire, disponibles dès maintenant.",
			imageUrl: "/home/supplements-hero-lifestyle.jpg",
			mobileImageUrl: "/home/supplements-hero-lifestyle.jpg",
			linkUrl: "/collections/nouveautes",
			ctaLabel: "Découvrir la gamme",
			placement: "home_hero",
			status: "published",
			position: 0,
			translations: {
				en: { title: "Supplements designed for your health", ctaLabel: "Discover" },
			},
		},
		{
			title: "Votre bien-être, notre priorité",
			subtitle: "Formules testées en laboratoire, ingrédients sélectionnés avec soin.",
			imageUrl: "/home/supplements-hero-flatlay.jpg",
			linkUrl: "/collections/soldes",
			ctaLabel: "En profiter",
			placement: "home_promo",
			status: "published",
			position: 1,
			translations: { en: { title: "Your wellness, our priority", ctaLabel: "Shop now" } },
		},
		{
			title: "L'essentiel de votre routine santé",
			imageUrl: "/home/supplements-hero-colorful.jpg",
			linkUrl: "/collections/vitamines",
			placement: "home_secondary",
			status: "published",
			position: 2,
		},
		{
			title: "Nos best-sellers santé & bien-être",
			subtitle: "Vitamines, protéines et compléments plébiscités par notre communauté.",
			imageUrl: "/home/supplements-hero-lifestyle.jpg",
			linkUrl: "#catalog-grid",
			ctaLabel: "Achetez maintenant",
			placement: "collection_top",
			status: "published",
			position: 0,
		},
		{
			title: "Soldes Mi-Saison",
			subtitle: "Jusqu'à -40% sur une sélection de compléments",
			imageUrl: "/home/supplements-hero-blue-powder.jpg",
			linkUrl: "#catalog-grid",
			ctaLabel: "Voir les soldes",
			placement: "collection_promo",
			status: "published",
			position: 0,
		},
		{
			title: "Formules Quotidiennes",
			subtitle: "Des compléments légers à intégrer facilement chaque jour",
			imageUrl: "/products/multivitamin.jpg",
			linkUrl: "#catalog-grid",
			ctaLabel: "Explorer",
			placement: "collection_promo",
			status: "published",
			position: 1,
		},
		{
			title: "Prêt à prendre soin de vous ?",
			subtitle:
				"Découvrez notre gamme complète de vitamines et compléments, sélectionnés pour votre bien-être au quotidien.",
			imageUrl: "/products/gummies.jpg",
			linkUrl: "/collections",
			ctaLabel: "Découvrir la boutique",
			placement: "collection_footer",
			status: "published",
			position: 0,
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
			metaTitle: "CGV - PrettyFull",
		},
		{
			slug: "livraison-et-retours",
			title: "Livraison et retours",
			excerpt: "Délais, zones desservies et modalités de retour.",
			content: [
				"## Livraison",
				"",
				"- **Abidjan** : 24 à 48 heures, 1 500 FCFA - offerte dès 50 000 FCFA d'achat.",
				"- **Sous-région** : 3 à 7 jours, 8 000 FCFA.",
				"- **International** : 7 à 14 jours, tarif calculé selon le poids.",
				"",
				"## Retours",
				"",
				"Les produits peuvent être retournés sous 14 jours, emballage scellé et non ouvert, pour des raisons d'hygiène et de sécurité sanitaire.",
			].join("\n"),
			status: "published",
			publishedAt: now,
		},
		{
			slug: "a-propos",
			title: "À propos de PrettyFull",
			excerpt: "Une sélection de vitamines et compléments pensée depuis Abidjan.",
			content: [
				"PrettyFull réunit une sélection de vitamines et compléments choisis un à un :",
				"des ingrédients de qualité, des dosages testés en laboratoire, et des",
				"lots volontairement limités pour rester frais.",
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
		"multivitamine-quotidienne",
		"magnesium-marin",
		"proteine-whey-chocolat",
		"omega-3-huile-de-poisson",
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

	await db.insert(t.contentHighlights).values([
		{
			icon: "lab",
			title: "Testé en Laboratoire",
			description:
				"Chaque formule est analysée par un laboratoire indépendant pour garantir sa pureté, son dosage exact et sa sécurité, lot après lot.",
			sectionKey: "home_trust",
			position: 0,
			status: "published",
		},
		{
			icon: "leaf",
			title: "Sans OGM et Végétalien",
			description:
				"Ingrédients naturels, sans OGM, sans gluten ajouté et formules végétaliennes disponibles sur toute la gamme.",
			sectionKey: "home_trust",
			position: 1,
			status: "published",
		},
		{
			icon: "shield",
			title: "Satisfaction Garantie",
			description:
				"30 jours pour changer d'avis. Notre équipe reste à votre écoute pour vous accompagner dans votre routine bien-être.",
			sectionKey: "home_trust",
			position: 2,
			status: "published",
		},
	]);

	console.log(
		`  contenu : 7 bannières, 3 pages statiques, ${categoryEntries.length + productEntries.length} mises en avant, 3 blocs de confiance`,
	);
};
