"use client";

import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Search,
} from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useFaqFilters } from "../hooks/use-faq-filters";

const Content = () => {
	const {
		categories,
		selectedCategory,
		setSelectedCategory,
		searchQuery,
		setSearchQuery,
		visibleItems,
		hasMore,
		loadMore,
	} = useFaqFilters();

	return (
		<div className="pb-20 w-full text-gray-900 bg-white">
			{/* Top Hero Banner */}
			<PhotoOverlayBanner
				image="/category/category-principale.jpg"
				imageAlt="Assistance PrettyFull"
				height="lg"
				topLabels={["Centre d'aide", "Réponses rapides", "Service client"]}
				title="Comment pouvons-nous vous aider ?"
				subtitle="Trouvez rapidement des réponses à vos questions sur les commandes, la livraison, les retours et nos produits."
				titleAlign="bottom-left"
			/>

			{/* Main Content: 2 Columns */}
			<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
					{/* Left Column: Filter and Search */}
					<div className="space-y-8 lg:col-span-4">
						<div className="space-y-3">
							<span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
								Assistance
							</span>
							<h2 className="font-sans text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-950">
								Parcourir les questions
							</h2>
						</div>

						{/* Search Input */}
						<div className="relative w-full">
							<Search className="absolute left-4 top-1/2 w-4 h-4 text-gray-400 -translate-y-1/2" />
							<input
								type="search"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder="Rechercher..."
								className="py-3.5 pr-4 pl-11 w-full text-sm bg-[#F9FAFB] rounded-full border border-gray-200 outline-none placeholder:text-gray-400 focus:border-black transition font-medium"
							/>
						</div>

						{/* Category Pills */}
						<div className="space-y-2">
							<p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
								Catégories
							</p>
							<div className="flex flex-wrap gap-2 pt-1">
								<button
									type="button"
									onClick={() => setSelectedCategory(null)}
									className={cn(
										"rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
										selectedCategory === null
											? "bg-black text-white border-black shadow-xs"
											: "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
									)}
								>
									Tous les sujets
								</button>
								{categories.map((category) => {
									const isActive = selectedCategory === category;
									return (
										<button
											key={category}
											type="button"
											onClick={() =>
												setSelectedCategory(isActive ? null : category)
											}
											className={cn(
												"px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer sm:text-sm",
												isActive
													? "text-white bg-black border-black shadow-xs"
													: "text-gray-700 bg-white border-gray-200 hover:border-gray-300",
											)}
										>
											{category}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Right Column: Accordion Items */}
					<div className="space-y-4 lg:col-span-8">
						<Accordion
							type="single"
							collapsible
							defaultValue={visibleItems[2]?.title}
							className="flex flex-col gap-3.5 w-full"
						>
							{visibleItems.map((item) => (
								<AccordionItem
									key={item.title}
									value={item.title}
									className="px-6 py-1 rounded-2xl border border-gray-200 bg-[#F9FAFB] transition-all duration-200 data-[state=open]:bg-black data-[state=open]:border-black data-[state=open]:text-white shadow-xs"
								>
									<AccordionTrigger className="py-4 font-sans text-base font-bold tracking-tight text-left sm:text-lg hover:no-underline">
										{item.title}
									</AccordionTrigger>
									<AccordionContent className="pb-5 text-sm font-normal leading-relaxed opacity-90 sm:text-base">
										{item.description}
									</AccordionContent>
								</AccordionItem>
							))}

							{visibleItems.length === 0 && (
								<div className="p-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-200">
									Aucun résultat pour «&nbsp;{searchQuery}&nbsp;». Essayez une
									autre recherche ou sélectionnez une catégorie.
								</div>
							)}
						</Accordion>

						{hasMore && (
							<div className="flex justify-start pt-6">
								<button
									type="button"
									onClick={loadMore}
									className="px-8 py-3.5 text-sm font-semibold rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 transition-colors shadow-xs cursor-pointer"
								>
									Voir plus...
								</button>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Bottom Stratosphere Banner */}
			<PhotoOverlayBanner
				image="/home/sublime-1.jpg"
				title="Sublimez votre style"
				subtitle="Prêt à passer au niveau supérieur ? Découvrez nos pièces phares et osez de nouvelles associations."
				cta={{ label: "Découvrir la boutique", href: "/collections" }}
			/>
		</div>
	);
};

export default Content;
