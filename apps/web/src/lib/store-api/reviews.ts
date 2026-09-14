import type { Paginated, Review, ReviewInput, ReviewSummary } from "@prettyfull/contracts";
import { storeApi, toQuery } from "./client";

/** Avis publiés d'un produit, paginés. */
export const fetchReviews = (
	productId: string,
	params: { page?: number; limit?: number } = {},
) =>
	storeApi.get<Paginated<Review>>(
		`/api/store/reviews${toQuery({ productId, ...params })}`,
	);

export const fetchReviewSummary = (productId: string) =>
	storeApi.get<ReviewSummary>(`/api/store/reviews/summary${toQuery({ productId })}`);

/**
 * Soumission d'un avis depuis la fiche produit.
 *
 * Route publique : aucune session n'est requise, et aucun renouvellement de
 * jeton ne doit être tenté sur une éventuelle 401.
 */
export const submitReview = (input: ReviewInput) =>
	storeApi.post<{ success: boolean; id?: string }>("/api/store/reviews", input, true);
