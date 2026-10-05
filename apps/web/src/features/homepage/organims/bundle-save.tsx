"use client";

import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import { getMediaUrl } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useGetBestSellingProducts } from "../api/medusa/get-best-selling-products";
import { useGetFeaturedEntries } from "../api/medusa/get-featured-entries";

/** Clé de section pilotée depuis l'admin (Contenu > Mises en avant). */
const FEATURED_SECTION_KEY = "home_bundle_save";

const PERK_ICONS = {
	truck: (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<rect x="1" y="6" width="14" height="11" rx="1.5" />
			<path d="M15 10h4l3 3.5V17h-7z" />
			<circle cx="6" cy="19.5" r="1.8" />
			<circle cx="17.5" cy="19.5" r="1.8" />
		</svg>
	),
	lab: (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
		</svg>
	),
	shield: (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	),
} as const;

const FALLBACK_IMAGE = "/products/shop/hero-shopping.jpg";

/** Décalage vertical progressif des cartes produit, façon "escalier" discret. */
const CARD_OFFSETS = ["mt-0", "mt-4 sm:mt-6", "mt-8 sm:mt-12", "mt-12 sm:mt-16"];

interface BundleCard {
	id: string;
	handle: string;
	name: string;
	description: string;
	image: string;
}

const toCardFromProduct = (
	product: {
		id: string;
		handle: string;
		title: string;
		description?: string | null;
		thumbnail?: string | null;
	},
	fallbackDescription: string,
): BundleCard => ({
	id: product.id,
	handle: product.handle,
	name: product.title,
	description: product.description?.trim() || fallbackDescription,
	image: getMediaUrl(product.thumbnail) || FALLBACK_IMAGE,
});

/** `target` résolu d'une mise en avant « produit » (cf. module Contenu admin). */
interface FeaturedProductTarget {
	id: string;
	name: string;
	slug: string;
	shortDescription?: string | null;
	thumbnail?: string | null;
}

const toCardFromFeatured = (
	target: FeaturedProductTarget,
	fallbackDescription: string,
): BundleCard => ({
	id: target.id,
	handle: target.slug,
	name: target.name,
	description: target.shortDescription?.trim() || fallbackDescription,
	image: getMediaUrl(target.thumbnail) || FALLBACK_IMAGE,
});

/**
 * Section "Bundle & Save" : incite à composer une routine complète plutôt
 * qu'un seul produit, dans l'identité sobre gris/blanc de la boutique. Les
 * avantages repris (livraison offerte dès 25 000 FCFA, tests labo, satisfait
 * ou remboursé) sont ceux déjà annoncés ailleurs sur le site, pas des paliers
 * de remise fictifs. Les cartes produit en dessous affichent de vraies
 * fiches (photo, nom, description) issues du catalogue.
 */
