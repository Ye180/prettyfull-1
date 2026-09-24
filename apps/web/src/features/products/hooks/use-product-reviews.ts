"use client";

import { fetchReviewSummary, fetchReviews, submitReview } from "@/lib/store-api/reviews";
import type { ReviewInput } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const PAGE_SIZE = 6;

/**
 * Avis d'un produit : liste (publiés uniquement, côté API), moyenne/total, et
 * soumission d'un nouvel avis.
 *
 * La pagination avance par paliers de `limit` plutôt que par page accumulée :
 * plus simple qu'une fusion de pages, largement suffisant pour le volume
 * d'avis attendu sur une fiche produit.
 */
export function useProductReviews(productId: string | undefined) {
	const queryClient = useQueryClient();
	const [limit, setLimit] = useState(PAGE_SIZE);

	const summaryQuery = useQuery({
		queryKey: ["review-summary", productId],
		queryFn: () => fetchReviewSummary(productId!),
		enabled: !!productId,
		staleTime: 60 * 1000,
	});

	const reviewsQuery = useQuery({
		queryKey: ["reviews", productId, limit],
		queryFn: () => fetchReviews(productId!, { page: 1, limit }),
		enabled: !!productId,
		staleTime: 60 * 1000,
	});

	const submit = useMutation({
		mutationFn: (input: ReviewInput) => submitReview(input),
		onSuccess: () => {
			// N'affecte rien tant que l'avis est en `draft`, mais garde le cache
			// honnête pour le jour où le staff le publie.
			queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
			queryClient.invalidateQueries({ queryKey: ["review-summary", productId] });
		},
	});

	const total = reviewsQuery.data?.meta.total ?? 0;
	const reviews = reviewsQuery.data?.data ?? [];

	return {
		reviews,
		summary: summaryQuery.data ?? { average: 0, count: 0 },
		isLoading: reviewsQuery.isLoading || summaryQuery.isLoading,
		hasMore: reviews.length < total,
		loadMore: () => setLimit((current) => current + PAGE_SIZE),
		submitReview: submit.mutateAsync,
		isSubmitting: submit.isPending,
	};
}
