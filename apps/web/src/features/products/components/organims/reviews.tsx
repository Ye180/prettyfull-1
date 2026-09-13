"use client";

import { useProductReviews } from "@/features/products/hooks/use-product-reviews";
import { useReviewForm } from "@/features/products/hooks/use-review-form";
import { Button } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import DrawerReview from "../../../../../../../packages/ui/src/drawer-reviews";
import { ReviewsOneItems } from "../molecules/reviews-items";

const Reviews = ({ productId, className }: { productId: string; className?: string }) => {
	const { reviews, summary, hasMore, loadMore, submitReview, isSubmitting } =
		useProductReviews(productId);
	const { uploadPhotos, isUploading, onSubmit } = useReviewForm(productId, submitReview);

	return (
		<div className={cn(className, "py-9")}>
			<div className="flex flex-wrap gap-8 justify-between items-center">
				{/* Résumé de note — agrandi visuellement, cf. inspo. Pas de star-breakdown
				 * bars ni de carte "AI Reviews Summary" : aucune donnée backend pour
				 * ces deux blocs, on les omet plutôt que de fabriquer des chiffres. */}
				<div>
					<h4 className="mb-2 text-3xl font-bebas-neue">Rating & Reviews</h4>
					<div className="flex gap-3 items-end">
						<span className="text-6xl font-bold leading-none">
							{summary.count > 0 ? summary.average.toFixed(1) : "—"}
						</span>
						<span className="pb-1 text-lg text-gray-500">/5</span>
					</div>
					<span className="text-sm text-gray-500">
						{summary.count > 0 ? `${summary.count} avis` : "Aucun avis pour l'instant"}
					</span>
				</div>
				<DrawerReview
					onSubmit={onSubmit}
					onUploadPhotos={uploadPhotos}
					isSubmitting={isSubmitting}
					isUploading={isUploading}
					triggerLabel="Écrire un avis"
					triggerClassName="bg-primary text-white px-8 py-6 h-fit whitespace-nowrap text-base"
				/>
			</div>

			<div className="py-4 space-y-8 w-full">
				{reviews.length === 0 ? (
					<div className="flex flex-col items-center py-16 text-center">
						<div className="flex justify-center items-center mb-6 w-16 h-16 bg-neutral-100 rounded-full">
							<svg
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
								className="text-neutral-400"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						</div>
						<span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
							Aucun avis
						</span>
						<h3 className="mt-3 text-xl font-semibold text-[#080808]">
							Aucun avis pour le moment
						</h3>
						<p className="mt-2 max-w-sm text-sm text-[#666666]">
							Soyez la première personne à donner votre avis sur ce produit et aidez
							les autres clientes à choisir.
						</p>
						<DrawerReview
							onSubmit={onSubmit}
							onUploadPhotos={uploadPhotos}
							isSubmitting={isSubmitting}
							isUploading={isUploading}
							triggerLabel="Écrire le premier avis"
							triggerClassName="mt-6"
						/>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						{reviews.map((review) => (
							<ReviewsOneItems key={review.id} review={review} />
						))}
					</div>
				)}
			</div>

			{hasMore && (
				<Button
					variant="outline"
					onClick={loadMore}
					className="w-full sm:w-[90%] p-2 py-4 text-lg rounded-full cursor-pointer sm:ml-10 sm:mt-8 sm:flex max-sm:hidden"
				>
					Load more
				</Button>
			)}
		</div>
	);
};

export default Reviews;
