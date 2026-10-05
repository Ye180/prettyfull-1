"use client";

import CategoryShowcase from "@/features/homepage/organims/category-showcase";
import { paths } from "@/lib/routes/paths-en";
import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const STEP_KEYS = ["s1", "s2", "s3", "s4"] as const;
const PILLAR_KEYS = ["p1", "p2", "p3"] as const;

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
	<p className="text-[1.3rem] font-semibold tracking-[0.14em] uppercase text-(--color-surface-muted)">{children}</p>
);

/** Page « À propos » : promesse, histoire, fonctionnement du sourcing, engagements, rayons. */
const AboutView = () => {
	const t = useTranslations("AboutPage");

	return (
		<main className="w-full">
			{/* Hero - même composition que celui de l'accueil */}
			<section className="grid w-full bg-(--color-surface-card) lg:min-h-[64vh] lg:grid-cols-[1fr_1.1fr]">
				<div className="flex flex-col justify-center order-2 px-6 py-14 sm:px-12 lg:order-1 lg:py-20 lg:pl-20 xl:pl-28">
					<Eyebrow>{t("hero.eyebrow")}</Eyebrow>
					<h1 className="mt-5 max-w-[16ch] text-[4.2rem]! leading-[1.04]! font-normal! text-(--color-ink) sm:text-[5.6rem]! xl:text-[6.8rem]!">
						{t("hero.title")}
					</h1>
					<p className="mt-6 max-w-[42ch] text-[1.7rem] leading-relaxed text-(--color-ink)/80 sm:text-[1.9rem]">
						{t("hero.subtitle")}
					</p>
					<Link
						href={paths.collections}
						className="inline-flex items-center px-12 py-5 mt-10 text-[1.4rem] font-semibold tracking-[0.1em] text-white uppercase transition-colors w-fit bg-(--color-ink) hover:bg-black"
					>
						{t("hero.cta")}
					</Link>
				</div>
				<div className="relative order-1 min-h-[38rem] sm:min-h-[52rem] lg:order-2 lg:min-h-0">
					<Image
						src="/products/shop/hero-shopping.jpg"
						alt={t("hero.imageAlt")}
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 55vw"
						className="object-cover"
						unoptimized
					/>
				</div>
			</section>

			{/* Notre histoire */}
			<section className="grid gap-12 items-center px-6 py-20 mx-auto max-w-[130rem] lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
				<div className="overflow-hidden relative aspect-4/5 bg-(--color-surface-card)">
					<Image
						src="/products/shop/beauty-flatlay-alt.jpg"
						alt={t("story.imageAlt")}
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
						unoptimized
					/>
				</div>
				<div>
					<Eyebrow>{t("story.eyebrow")}</Eyebrow>
					<h2 className="mt-4 text-[3.4rem]! sm:text-[4.4rem]!">{t("story.title")}</h2>
					<div className="mt-8 space-y-5 text-[1.6rem] leading-[1.75] text-(--color-ink)/80">
						<p>{t("story.p1")}</p>
						<p>{t("story.p2")}</p>
						<p>{t("story.p3")}</p>
					</div>
				</div>
			</section>

			{/* Comment ça marche */}
			<section className="border-y bg-(--color-surface-card) border-(--color-surface-border)">
				<div className="px-6 py-20 mx-auto max-w-[130rem] lg:px-10 lg:py-24">
					<div className="max-w-[60rem]">
						<Eyebrow>{t("steps.eyebrow")}</Eyebrow>
						<h2 className="mt-4 text-[3.4rem]! sm:text-[4.4rem]!">{t("steps.title")}</h2>
					</div>
					<ol className="grid gap-10 mt-14 sm:grid-cols-2 lg:grid-cols-4">
						{STEP_KEYS.map((key, index) => (
							<li key={key} className="pt-6 border-t border-(--color-ink)">
								<p className="text-[1.3rem] font-semibold tabular-nums text-(--color-surface-muted)">
									{String(index + 1).padStart(2, "0")}
								</p>
								<h3 className="mt-3 text-[2.1rem]! font-normal! text-(--color-ink) [font-family:var(--font-display)]!">
									{t(`steps.${key}.title`)}
								</h3>
								<p className="mt-3 text-[1.45rem] leading-relaxed text-(--color-ink)/75">
									{t(`steps.${key}.description`)}
								</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			{/* Engagements */}
			<section className="px-6 py-20 mx-auto max-w-[130rem] lg:px-10 lg:py-28">
				<div className="mx-auto max-w-[60rem] text-center">
					<Eyebrow>{t("pillars.eyebrow")}</Eyebrow>
					<h2 className="mt-4 text-[3.4rem]! sm:text-[4.4rem]!">{t("pillars.title")}</h2>
				</div>
				<div className="grid gap-px mt-14 bg-(--color-surface-border) md:grid-cols-3">
					{PILLAR_KEYS.map((key) => (
						<div key={key} className="p-10 bg-white">
							<h3 className="text-[2.2rem]! font-normal! text-(--color-ink) [font-family:var(--font-display)]!">
								{t(`pillars.${key}.title`)}
							</h3>
							<p className="mt-4 text-[1.5rem] leading-relaxed text-(--color-ink)/75">{t(`pillars.${key}.description`)}</p>
						</div>
					))}
				</div>
			</section>

			{/* Nos rayons */}
			<section>
				<div className="px-6 pb-10 mx-auto max-w-[130rem] text-center lg:px-10">
					<Eyebrow>{t("ranges.eyebrow")}</Eyebrow>
					<h2 className="mt-4 text-[3.4rem]! sm:text-[4.4rem]!">{t("ranges.title")}</h2>
				</div>
				<CategoryShowcase />
			</section>

			<PhotoOverlayBanner
				image="/products/shop/suitcase.jpg"
				title={t("finalBanner.title")}
				subtitle={t("finalBanner.subtitle")}
				cta={{ label: t("finalBanner.cta"), href: paths.collections }}
				contained
			/>
		</main>
	);
};

export default AboutView;
