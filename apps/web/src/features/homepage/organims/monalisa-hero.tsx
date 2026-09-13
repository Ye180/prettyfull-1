"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

interface HeroProduct {
	id: string;
	name: string;
	category: string;
	price: number;
	image: string;
}

const HERO_PRODUCTS: HeroProduct[] = [
	{
		id: "prod_nerdy_black",
		name: "Nerdy Sparkling Short Sleeve T-Shirt Black",
		category: "Apparel • Shirt",
		price: 150,
		image: "/assets/product5.webp",
	},
	{
		id: "prod_kato_zip",
		name: "Kato X Zip Shirt",
		category: "Apparel • Jacket",
		price: 300,
		image: "/assets/product_2.webp",
	},
	{
		id: "prod_liam_fp",
		name: "Liam FP Shirt",
		category: "Apparel • Shirt",
		price: 500,
		image: "/assets/product_2.jpg",
	},
];

export const MonalisaHero = () => {
	const [activeProductIndex, setActiveProductIndex] = useState(0);
	const sectionRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
	const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

	const activeProduct: HeroProduct = HERO_PRODUCTS[activeProductIndex] ?? HERO_PRODUCTS[0]!;

	const handleNext = () => {
		setActiveProductIndex((prev) => (prev + 1) % HERO_PRODUCTS.length);
	};

	const handlePrev = () => {
		setActiveProductIndex((prev) => (prev - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length);
	};

	return (
		<section className="relative w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
			<div ref={sectionRef} className="relative w-full min-h-[580px] lg:min-h-[660px] rounded-[2.8rem] overflow-hidden bg-[#CCD1D5]">
				{/* Background Model Image — fixed-feel parallax: drifts slower than the page scroll */}
				<motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-[1.15]">
					<Image
						src="/home/cover-desktop.jpg"
						alt="Prettyfull New Collection"
						fill
						priority
						sizes="(max-width: 1400px) 100vw, 1400px"
						className="object-cover object-center"
					/>
				</motion.div>

				{/* Subtle Overlay for responsive text contrast */}
				<div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

				{/* Hero Content Grid */}
				<div className="relative z-10 w-full h-full min-h-[580px] lg:min-h-[660px] flex flex-col justify-between p-6 sm:p-10 lg:p-14">
					{/* Top Left: Main Headline */}
					<div className="max-w-xl text-white space-y-4 pt-4 sm:pt-6">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
							Unleash Your Style with Our New Collection
						</h1>
						<p className="text-[1.5rem] sm:text-[1.6rem] text-white/90 leading-relaxed font-normal max-w-lg">
							Unleash your style and express individuality with our new collection,
							designed to elevate your wardrobe and make a bold statement wherever you go.
						</p>
					</div>

					{/* Floating Interactive Card - bottom-right on desktop, compact */}
					<div className="lg:absolute lg:right-12 lg:bottom-10 mt-8 lg:mt-0 w-full max-w-[260px] self-end bg-white/25 backdrop-blur-xl border border-white/40 p-4 rounded-[1.8rem] shadow-2xl transition-all">
						{/* Card Header */}
						<div className="flex items-center justify-between pb-2">
							<span className="text-[1.3rem] font-semibold text-white">
								New Collection
							</span>
							<div className="flex items-center space-x-1.5">
								<button
									onClick={handlePrev}
									aria-label="Previous product"
									className="w-6 h-6 rounded-full bg-white/30 hover:bg-white/60 text-white hover:text-black flex items-center justify-center transition-all cursor-pointer"
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
										<path d="M15 18l-6-6 6-6" />
									</svg>
								</button>
								<button
									onClick={handleNext}
									aria-label="Next product"
									className="w-6 h-6 rounded-full bg-white text-black hover:bg-white/80 flex items-center justify-center transition-all shadow cursor-pointer"
								>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
										<path d="M9 18l6-6-6-6" />
									</svg>
								</button>
							</div>
						</div>

						{/* Product Image Box */}
						<div className="relative w-full h-[110px] bg-[#F3F4F6] rounded-xl overflow-hidden my-2 flex items-center justify-center">
							<Image
								src={activeProduct.image}
								alt={activeProduct.name}
								fill
								sizes="260px"
								className="object-contain p-2 transition-transform duration-300 hover:scale-105"
							/>
						</div>

						{/* Product Info & Price */}
						<div className="flex items-baseline justify-between pt-1">
							<div className="space-y-0.5 max-w-[70%]">
								<h4 className="text-[1.2rem] font-semibold text-white truncate leading-snug">
									{activeProduct.name}
								</h4>
								<span className="text-[1.1rem] text-white/70 block">
									{activeProduct.category}
								</span>
							</div>
							<span className="text-[1.5rem] font-bold text-white">
								${activeProduct.price}
							</span>
						</div>

						{/* ponytail: la bannière illustre la collection, pas le catalogue réel —
						  * elle renvoie vers les collections plutôt que d'ajouter un faux produit. */}
						<Link
							href="/collections"
							className="mt-3 w-full py-2.5 bg-white hover:bg-white/90 text-black text-[1.3rem] font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow hover:shadow-md active:scale-98"
						>
							Shop Now
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MonalisaHero;
