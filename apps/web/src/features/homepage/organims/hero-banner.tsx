"use client";

import { useGetHeroBanner } from "@/features/homepage/api/medusa/get-hero-banner";
import { paths } from "@/lib/routes/paths-en";
import { ArrowRight, BadgeCheck, MapPin, Truck } from "@prettyfull/ui";
import { getMediaUrl } from "@prettyfull/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const FALLBACK_IMAGE = "/products/shop/hero-home-wide.jpg";

/** Entrée décalée : même animation, retard croissant. */
const rise = (delayMs: number): CSSProperties => ({ animationDelay: `${delayMs}ms` });
const RISE = "motion-safe:animate-[hero-rise_900ms_cubic-bezier(0.16,1,0.3,1)_both]";

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
	const heroLink = banner?.link || paths.collections;

	const commitments = [
		{ icon: Truck, title: t("shippingTitle"), text: t("shippingText") },
		{ icon: BadgeCheck, title: t("authenticTitle"), text: t("authenticText") },
		{ icon: MapPin, title: t("deliveryTitle"), text: t("deliveryText") },
	];

	return (
		<section className="relative isolate flex flex-col overflow-hidden bg-(--color-surface-card) lg:block lg:h-[clamp(60rem,46vw,84rem)]">
			{/* Photo plein cadre - le sujet est calé à droite pour laisser le mur
			 * clair au texte (image élargie exprès, cf. hero-home-wide.jpg). */}
			<div className="relative h-[36rem] overflow-hidden sm:h-[50rem] lg:absolute lg:inset-0 lg:h-auto">
				<Image
					src={heroImage}
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-[64%_100%] motion-safe:animate-[hero-settle_1600ms_cubic-bezier(0.16,1,0.3,1)_both] lg:object-[78%_100%]"
					unoptimized
				/>
				{/* Voile clair côté texte : garantit le contraste quelle que soit la photo CMS. */}
				<div className="hidden absolute inset-0 bg-linear-to-r from-(--color-surface-card)/75 via-(--color-surface-card)/25 to-transparent to-60% lg:block" />
			</div>

			<div className="relative mx-auto grid h-full w-full max-w-[152rem] px-6 py-12 sm:px-12 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-center lg:gap-12 lg:px-16 lg:py-16 xl:px-24">
				<div className="max-w-[64rem]">
					<h1
						className={`max-w-[7.6em] text-[3.8rem]! leading-[0.94]! font-normal! uppercase tracking-[-0.025em]! text-(--color-ink) sm:text-[5.2rem]! lg:text-[clamp(4.8rem,4.2vw,6.8rem)]! ${RISE}`}
						style={rise(80)}
					>
						{heroTitle}
					</h1>

					<p
						className={`mt-7 max-w-[38ch] text-[1.6rem] leading-[1.55] text-(--color-ink)/80 lg:mt-9 lg:text-[1.75rem] ${RISE}`}
						style={rise(200)}
					>
						{heroSubtitle}
					</p>

					<div className={`flex flex-wrap gap-3 mt-9 lg:mt-12 ${RISE}`} style={rise(320)}>
						<Link
							href={heroLink}
							className="group inline-flex h-[5.6rem] items-center gap-5 bg-(--color-ink) pr-2 pl-8 text-[1.35rem] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--color-ink)"
						>
							{heroCta}
							<span className="grid size-[4.4rem] place-items-center bg-white/12 transition-transform duration-300 ease-out group-hover:translate-x-1">
								<ArrowRight className="size-[1.8rem]" strokeWidth={1.75} />
							</span>
						</Link>
						<Link
							href={`${paths.collections}?sort=createdAt&order=desc`}
							className="inline-flex h-[5.6rem] items-center border border-(--color-surface-border) bg-white px-8 text-[1.35rem] font-semibold uppercase tracking-[0.1em] text-(--color-ink) transition-colors hover:border-(--color-ink) focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--color-ink)"
						>
							{t("secondaryCta")}
						</Link>
					</div>
				</div>

				{/* Engagements - colonne de droite en desktop, liste sous les boutons en mobile. */}
				<ul aria-label={t("trustLabel")} className="mt-10 grid gap-2 lg:mt-0 lg:gap-3">
					{commitments.map(({ icon: Icon, title, text }, index) => (
						<li
							key={title}
							className={`flex items-center gap-4 border border-(--color-surface-border) bg-white px-5 py-4 lg:border-white/70 lg:bg-white/90 lg:shadow-[0_1.2rem_3.2rem_-1.6rem_rgb(26_26_24/0.25)] ${RISE}`}
							style={rise(440 + index * 90)}
						>
							<span className="grid shrink-0 size-[4rem] place-items-center bg-(--color-surface-card) text-(--color-ink)">
								<Icon className="size-[1.9rem]" strokeWidth={1.6} />
							</span>
							<span className="min-w-0">
								<span className="block text-[1.4rem] font-semibold leading-tight text-(--color-ink)">{title}</span>
								<span className="mt-0.5 block text-[1.25rem] leading-snug text-(--color-surface-muted)">{text}</span>
							</span>
						</li>
					))}
				</ul>
			</div>

		</section>
	);
};

export default HeroBanner;
