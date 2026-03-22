import { Skeleton } from "@prettyfull/ui";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

export default function ProductSkeleton() {
	return (
		<Container maxWidth="100vw" className="px-4 py-2 mx-auto sm:py-12">
			<div className="flex flex-col gap-8 justify-center lg:gap-14 sm:flex-row">
				{/* Colonne gauche: Galerie */}
				<div className="flex flex-col space-y-4 sm:space-y-8">
					<div className="flex gap-4">
						{/* Thumbnails */}
						<div className="hidden flex-col gap-3 sm:flex">
							{[...Array(4)].map((_, i) => (
								<Skeleton key={i} className="w-16 h-16 bg-gray-200 rounded" />
							))}
						</div>

						{/* Image principale */}
						<Skeleton className="w-full sm:w-[400px] lg:w-[500px] h-[450px] sm:h-[600px] lg:h-[700px] rounded bg-gray-200" />
					</div>

					{/* Reviews desktop */}
					<Skeleton className="hidden lg:block w-[600px] h-[200px] rounded bg-gray-200" />
				</div>

				{/* Colonne droite: Infos produit */}
				<div className="flex flex-col gap-4 w-full sm:w-80 lg:w-[350px]">
					{/* Collection label */}
					<Skeleton className="w-28 h-4 bg-gray-200 rounded" />

					{/* Titre */}
					<Skeleton className="w-3/4 h-8 bg-gray-200 rounded" />

					{/* Rating */}
					<div className="flex gap-1 items-center">
						{[...Array(5)].map((_, i) => (
							<Skeleton key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
						))}
						<Skeleton className="ml-2 w-12 h-4 bg-gray-200 rounded" />
					</div>

					{/* Prix */}
					<Skeleton className="w-32 h-7 bg-gray-200 rounded" />

					{/* Tailles */}
					<div className="flex flex-col gap-2 mt-2">
						<div className="flex flex-wrap gap-2">
							{[...Array(6)].map((_, i) => (
								<Skeleton
									key={i}
									className="w-14 h-10 bg-gray-200 rounded border border-gray-100"
								/>
							))}
						</div>
					</div>

					{/* Couleurs */}
					<div className="flex flex-col gap-2 mt-2">
						<Skeleton className="w-40 h-4 bg-gray-200 rounded" />
						<div className="flex gap-3">
							{[...Array(3)].map((_, i) => (
								<Skeleton
									key={i}
									className="w-9 h-9 bg-gray-200 rounded-full"
								/>
							))}
						</div>
					</div>

					{/* Return info */}
					<Skeleton className="mt-2 w-44 h-4 bg-gray-200 rounded" />

					{/* Boutons Add to Bag + Wishlist */}
					<div className="flex gap-3 mt-2">
						<Skeleton className="flex-1 h-12 bg-gray-300 rounded-md" />
						<Skeleton className="w-12 h-12 bg-gray-200 rounded-md" />
					</div>

					{/* Shipping info */}
					<Skeleton className="mt-1 w-64 h-4 bg-gray-200 rounded" />

					{/* Why you'll love it */}
					<div className="flex flex-col gap-2 mt-4">
						<Skeleton className="w-40 h-5 bg-gray-200 rounded" />
						<Skeleton className="w-full h-16 bg-gray-100 rounded" />
					</div>

					{/* Feature cards */}
					<div className="flex gap-3 mt-2">
						{[...Array(3)].map((_, i) => (
							<Skeleton
								key={i}
								className="flex-1 h-24 bg-gray-100 rounded border border-gray-100"
							/>
						))}
					</div>

					{/* Product Details accordion */}
					<Skeleton className="mt-4 w-full h-12 bg-gray-200 rounded" />
				</div>

				{/* Reviews mobile */}
				<div className="sm:hidden">
					<Skeleton className="w-full h-[150px] rounded bg-gray-200" />
				</div>
			</div>
		</Container>
	);
}
