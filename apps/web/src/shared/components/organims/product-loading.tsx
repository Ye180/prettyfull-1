import { Skeleton } from "@prettyfull/ui";

export default function ProductCardSkeleton() {
	return (
		<div className="flex flex-col w-full ">
			{/* Image du produit */}
			<Skeleton className="w-[25rem] md:w-[100%]  h-[30rem]" />

			{/* Label "Best-Seller" */}
			<div className="mt-2">
				<Skeleton className="w-20 h-3 " />
			</div>

			{/* Nom du produit */}
			<div className="mt-2">
				<Skeleton className="w-48 h-4 " />
			</div>

			{/* Prix */}
			<div className="flex items-center justify-between mt-2">
				<Skeleton className="w-16 h-4 " />
				<Skeleton className="w-12 h-4" />
			</div>
		</div>
	);
}
