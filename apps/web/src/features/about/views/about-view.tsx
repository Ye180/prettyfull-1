"use client";

import Image from "next/image";
import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";

const PILLARS = [
	{
		title: "Notre Positionnement",
		description:
			"Nous privilégions des formules simples et transparentes, dosées avec précision, pour un bien-être qui s'inscrit dans la durée.",
	},
	{
		title: "Notre Philosophie",
		description:
			"Nous existons pour simplifier votre routine santé au quotidien, avec des compléments essentiels et de qualité pour chaque étape de votre vie.",
	},
	{
		title: "Notre Mission",
		description:
			"Choix de confiance pour les foyers d'Abidjan et d'ailleurs, notre marque prend soin de votre santé grâce à des formules pensées avec soin.",
	},
];

const TEXTURE_POINTS = [
	{
		number: "01",
		title: "Une sélection d'ingrédients",
		description:
			"Des actifs choisis pour leur pureté, leur biodisponibilité et leur origine tracée, du fournisseur jusqu'à la gélule.",
	},
	{
		number: "02",
		title: "Des dosages précis",
		description:
			"Chaque formule est calibrée pour respecter les apports recommandés, sans sous-dosage ni excès inutile.",
	},
	{
		number: "03",
		title: "Un contrôle rigoureux",
		description:
			"Analyses en laboratoire indépendant, lot après lot, pour des compléments qui tiennent leurs promesses.",
	},
];

const RESPONSIBILITY_POINTS = [
	{
		title: "Des ingrédients responsables",
		description:
			"Nous privilégions autant que possible des filières durables et des emballages recyclables, pour réduire l'empreinte de chaque gamme.",
	},
	{
		title: "La qualité avant le volume",
		description:
			"Notre approche privilégie l'efficacité et la pureté, pour des formules pensées pour durer plutôt que pour l'effet de mode.",
	},
	{
		title: "Des formules durables",
		description:
			"Nous préférons proposer moins de références, mais des références de qualité, qui restent pertinentes au-delà des tendances passagères.",
	},
];

const TESTIMONIALS = [
	{
		quote:
			"Je sens vraiment la différence depuis que j'ai commencé la multivitamine, et la livraison à Abidjan a été plus rapide que prévu. Je prépare déjà ma prochaine commande.",
		author: "Aïcha K.",
		role: "Cliente à Abidjan",
		avatar: "/products/multivitamin.jpg",
	},
	{
		quote:
			"Des dosages clairs et des gélules faciles à prendre. PrettyFull est devenu mon adresse santé du quotidien.",
		author: "Fatou D.",
		role: "Cliente à Cocody",
		avatar: "/products/omega3-capsules.jpg",
	},
	{
		quote:
			"Un service client réactif et des compléments qui tiennent leurs promesses. Exactement ce que je cherchais.",
		author: "Aminata S.",
		role: "Cliente à Yopougon",
		avatar: "/products/gummies.jpg",
	},
];

const AboutView = () => {
	return (
		<main className="w-full min-h-screen bg-white text-gray-900 pb-20">
			{/* SECTION 1: HERO */}
			<section className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
				<div className="relative w-full h-[520px] sm:h-[640px] md:h-[720px] rounded-3xl overflow-hidden shadow-sm">
					<Image
						src="/home/supplements-hero-lifestyle.jpg"
						alt="PrettyFull, vitamines et compléments depuis Abidjan"
						fill
						priority
						sizes="100vw"
						className="object-cover object-center brightness-90"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

					<div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 md:p-16 max-w-4xl text-white space-y-4">
						<span className="inline-block text-xs sm:text-sm uppercase tracking-widest text-gray-300 font-semibold">
							Notre histoire
						</span>
						<h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-sans tracking-tight leading-tight">
							Des compléments pensés depuis Abidjan
						</h1>
						<p className="text-base sm:text-xl text-gray-200 font-light leading-relaxed max-w-2xl">
							PrettyFull réunit une sélection de vitamines et compléments choisis un à un : des
							ingrédients de qualité, des dosages testés en laboratoire, et des lots
							volontairement limités pour rester frais.
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
								alt="Ingrédients et formules PrettyFull"
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
								Savoir-faire
							</span>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950 leading-tight">
								Des formules choisies avec soin
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
								Engagement responsable
							</span>
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950 leading-tight">
								Une responsabilité environnementale qui compte pour nous
							</h2>
							<p className="text-base sm:text-lg text-gray-600 leading-relaxed">
								Nous croyons en un impact positif à travers une production réfléchie et des
								pratiques d'approvisionnement plus responsables.
							</p>
						</div>

						<div className="space-y-6 divide-y divide-gray-150">
							{RESPONSIBILITY_POINTS.map((item) => (
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
								alt="Sourcing responsable PrettyFull"
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
						La parole à nos clientes
					</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950">
						Adoré par nos clientes
					</h2>
					<p className="text-sm sm:text-base text-gray-500">
						Les expériences de celles qui intègrent PrettyFull à leur routine santé.
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

			{/* SECTION 6: BANNIÈRE FINALE */}
			<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
				<PhotoOverlayBanner
					image="/home/supplements-hero-colorful.jpg"
					title="Votre bien-être, notre priorité"
					subtitle="Prêt à prendre soin de vous ? Découvrez notre gamme et nos formules signature."
					cta={{ label: "Découvrir la boutique", href: "/collections" }}
					contained={false}
				/>
			</section>
		</main>
	);
};

export default AboutView;
