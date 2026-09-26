import { db } from "../index.js";
import * as t from "../schema/index.js";

/**
 * Quelques avis publiés de démonstration, pour que la fiche produit affiche
 * autre chose qu'une liste vide en développement.
 */
const SAMPLE_REVIEWS: {
	productSlug: string;
	rating: number;
	authorName: string;
	authorEmail: string;
	body: string;
	photoUrls?: string[];
}[] = [
	{
		productSlug: "multivitamine-quotidienne",
		rating: 5,
		authorName: "Aminata S.",
		authorEmail: "aminata@example.com",
		body: "Je sens vraiment la différence depuis que j'ai commencé la multivitamine. Facile à avaler et sans arrière-goût.",
	},
	{
		productSlug: "multivitamine-quotidienne",
		rating: 4,
		authorName: "Fatou D.",
		authorEmail: "fatou@example.com",
		body: "Bon produit, dosage clair. J'aurais aimé un format plus grand.",
	},
	{
		productSlug: "proteine-whey-chocolat",
		rating: 5,
		authorName: "Mariam B.",
		authorEmail: "mariam@example.com",
		body: "Excellent goût chocolat, se mélange bien sans grumeaux. Livraison rapide à Abidjan.",
	},
	{
		productSlug: "omega-3-huile-de-poisson",
		rating: 4,
		authorName: "Ibrahim T.",
		authorEmail: "ibrahim@example.com",
		body: "Bon rapport qualité-prix, surtout avec la réduction. Gélules faciles à avaler.",
	},
];

export const seedReviews = async (productIdBySlug: Map<string, string>): Promise<void> => {
	const rows = SAMPLE_REVIEWS.flatMap((review) => {
		const productId = productIdBySlug.get(review.productSlug);
		if (!productId) return [];

		return [
			{
				productId,
				rating: review.rating,
				authorName: review.authorName,
				authorEmail: review.authorEmail,
				body: review.body,
				photoUrls: review.photoUrls ?? [],
				status: "published" as const,
			},
		];
	});

	if (rows.length === 0) return;

	await db.insert(t.reviews).values(rows);
	console.log(`  avis : ${rows.length} avis de démonstration publiés`);
};
