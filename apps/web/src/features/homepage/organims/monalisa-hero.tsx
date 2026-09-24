"use client";

import { useGetHeroBanner } from "@/features/homepage/api/medusa/get-hero-banner";
import { useGetNewCollectionProducts } from "@/features/homepage/api/medusa/get-new-collection-products";
import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import { useRegionStore } from "@/stores/useRegion";
import { formatCurrency_FR, getMediaUrl } from "@prettyfull/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

const FALLBACK_IMAGE = "/home/cover-desktop.jpg";

export const MonalisaHero = () => {
	const [activeProductIndex, setActiveProductIndex] = useState(0);
	const sectionRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

	const { data: banner } = useGetHeroBanner();
	const { data: rawProducts } = useGetNewCollectionProducts();
	const currencyCode = useRegionStore((state) => state.region?.currency_code);
	const currencySymbol = currencyCode === "xof" ? "FCFA" : "$";

	const heroProducts = useMemo(
		() =>
			(rawProducts ?? []).slice(0, 5).map((product) => ({
				id: product.id,
				handle: product.handle,
				name: product.title,
				category: product.collection?.title ?? "Nouveauté",
				price: product.variants[0]?.calculated_price?.calculated_amount ?? 0,
				image: getMediaUrl(product.thumbnail) || "/assets/product_2.jpg",
			})),
		[rawProducts],
	);

	const activeProduct =
		heroProducts[activeProductIndex % Math.max(heroProducts.length, 1)];

	const handleNext = () => {
		setActiveProductIndex((prev) =>
			heroProducts.length ? (prev + 1) % heroProducts.length : 0,
		);
	};

	const handlePrev = () => {
		setActiveProductIndex((prev) =>
			heroProducts.length
				? (prev - 1 + heroProducts.length) % heroProducts.length
				: 0,
		);
	};

	const heroImage = getMediaUrl(banner?.image) || FALLBACK_IMAGE;
	const heroTitle = banner?.title || "Nouvelle collection";
	const heroSubtitle =
		banner?.subtitle ||
		"Des pièces pensées pour vous, à porter au quotidien comme pour vos plus belles occasions.";
	const heroCta = banner?.cta || "Découvrir";
	const heroLink = banner?.link || "/collections";

	return (
		<section className="relative w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
			<div
				ref={sectionRef}
				className="relative w-full min-h-[580px] lg:min-h-[660px] rounded-[2.8rem] overflow-hidden bg-[#CCD1D5]"
			>
				{/* Image de fond - effet parallax léger : dérive plus lentement que le défilement */}
				<motion.div
					style={{ y: parallaxY }}
					className="absolute inset-0 scale-[1.15]"
				>
					<Image
						src={heroImage}
						alt={heroTitle}
						fill
						priority
						sizes="(max-width: 1400px) 100vw, 1400px"
						className="object-cover object-center"
						unoptimized
					/>
				</motion.div>

				<div className="absolute inset-0 bg-gradient-to-r via-transparent to-transparent pointer-events-none from-black/20" />

				{/* Contenu */}
				<div className="relative z-10 w-full h-full min-h-[580px] lg:min-h-[660px] flex flex-col justify-between p-6 sm:p-10 lg:p-14">
					<div className="pt-4 space-y-4 max-w-xl text-white sm:pt-6">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
							{heroTitle}
						</h1>
						<p className="text-[1.5rem] sm:text-[1.6rem] text-white/90 leading-relaxed font-normal max-w-lg">
							{heroSubtitle}
						</p>
						<Link
							href={heroLink}
							className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-white text-black text-[1.4rem] font-semibold rounded-full hover:bg-white/90 transition-colors"
						>
							{heroCta}
						</Link>
					</div>

					{/* Carte flottante - produits récents */}
					{activeProduct && (
						<div className="lg:absolute lg:right-12 lg:bottom-10 mt-8 lg:mt-0 w-full max-w-[260px] self-end bg-white/25 backdrop-blur-xl border border-white/40 p-4 rounded-[1.8rem] shadow-2xl transition-all">
							<div className="flex justify-between items-center pb-2">
								<span className="text-[1.3rem] font-semibold text-white">
									Nouveautés
								</span>
								<div className="flex items-center space-x-1.5">
									<button
										onClick={handlePrev}
										aria-label="Produit précédent"
										className="flex justify-center items-center w-6 h-6 text-white rounded-full transition-all cursor-pointer bg-white/30 hover:bg-white/60 hover:text-black"
									>
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
										>
											<path d="M15 18l-6-6 6-6" />
										</svg>
									</button>
									<button
										onClick={handleNext}
										aria-label="Produit suivant"
										className="flex justify-center items-center w-6 h-6 text-black bg-white rounded-full shadow transition-all cursor-pointer hover:bg-white/80"
									>
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
										>
											<path d="M9 18l6-6-6-6" />
										</svg>
									</button>
								</div>
							</div>

							<div className="relative w-full h-[110px] bg-[#F3F4F6] rounded-xl overflow-hidden my-2 flex items-center justify-center">
								<Image
									src={activeProduct.image}
									alt={activeProduct.name}
									fill
									sizes="260px"
									className="object-contain p-2 transition-transform duration-300 hover:scale-105"
									unoptimized
								/>
							</div>

							<div className="flex justify-between items-baseline pt-1">
								<div className="space-y-0.5 max-w-[70%]">
									<h4 className="text-[1.2rem] font-semibold text-white truncate leading-snug">
										{activeProduct.name}
									</h4>
									<span className="text-[1.1rem] text-white/70 block">
										{activeProduct.category}
									</span>
								</div>
								<span className="text-[1.5rem] font-bold text-white">
									{formatCurrency_FR(activeProduct.price, currencySymbol)}
								</span>
							</div>

							<Link
								href={PRODUCT_PATHS.productDetail(activeProduct.handle)}
								className="mt-3 w-full py-2.5 bg-white hover:bg-white/90 text-black text-[1.3rem] font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow hover:shadow-md active:scale-98"
							>
								Voir le produit
							</Link>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default MonalisaHero;
