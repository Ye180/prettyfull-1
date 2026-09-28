"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";

type Translate = (key: string) => string;

const getPillars = (t: Translate) => [
	{
		title: t("pillars.pillar1.title"),
		description: t("pillars.pillar1.description"),
	},
	{
		title: t("pillars.pillar2.title"),
		description: t("pillars.pillar2.description"),
	},
	{
		title: t("pillars.pillar3.title"),
		description: t("pillars.pillar3.description"),
	},
];

const getTexturePoints = (t: Translate) => [
	{
		number: "01",
		title: t("texture.points.point1.title"),
		description: t("texture.points.point1.description"),
	},
	{
		number: "02",
		title: t("texture.points.point2.title"),
		description: t("texture.points.point2.description"),
	},
	{
		number: "03",
		title: t("texture.points.point3.title"),
		description: t("texture.points.point3.description"),
	},
];

const getResponsibilityPoints = (t: Translate) => [
	{
		title: t("responsibility.items.item1.title"),
		description: t("responsibility.items.item1.description"),
	},
	{
		title: t("responsibility.items.item2.title"),
		description: t("responsibility.items.item2.description"),
	},
	{
		title: t("responsibility.items.item3.title"),
		description: t("responsibility.items.item3.description"),
	},
];

const getTestimonials = (t: Translate) => [
	{
		quote: t("testimonials.testimonial1.quote"),
		author: "Aïcha K.",
		role: t("testimonials.testimonial1.role"),
		avatar: "/products/multivitamin.jpg",
	},
	{
		quote: t("testimonials.testimonial2.quote"),
		author: "Fatou D.",
		role: t("testimonials.testimonial2.role"),
		avatar: "/products/omega3-capsules.jpg",
	},
	{
		quote: t("testimonials.testimonial3.quote"),
		author: "Aminata S.",
		role: t("testimonials.testimonial3.role"),
		avatar: "/products/gummies.jpg",
	},
];

const AboutView = () => {
	const t = useTranslations("AboutPage");
	const pillars = getPillars(t);
	const texturePoints = getTexturePoints(t);
	const responsibilityPoints = getResponsibilityPoints(t);
	const testimonials = getTestimonials(t);

	return (
		<main className="w-full min-h-screen bg-white text-gray-900 pb-20">
			{/* SECTION 1: HERO */}
			<section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
				<div className="relative w-full h-[520px] sm:h-[640px] md:h-[720px] rounded-3xl overflow-hidden shadow-sm">
					<Image
						src="/home/supplements-hero-lifestyle.jpg"
						alt={t("hero.imageAlt")}
						fill
						priority
						sizes="100vw"
						className="object-cover object-center brightness-90"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

					<div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 md:p-16 max-w-4xl text-white space-y-4">
						<span className="inline-block text-xs sm:text-sm uppercase tracking-widest text-gray-300 font-semibold">
							{t("hero.eyebrow")}
						</span>
						<h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-sans tracking-tight leading-tight">
							{t("hero.title")}
						</h1>
						<p className="text-base sm:text-xl text-gray-200 font-light leading-relaxed max-w-2xl">
							{t("hero.subtitle")}
						</p>
					</div>
				</div>
			</section>

			{/* SECTION 2: 3 BRAND PILLARS */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
					{pillars.map((pillar, idx) => (
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
									PrettyFull
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
								src="/home/supplements-hero-colorful.jpg"
								alt={t("texture.imageAlt")}
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
								{t("texture.eyebrow")}
							</span>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950 leading-tight">
								{t("texture.title")}
							</h2>
						</div>

						<div className="space-y-6 divide-y divide-gray-150">
							{texturePoints.map((pt) => (
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
								{t("responsibility.badge")}
							</span>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950 leading-tight">
								{t("responsibility.title")}
							</h2>
							<p className="text-base sm:text-lg text-gray-600 leading-relaxed">
								{t("responsibility.subtitle")}
							</p>
						</div>

						<div className="space-y-6 divide-y divide-gray-150">
							{responsibilityPoints.map((item) => (
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
								src="/category/category-wellness.jpg"
								alt={t("responsibility.imageAlt")}
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
						{t("testimonials.eyebrow")}
					</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950">
						{t("testimonials.title")}
					</h2>
					<p className="text-sm sm:text-base text-gray-500">
						{t("testimonials.subtitle")}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.author}
							className="p-8 sm:p-9 rounded-3xl bg-[#F9FAFB] border border-gray-150/80 flex flex-col justify-between space-y-6 hover:shadow-sm transition"
						>
							<div className="space-y-4">
								<div className="flex text-amber-400 gap-1 text-sm">
									{"★".repeat(5)}
								</div>
								<p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
									&ldquo;{testimonial.quote}&rdquo;
								</p>
							</div>

							<div className="flex items-center gap-4 pt-4 border-t border-gray-200/60">
								<div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200">
									<Image
										src={testimonial.avatar}
										alt={testimonial.author}
										fill
										sizes="48px"
										className="object-cover"
									/>
								</div>
								<div>
									<h4 className="font-bold text-sm text-gray-950 font-sans">
										{testimonial.author}
									</h4>
									<p className="text-xs text-gray-500">{testimonial.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* SECTION 6: BANNIÈRE FINALE */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
				<PhotoOverlayBanner
					image="/home/supplements-hero-colorful.jpg"
					title={t("finalBanner.title")}
					subtitle={t("finalBanner.subtitle")}
					cta={{ label: t("finalBanner.cta"), href: "/collections" }}
					contained={false}
				/>
			</section>
		</main>
	);
};

export default AboutView;
