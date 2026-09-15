import { db } from "../index.js";
import * as t from "../schema/index.js";
/**
 * Quelques avis publiés de démonstration, pour que la fiche produit affiche
 * autre chose qu'une liste vide en développement.
 */
const SAMPLE_REVIEWS = [
    {
        productSlug: "robe-cocktail-satinee",
        rating: 5,
        authorName: "Aminata S.",
        authorEmail: "aminata@example.com",
        body: "Tissu magnifique, coupe parfaite. Je l'ai portée pour un mariage et j'ai reçu beaucoup de compliments.",
        photoUrls: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
        ],
    },
    {
        productSlug: "robe-cocktail-satinee",
        rating: 4,
        authorName: "Fatou D.",
        authorEmail: "fatou@example.com",
        body: "Très jolie robe, taille un peu grand donc je recommande de prendre une taille en dessous.",
    },
    {
        productSlug: "blazer-structure",
        rating: 5,
        authorName: "Mariam B.",
        authorEmail: "mariam@example.com",
        body: "Qualité au rendez-vous, tombe parfaitement. Livraison rapide à Abidjan.",
        photoUrls: [
            "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600",
        ],
    },
    {
        productSlug: "jean-slim-delave",
        rating: 4,
        authorName: "Ibrahim T.",
        authorEmail: "ibrahim@example.com",
        body: "Bon rapport qualité-prix, surtout avec la réduction. Denim confortable.",
    },
];
export const seedReviews = async (productIdBySlug) => {
    const rows = SAMPLE_REVIEWS.flatMap((review) => {
        const productId = productIdBySlug.get(review.productSlug);
        if (!productId)
            return [];
        return [
            {
                productId,
                rating: review.rating,
                authorName: review.authorName,
                authorEmail: review.authorEmail,
                body: review.body,
                photoUrls: review.photoUrls ?? [],
                status: "published",
            },
        ];
    });
    if (rows.length === 0)
        return;
    await db.insert(t.reviews).values(rows);
    console.log(`  avis : ${rows.length} avis de démonstration publiés`);
};
//# sourceMappingURL=reviews.js.map