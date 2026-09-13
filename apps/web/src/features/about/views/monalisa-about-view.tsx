"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";

const PILLARS = [
	{
		title: "Brand Positioning",
		description:
			"We prioritize clean lines and intentional details, blending contemporary silhouettes with a minimalist aesthetic for timeless elegance.",
	},
	{
		title: "Design Philosophy",
		description:
			"We exist to simplify your daily wardrobe by providing essential, high-quality pieces for your important everyday moments.",
	},
	{
		title: "Brand Purpose",
		description:
			"As a confident choice, our brand elevates your refined lifestyle through sophisticated, intentionally crafted fashion.",
	},
];

const TEXTURE_POINTS = [
	{
		number: "01",
		title: "Premium Material Selection",
		description:
			"Sourced from premier heritage mills, prioritizing natural drape, long-lasting durability, and maximum comfort against the skin.",
	},
	{
		number: "02",
		title: "Precision Tailoring",
		description:
			"Every seam, hem, and stitch is engineered to flatter natural body movement without stiffness or excess bulk.",
	},
	{
		number: "03",
		title: "Thoughtful Finishing",
		description:
			"Subtle horn buttons, bonded edges, and reinforced seams that stand up to daily life while maintaining pure architectural lines.",
	},
];

const RESPONSIBILITY_POINTS = [
	{
		title: "Conscious Material Choices",
		description:
			"We prioritize sourcing eco-friendly and sustainable textiles to ensure a lower environmental footprint for every collection.",
	},
	{
		title: "Longevity Over Fast Fashion",
		description:
			"Our design approach focuses on superior quality and durability, encouraging a more permanent and sustainable wardrobe.",
	},
	{
		title: "Better Pieces Beyond Seasons",
		description:
			"We intentionally create fewer, high-quality garments that remain relevant and stylish regardless of changing seasonal trends.",
	},
];

const TESTIMONIALS = [
	{
		quote:
			"The silhouette and fabric weight of the knitwear is comparable to heritage Parisian houses. A true everyday staple in my rotation.",
		author: "Sarah Jenkins",
		role: "Creative Director, New York",
		avatar: "/home/arrivals-1.jpg",
	},
	{
		quote:
			"Exceptional drape and attention to seams. Prettyfull has redefined my capsule wardrobe with effortless sophistication.",
		author: "David Vance",
		role: "Architect, London",
		avatar: "/home/arrivals-2.jpg",
	},
	{
		quote:
			"Subtle luxury at its finest. Clean lines, extraordinary touch, and timeless cuts that feel both modern and eternal.",
		author: "Elena Rostova",
		role: "Fashion Editor, Milan",
		avatar: "/home/arrivals-3.jpg",
	},
];

