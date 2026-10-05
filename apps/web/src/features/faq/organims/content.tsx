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
import { useTranslations } from "next-intl";
import { useFaqFilters } from "../hooks/use-faq-filters";

const Content = () => {
	const t = useTranslations("FaqPage");
	const {
		categories,
		categoryLabel,
		selectedCategory,
		setSelectedCategory,
		searchQuery,
		setSearchQuery,
		visibleItems,
		hasMore,
		loadMore,
	} = useFaqFilters();

	return (
		<div className="pb-20 w-full">
			<header className="border-b bg-(--color-surface-card) border-(--color-surface-border)">
				<div className="px-6 py-16 mx-auto max-w-[130rem] sm:py-20 lg:px-10">
					<p className="text-[1.3rem] font-semibold tracking-[0.14em] uppercase text-(--color-surface-muted)">
						{t("banner.eyebrow")}
					</p>
					<h1 className="mt-4 text-[4rem]! sm:text-[5.6rem]!">{t("banner.title")}</h1>
					<p className="mt-5 max-w-[60ch] text-[1.6rem] leading-relaxed text-(--color-ink)/75">{t("banner.subtitle")}</p>
				</div>
			</header>

			{/* Main Content: 2 Columns */}
			<section className="px-6 py-16 mx-auto max-w-[130rem] sm:py-20 lg:px-10">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
					{/* Left Column: Filter and Search */}
					<div className="space-y-8 lg:col-span-4">
						<div className="space-y-3">
							<span className="text-[1.25rem] font-semibold tracking-[0.14em] uppercase text-(--color-surface-muted)">
								{t("sidebar.eyebrow")}
							</span>
							<h2 className="text-[3rem]! sm:text-[3.4rem]!">
								{t("sidebar.title")}
							</h2>
						</div>

						{/* Search Input */}
						<div className="relative w-full">
							<Search className="absolute left-4 top-1/2 w-4 h-4 text-gray-400 -translate-y-1/2" />
							<input
								type="search"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder={t("sidebar.searchPlaceholder")}
								className="py-3.5 pr-4 pl-11 w-full text-[1.4rem] bg-white border outline-none transition border-(--color-surface-border) placeholder:text-(--color-surface-muted) focus:border-(--color-ink)"
							/>
						</div>

						{/* Category Pills */}
						<div className="space-y-2">
							<p className="text-[1.2rem] font-semibold tracking-[0.12em] uppercase text-(--color-surface-muted)">
								{t("sidebar.categoriesLabel")}
							</p>
							<div className="flex flex-wrap gap-2 pt-1">
								<button
									type="button"
									onClick={() => setSelectedCategory(null)}
									className={cn(
										"border px-4 py-2 text-[1.3rem] font-medium transition-all cursor-pointer",
										selectedCategory === null
											? "bg-(--color-ink) text-white border-(--color-ink)"
											: "border-(--color-surface-border) bg-white text-(--color-ink)/80 hover:border-(--color-ink)",
									)}
								>
									{t("sidebar.allCategories")}
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
												"px-4 py-2 text-[1.3rem] font-medium border transition-all cursor-pointer",
												isActive
													? "bg-(--color-ink) text-white border-(--color-ink)"
													: "border-(--color-surface-border) bg-white text-(--color-ink)/80 hover:border-(--color-ink)",
											)}
										>
											{categoryLabel(category)}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Right Column: Accordion Items */}
					<div className="space-y-4 lg:col-span-8">
						<Accordion type="single" collapsible className="w-full border-t border-(--color-surface-border)">
							{visibleItems.map((item) => (
								<AccordionItem
									key={item.title}
									value={item.title}
									className="border-b border-(--color-surface-border)"
								>
									<AccordionTrigger className="py-5 text-[1.6rem] font-medium text-left hover:no-underline text-(--color-ink)">
										{item.title}
									</AccordionTrigger>
									<AccordionContent className="pb-6 max-w-[70ch] text-[1.5rem] leading-relaxed text-(--color-ink)/75">
										{item.description}
									</AccordionContent>
								</AccordionItem>
							))}

							{visibleItems.length === 0 && (
								<div className="p-12 text-center text-[1.5rem] text-(--color-surface-muted) bg-(--color-surface-card)">
									{t("noResults", { query: searchQuery })}
								</div>
							)}
						</Accordion>

						{hasMore && (
							<div className="flex justify-start pt-6">
								<button
									type="button"
									onClick={loadMore}
									className="px-8 py-3.5 text-[1.3rem] font-semibold tracking-[0.08em] uppercase border transition-colors cursor-pointer border-(--color-ink) text-(--color-ink) hover:bg-(--color-ink) hover:text-white"
								>
									{t("loadMore")}
								</button>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Bottom Stratosphere Banner */}
			<PhotoOverlayBanner
				image="/products/shop/hero-shopping-alt.jpg"
				title={t("bottomBanner.title")}
				subtitle={t("bottomBanner.subtitle")}
				cta={{ label: t("bottomBanner.cta"), href: "/contact" }}
			/>
		</div>
	);
};

export default Content;
