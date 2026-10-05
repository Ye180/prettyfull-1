"use client";

import { useGetHeroBanner } from "@/features/homepage/api/medusa/get-hero-banner";
import { getMediaUrl } from "@prettyfull/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const FALLBACK_IMAGE = "/products/shop/hero-shopping-alt.jpg";

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
		<section className="relative grid w-full bg-(--color-surface-card) lg:min-h-[72vh] lg:grid-cols-[1fr_1.1fr]">
			{/* Calqué sur la bannière naturium.com : pleine largeur, sans carte
			 * arrondie - surtitre, grand titre serif, sous-titre, bouton noir
			 * rectangulaire, visuel collé au bord droit. */}
			<div className="order-2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:order-1 lg:py-20 lg:pl-20 xl:pl-28">
				<p className="text-[1.4rem] font-semibold uppercase tracking-[0.1em] text-(--color-ink) sm:text-[1.6rem]">
					{t("eyebrow")}
				</p>
				<h1 className="mt-5 max-w-[16ch] text-[4.2rem]! leading-[1.02]! font-normal! tracking-[-0.02em]! text-(--color-ink) sm:text-[5.6rem]! xl:text-[7.2rem]!">
					{heroTitle}
				</h1>
				<p className="mt-6 max-w-[36ch] text-[1.8rem] leading-snug text-(--color-ink) sm:text-[2.2rem]">
					{heroSubtitle}
				</p>
				<Link
					href={heroLink}
					className="mt-10 inline-flex w-fit items-center bg-(--color-ink) px-12 py-5 text-[1.5rem] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black"
				>
					{heroCta}
				</Link>
			</div>

			<div className="relative order-1 min-h-[42rem] sm:min-h-[56rem] lg:order-2 lg:min-h-0">
				<Image
					src={heroImage}
					alt={heroTitle}
					fill
					priority
					sizes="(max-width: 1024px) 100vw, 55vw"
					className="object-cover object-top"
					unoptimized
				/>
			</div>
		</section>
	);
};

export default HeroBanner;
