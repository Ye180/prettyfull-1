"use client";

import { useGetHeroBanner } from "@/features/homepage/api/medusa/get-hero-banner";
import { Button } from "@prettyfull/ui";
import { getMediaUrl } from "@prettyfull/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/home/supplements-hero-lifestyle.jpg";

export const HeroBanner = () => {
	const t = useTranslations("HomePage.heroBanner");
	const locale = useLocale();
	const { data: banner } = useGetHeroBanner();

	// La bannière CMS n'a pas de champ `translations` (contrairement aux
	// produits/catégories) : son texte est saisi en français uniquement, donc
	// on ne l'utilise que pour ce locale - les autres retombent sur `t()`.
	const useCmsCopy = locale === "fr";
	const heroImage = getMediaUrl(banner?.image) || FALLBACK_IMAGE;
	const heroTitle = (useCmsCopy && banner?.title) || t("title");
	const heroSubtitle = (useCmsCopy && banner?.subtitle) || t("subtitle");
	const heroCta = (useCmsCopy && banner?.cta) || t("ctaButton");
	const heroLink = banner?.link || "/collections";

	return (
		<section className="relative w-full max-w-[150rem] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
			<div className="relative w-full min-h-150 sm:min-h-170 lg:min-h-200 rounded-2xl overflow-hidden bg-[#CCD1D5]">
				<Image
					src={heroImage}
					alt={heroTitle}
					fill
					priority
					sizes="(max-width: 1400px) 100vw, 1400px"
					className="object-cover object-center"
					unoptimized
				/>

				<div className="absolute inset-0 via-transparent to-transparent pointer-events-none bg-linear-to-r from-black/35" />

				{/* Contenu à plat, sans carte flottante */}
				<div className="flex relative z-10 flex-col justify-center p-6 w-full h-full min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] sm:p-10 lg:p-16">
					<div className="space-y-5 max-w-2xl text-white">
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
							{heroTitle}
						</h1>
						<p className="text-[1.6rem] sm:text-[1.8rem] text-white/90 leading-relaxed font-normal max-w-xl">
							{heroSubtitle}
						</p>
						<Link href={heroLink}>
							<Button
								type="button"
								className="px-8 py-4 mt-2 text-[1.5rem] font-semibold bg-amber-600 w-auto! hover:bg-amber-700"
							>
								{heroCta}
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroBanner;