const MonalisaAboutView = () => {
	return (
		<main className="w-full min-h-screen bg-white text-gray-900 pb-20">
			{/* SECTION 1: HERO */}
			<section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
				<div className="relative w-full h-[520px] sm:h-[640px] md:h-[720px] rounded-3xl overflow-hidden shadow-sm">
					<Image
						src="/banner/banner1.jpg"
						alt="Prettyfull Timeless Design"
						fill
						priority
						sizes="100vw"
						className="object-cover object-center brightness-90"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

					<div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 md:p-16 max-w-4xl text-white space-y-4">
						<span className="inline-block text-xs sm:text-sm uppercase tracking-widest text-gray-300 font-semibold">
							Our Perspective
						</span>
						<h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-sans tracking-tight leading-tight">
							Showcase Our Authentic Brand Perspective
						</h1>
						<p className="text-base sm:text-xl text-gray-200 font-light leading-relaxed max-w-2xl">
							We create more than just clothing; we build a foundation for your personal
							expression through thoughtful design and intentional craftsmanship.
						</p>
					</div>
				</div>
			</section>

			{/* SECTION 2: 3 BRAND PILLARS */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
					{PILLARS.map((pillar, idx) => (
						<div
							key={pillar.title}
							className="p-8 sm:p-10 rounded-3xl bg-[#F9FAFB] border border-gray-150/80 hover:border-black/20 transition duration-300 space-y-4 flex flex-col justify-between"
						>
							<div className="space-y-3">
								<span className="text-xs font-bold tracking-widest text-gray-400 font-mono">
									0{idx + 1}
								</span>
								<h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-gray-950">
									{pillar.title}
								</h2>
								<p className="text-sm sm:text-base text-gray-600 leading-relaxed">
									{pillar.description}
								</p>
							</div>
							<div className="pt-4 border-t border-gray-200/60">
								<span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
									Prettyfull Core
								</span>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* SECTION 3: LUXURY TEXTURES */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-gray-100">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Left: Texture Image */}
					<div className="lg:col-span-5">
						<div className="relative w-full h-[450px] sm:h-[550px] rounded-3xl overflow-hidden shadow-md">
							<Image
								src="/home/presentation.jpg"
								alt="Curated Luxury Textures"
								fill
								sizes="(max-width: 1024px) 100vw, 45vw"
								className="object-cover"
							/>
						</div>
					</div>

					{/* Right: Texture Points */}
					<div className="lg:col-span-7 space-y-8">
						<div className="space-y-3">
							<span className="text-xs uppercase tracking-widest font-semibold text-gray-400">
								Craftsmanship
							</span>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950 leading-tight">
								Introducing intentionally curated luxury textures
							</h2>
						</div>

						<div className="space-y-6 divide-y divide-gray-150">
							{TEXTURE_POINTS.map((pt) => (
								<div key={pt.number} className="pt-6 first:pt-0 space-y-2">
									<div className="flex items-center gap-3">
										<span className="text-xs font-mono font-bold text-gray-400">
											{pt.number}
										</span>
										<h3 className="text-lg sm:text-xl font-bold font-sans text-gray-900">
											{pt.title}
										</h3>
									</div>
									<p className="text-sm sm:text-base text-gray-600 leading-relaxed pl-7">
										{pt.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* SECTION 4: ENVIRONMENTAL RESPONSIBILITY */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-gray-100">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Left Content */}
					<div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
						<div className="space-y-4">
							<span className="text-xs uppercase tracking-widest font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
								Sustainability Commitment
							</span>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950 leading-tight">
								Upholding our meaningful environmental responsibility
							</h2>
							<p className="text-base sm:text-lg text-gray-600 leading-relaxed">
								We believe in creating a positive impact through mindful production and
								ethical fashion design practices.
							</p>
						</div>

						<div className="space-y-6 divide-y divide-gray-150">
							{RESPONSIBILITY_POINTS.map((item, idx) => (
								<div key={item.title} className="pt-6 first:pt-0 space-y-2">
									<div className="flex items-center gap-2">
										<span className="w-2 h-2 rounded-full bg-black inline-block" />
										<h3 className="text-base sm:text-lg font-bold font-sans text-gray-900">
											{item.title}
										</h3>
									</div>
									<p className="text-sm sm:text-base text-gray-600 leading-relaxed pl-4">
										{item.description}
									</p>
								</div>
							))}
						</div>
					</div>

					{/* Right Model Image */}
					<div className="lg:col-span-5 order-1 lg:order-2">
						<div className="relative w-full h-[480px] sm:h-[580px] rounded-3xl overflow-hidden shadow-md">
							<Image
								src="/home/commerce.jpg"
								alt="Conscious Fashion Model"
								fill
								sizes="(max-width: 1024px) 100vw, 45vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* SECTION 5: COMMUNITY TRUST (TESTIMONIALS) */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-gray-100">
				<div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
					<span className="text-xs uppercase tracking-widest font-semibold text-gray-400">
						Client Voices
					</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950">
						Community Trust
					</h2>
					<p className="text-sm sm:text-base text-gray-500">
						Experiences shared by those who wear and appreciate Prettyfull every day.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{TESTIMONIALS.map((t) => (
						<div
							key={t.author}
							className="p-8 sm:p-9 rounded-3xl bg-[#F9FAFB] border border-gray-150/80 flex flex-col justify-between space-y-6 hover:shadow-sm transition"
						>
							<div className="space-y-4">
								<div className="flex text-amber-400 gap-1 text-sm">
									{"★".repeat(5)}
								</div>
								<p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
									&ldquo;{t.quote}&rdquo;
								</p>
							</div>

							<div className="flex items-center gap-4 pt-4 border-t border-gray-200/60">
								<div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200">
									<Image
										src={t.avatar}
										alt={t.author}
										fill
										sizes="48px"
										className="object-cover"
									/>
								</div>
								<div>
									<h4 className="font-bold text-sm text-gray-950 font-sans">
										{t.author}
									</h4>
									<p className="text-xs text-gray-500">{t.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* SECTION 6: STRATOSPHERE BANNER */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
				<PhotoOverlayBanner
					image="/banner/banner4.jpg"
					title="Let's Take Your Fashion to The Stratosphere"
					subtitle="Ready to elevate your everyday style? Discover our newest drops and signature silhouettes."
					cta={{ label: "Explore Collections", href: "/collections" }}
					contained={false}
				/>
			</section>
		</main>
	);
};

export default MonalisaAboutView;
