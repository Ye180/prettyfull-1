import { Skeleton } from "@prettyfull/ui";

export default function ProductCardSkeleton() {
	return (
		<div className="flex flex-col w-full space-y-2 ">
			{/* Image du produit */}
			<Skeleton className="w-100 md:w-full h-140 md:h-170 " />

			{/* Nom du produit - Prix  */}
			<div className="flex justify-between mt-2">
				<Skeleton className="w-1/2 h-8 " />
				<Skeleton className="w-20 h-8 " />
			</div>

			{/* Variable */}
			<div className="flex items-center justify-start mt-2 gap-x-2">
				{Array.from({ length: 3 }).map((_, index) => (
					<Skeleton key={index} className="w-8 h-8 rounded-full" />
				))}
			</div>
		</div>
	);
}
