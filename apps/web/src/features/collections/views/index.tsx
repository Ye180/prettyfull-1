"use client";

import GridCollectionLayout from "@/features/collections/organims/grid-layout";
import CategoryCollection from "@/features/collections/organims/mini-category";
import Filter from "@/features/homepage/molecules/collections/apps/filter";
import DrawerLayout from "@/features/homepage/molecules/collections/drawer-layout";
import { useGetSampleProducts } from "@/shared/api/medusa/get-sample-products";
import {
	normalizeCollectionProducts,
	normalizeStandaloneProducts,
} from "@prettyfull/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search } from "../../../../../../packages/ui/src/icons/search.icon";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const CollectionViews = () => {
	const params = useParams();

	const { data, isLoading: loadingProducts } = useGetSampleProducts(
		params.slug as string,
	);

	// Normaliser les collections
	const normalizedCollections =
		data?.collections.map((col) =>
			normalizeCollectionProducts({
				collection_id: col.collection_id as string,
				collection: col.collection,
				products: col.products,
			}),
		) ?? [];

	// Normaliser les produits standalone
	const normalizedStandalone = normalizeStandaloneProducts(
		data?.standaloneProducts ?? [],
	);

	// Fusionner les deux pour l'affichage
	const allProducts = [...normalizedCollections, ...normalizedStandalone];

	const categoryName = data?.category?.name ?? "";
	const totalProducts = allProducts.length;

	return (
		<div className="pb-32">
			<Container maxWidth="100vw" className="px-4 lg:px-6">
				<div className="flex flex-col gap-8 md:flex-row md:gap-10">
					{/* Sidebar */}
					<aside className="w-[200px]! shrink-0 max-md:hidden">
						<div className="sticky top-24 space-y-4">
							<div className="flex gap-3 justify-between items-baseline pb-3 border-b border-neutral-200">
								<p className="text-[1.4rem]! font-bold tracking-wider uppercase whitespace-nowrap">
									Refine By
								</p>
								<span className="text-[1.5rem] text-neutral-500 whitespace-nowrap">
									{totalProducts} products
								</span>
							</div>
							<div className="flex gap-2 items-center px-3 py-2 rounded-full border border-neutral-200">
								<Search className="w-4 h-4 text-neutral-400 shrink-0" />
								<input
									type="text"
									placeholder={`Search within ${categoryName || "collection"}...`}
									className="flex-1 min-w-0 text-[1.2rem] bg-transparent border-none outline-none placeholder:text-neutral-400"
								/>
							</div>
							<div className="pt-2">
								<Filter />
							</div>
						</div>
					</aside>

					{/* Main column */}
					<div className="flex-1 space-y-8 min-w-0">
						{/* Title row + category thumbnails */}
						<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
							<h1 className="text-[3.7rem]! font-bold tracking-wide uppercase text-black leading-tight">
								{categoryName || "Collection"}
							</h1>
							<div className="flex-1 w-full min-w-0">
								<CategoryCollection />
							</div>
						</div>

						{/* Breadcrumb + sort/show bar */}
						<div className="flex flex-wrap gap-4 justify-between items-center pb-4 border-b border-neutral-200">
							<nav className="flex items-center gap-2 text-[1.2rem] text-neutral-600">
								<Link href="/" className="hover:text-black">
									Home
								</Link>
								<span className="text-neutral-400">›</span>
								<span className="text-black">{categoryName}</span>
							</nav>
							<div className="flex gap-6 items-center">
								<div className="flex items-center gap-2 text-[1.2rem] text-neutral-600">
									<span className="tracking-wider uppercase">Show</span>
									<button
										type="button"
										className="px-3 py-1 font-semibold text-black rounded-md border border-neutral-300"
									>
										60
									</button>
									<button
										type="button"
										className="px-3 py-1 text-neutral-500 hover:text-black"
									>
										120
									</button>
								</div>
								<div className="md:hidden">
									<DrawerLayout />
								</div>
							</div>
						</div>

						{/* Products grid */}
						<GridCollectionLayout
							products={allProducts}
							loading={loadingProducts}
						/>
					</div>
				</div>
			</Container>
		</div>
	);
};
export default CollectionViews;
