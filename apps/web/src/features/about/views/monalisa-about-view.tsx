"use client";

import Image from "next/image";
import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";

const PILLARS = [
	{
		title: "Notre Positionnement",
		description:
			"Nous privilégions les lignes épurées et les détails soignés, entre silhouettes contemporaines et esthétique minimaliste, pour une élégance qui traverse les saisons.",
	},
	{
		title: "Notre Philosophie",
		description:
			"Nous existons pour simplifier votre garde-robe au quotidien, avec des pièces essentielles et de qualité pour tous vos moments importants.",
	},
	{
		title: "Notre Mission",
		description:
			"Choix de confiance pour les femmes d'Abidjan et d'ailleurs, notre marque sublime votre style à travers une mode pensée avec soin.",
	},
];

const TEXTURE_POINTS = [
	{
		number: "01",
		title: "Une sélection de matières",
		description:
			"Des tissus choisis pour leur tombé naturel, leur durabilité et leur confort à même la peau.",
	},
	{
		number: "02",
		title: "Des coupes précises",
		description:
			"Chaque couture est pensée pour épouser le mouvement naturel du corps, sans rigidité ni surplus de matière.",
	},
	{
		number: "03",
		title: "Une finition soignée",
		description:
			"Boutons discrets, bords renforcés et coutures solides, pour des pièces qui traversent le quotidien sans perdre leur allure.",
	},
];

const RESPONSIBILITY_POINTS = [
	{
		title: "Des choix de matières responsables",
		description:
			"Nous privilégions autant que possible des textiles durables, pour réduire l'empreinte environnementale de chaque collection.",
	},
	{
		title: "La durabilité avant la fast fashion",
		description:
			"Notre approche privilégie la qualité et la solidité, pour une garde-robe pensée pour durer plutôt que pour l'usage unique.",
	},
	{
		title: "Des pièces intemporelles",
		description:
			"Nous préférons proposer moins de pièces, mais des pièces de qualité, qui restent pertinentes au-delà des tendances passagères.",
	},
];

const TESTIMONIALS = [
	{
		quote:
			"La qualité est encore meilleure qu'en photo, et la livraison à Abidjan a été plus rapide que prévu. Je prépare déjà ma prochaine commande.",
		author: "Aïcha K.",
		role: "Cliente à Abidjan",
		avatar: "/home/arrivals-1.jpg",
	},
	{
		quote:
			"Des coupes qui tombent vraiment bien et des tissus agréables. PrettyFull est devenu mon adresse mode du quotidien.",
		author: "Fatou D.",
		role: "Cliente à Cocody",
		avatar: "/home/arrivals-2.jpg",
	},
	{
		quote:
			"Un service client réactif et des pièces qui sortent de l'ordinaire. Exactement ce que je cherchais.",
		author: "Aminata S.",
		role: "Cliente à Yopougon",
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
						src="/home/cover-desktop.jpg"
						alt="PrettyFull, mode féminine depuis Abidjan"
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
							Une mode féminine pensée depuis Abidjan
						</h1>
						<p className="text-base sm:text-xl text-gray-200 font-light leading-relaxed max-w-2xl">
							PrettyFull réunit une sélection de pièces choisies une à une : des matières
							agréables, des coupes qui tiennent dans le temps, et des quantités
							volontairement limitées.
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
								src="/home/commerce1.jpg"
								alt="Matières et finitions PrettyFull"
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
								Des matières choisies avec soin
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
								pratiques de mode plus responsables.
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
								src="/home/promotion.jpg"
								alt="Mode responsable PrettyFull"
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
						Les expériences de celles qui portent PrettyFull au quotidien.
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
					image="/collections/banner-mode.jpg"
					title="Sublimez votre style"
					subtitle="Prêt à renouveler votre garde-robe ? Découvrez nos dernières arrivées et nos pièces signature."
					cta={{ label: "Découvrir la boutique", href: "/collections" }}
					contained={false}
				/>
			</section>
		</main>
	);
};

export default MonalisaAboutView;