export const BundleSaveSection = () => {
	const t = useTranslations("HomePage.bundleSave");
	const { data: featuredEntries, isLoading: isLoadingFeatured } =
		useGetFeaturedEntries(FEATURED_SECTION_KEY);
	const { data: rawProducts, isLoading: isLoadingBestSelling } = useGetBestSellingProducts();

	const fallbackDescription = t("cardFallbackDescription");
	const curatedProducts = (featuredEntries ?? [])
		.filter((entry) => entry.kind === "product" && entry.target)
		.map((entry) =>
			toCardFromFeatured(entry.target as unknown as FeaturedProductTarget, fallbackDescription),
		);

	// Les produits curés depuis l'admin (Contenu > Mises en avant) priment ;
	// tant qu'aucun n'est configuré, la section retombe sur les meilleures ventes.
	const isLoading = isLoadingFeatured || (curatedProducts.length === 0 && isLoadingBestSelling);
	const products =
		curatedProducts.length > 0
			? curatedProducts
			: (rawProducts ?? []).slice(0, 4).map((product) => toCardFromProduct(product, fallbackDescription));

	const titleLines = t("title").split("\n");

	const perks = [
		{ icon: "truck", title: t("perk1Title"), label: t("perk1Label") },
		{ icon: "shield", title: t("perk2Title"), label: t("perk2Label") },
		{ icon: "lab", title: t("perk3Title"), label: t("perk3Label") },
	] as const;

	const cardsToShow = isLoading
		? Array.from({ length: 4 }, (_, i) => ({
				id: `skeleton-${i}`,
				handle: "",
				name: "",
				description: "",
				image: "",
			}))
		: products;

	return (
		<section className="w-full py-10 sm:py-16">
			<div className="max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
					{/* Filigrane décoratif */}
					<p
						aria-hidden="true"
						className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-center px-6 font-display font-bold uppercase text-stone-900/5 text-[3.2rem] sm:text-[5.5rem] lg:text-[7rem] leading-[0.95] tracking-tight"
					>
						{t("watermark")}
					</p>

					<div className="relative z-10 px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
						{/* En-tête : message + avantages */}
						<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
							<div className="max-w-xl space-y-4">
								<h2 className="text-stone-900 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
									{titleLines.map((line, i) => (
										<span key={i} className="block">
											{line}
										</span>
									))}
								</h2>
								<p className="max-w-md text-[1.5rem] sm:text-[1.6rem] text-stone-600 leading-relaxed">
									{t("subtitle")}
								</p>
								<Link
									href="/collections"
									className="inline-flex items-center gap-2 mt-2 px-7 py-3.5 bg-stone-900 text-white text-[1.4rem] font-semibold rounded-sm hover:bg-black transition-all shadow-lg"
								>
									<span>{t("ctaButton")}</span>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<line x1="7" y1="17" x2="17" y2="7" />
										<polyline points="7 7 17 7 17 17" />
									</svg>
								</Link>
							</div>

							<div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
								{perks.map((perk) => (
									<div key={perk.icon} className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-4">
										<div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-full border border-stone-300 text-stone-900">
											{PERK_ICONS[perk.icon]}
										</div>
										<div>
											<p className="text-[1.4rem] font-semibold text-stone-900 leading-tight">
												{perk.title}
											</p>
											<span className="inline-block mt-1 px-3 py-0.5 bg-stone-200 text-stone-700 text-[1.2rem] font-medium rounded-sm">
												{perk.label}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Cartes produit décalées, avec de vraies fiches du catalogue.
						    En dessous de lg : carrousel à défilement horizontal, cartes à
						    largeur fixe. À partir de lg : plus de scroll, les cartes se
						    répartissent et grandissent pour occuper toute la largeur de la
						    section, quel que soit leur nombre. */}
						<div className="flex items-start gap-6 overflow-x-auto pt-20 pb-4 snap-x snap-mandatory scrollbar-hide sm:gap-8 lg:flex-wrap lg:overflow-visible lg:pb-0 lg:snap-none lg:pt-28">
							{cardsToShow.map((product, i) => {
								// Les classes de taille/flex vivent sur le wrapper (l'item flex
								// réel du conteneur) ; la carte elle-même se contente de remplir
								// cet espace avec `w-full`, sans quoi `lg:grow` n'aurait aucun
								// effet puisqu'il serait posé sur un enfant, pas sur l'item flex.
								const wrapperClassName = `w-76 shrink-0 snap-start sm:w-88 lg:w-auto lg:shrink lg:grow lg:basis-80 lg:max-w-2xl ${CARD_OFFSETS[i] ?? ""}`;

								const cardBody = (
									<div className="flex w-full h-full flex-col items-center gap-5 rounded-lg border border-stone-200 bg-white px-8 pt-10 pb-9 text-center shadow-sm transition-transform duration-300 hover:-translate-y-2">
										<span className="flex items-center justify-center w-11 h-11 rounded-full bg-stone-100 text-stone-900 text-[1.4rem] font-semibold">
											{String(i + 1).padStart(2, "0")}
										</span>

										{isLoading ? (
											<>
												<div className="w-2/3 h-8 bg-black/10 rounded animate-pulse" />
												<div className="w-full h-5 bg-black/10 rounded animate-pulse" />
											</>
										) : (
											<>
												<h3 className="font-display text-3xl font-bold text-stone-900 tracking-tight line-clamp-2 min-h-[7.4rem]">
													{product.name}
												</h3>
												<p className="text-[1.4rem] text-stone-600 leading-relaxed line-clamp-2 min-h-[4.2rem]">
													{product.description}
												</p>
											</>
										)}

										<div className="relative w-full aspect-4/5 rounded-md overflow-hidden bg-black/5">
											{isLoading ? (
												<div className="w-full h-full animate-pulse bg-black/10" />
											) : (
												<Image
													src={product.image}
													alt={product.name}
													fill
													sizes="(max-width: 640px) 76vw, (max-width: 1024px) 22rem, 33vw"
													className="object-cover"
													unoptimized
												/>
											)}
										</div>

										{!isLoading && (
											<span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[1.4rem] font-semibold text-stone-900 underline underline-offset-4">
												{t("cardCta")}
												<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
													<line x1="7" y1="17" x2="17" y2="7" />
													<polyline points="7 7 17 7 17 17" />
												</svg>
											</span>
										)}
									</div>
								);

								return isLoading || !product.handle ? (
									<div key={product.id} className={wrapperClassName}>
										{cardBody}
									</div>
								) : (
									<Link
										key={product.id}
										href={PRODUCT_PATHS.productDetail(product.handle)}
										className={wrapperClassName}
									>
										{cardBody}
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BundleSaveSection;
