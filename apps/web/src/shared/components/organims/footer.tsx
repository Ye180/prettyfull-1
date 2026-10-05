"use client";

import { paths } from "@/lib/routes/paths-en";
import { FOOTER_DATA, SOCIALS_DATA_FOOTER } from "@/lib/utils/constants/constants";
import { CONTACT_INFO } from "@/lib/utils/constants/contact";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FC } from "react";
import BrandLogo from "../molecules/core/brand-logo";

const CONTACT_EMAIL = CONTACT_INFO.email;
const CONTACT_PHONE = CONTACT_INFO.phone;

const ArrowIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<line x1="7" y1="17" x2="17" y2="7" />
		<polyline points="7 7 17 7 17 17" />
	</svg>
);

/**
 * Pied de page dans l'identité du site : fond encre chaude (pas noir pur),
 * titres serif comme la nav, wordmark PRETTYFULL en blanc et répété en
 * filigrane géant en bas, façon naturium.
 */
const Footer: FC = () => {
	const t = useTranslations("Footer");

	return (
		<footer className="overflow-hidden w-full text-stone-300 bg-(--color-ink)">
			{/* Bandeau d'appel : promesse + contact direct */}
			<div className="border-b border-white/10">
				<div className="flex flex-col gap-8 px-6 py-14 mx-auto max-w-[150rem] lg:flex-row lg:justify-between lg:items-end lg:px-12 lg:py-20">
					<div className="max-w-[60rem]">
						<p className="text-[1.3rem] font-semibold tracking-[0.14em] uppercase text-stone-400">
							{t("eyebrow")}
						</p>
						<p className="mt-4 font-display text-[3.2rem] leading-[1.1] text-white sm:text-[4.4rem]">
							{t("tagline")}
						</p>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row">
						<a
							href={`mailto:${CONTACT_EMAIL}`}
							className="inline-flex gap-2 justify-center items-center px-8 py-4 text-[1.4rem] font-semibold tracking-[0.08em] uppercase bg-white transition-colors text-(--color-ink) hover:bg-stone-200"
						>
							{t("emailUs")}
							<ArrowIcon />
						</a>
						<a
							href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
							className="inline-flex gap-2 justify-center items-center px-8 py-4 text-[1.4rem] font-semibold tracking-[0.08em] text-white uppercase border transition-colors border-white/30 hover:border-white"
						>
							{t("callUs")}
							<ArrowIcon />
						</a>
					</div>
				</div>
			</div>

			{/* Marque + colonnes de liens */}
			<div className="grid grid-cols-1 gap-12 px-6 py-14 mx-auto max-w-[150rem] lg:grid-cols-[1.3fr_3fr] lg:gap-20 lg:px-12 lg:py-20">
				<div className="flex flex-col gap-6">
					<Link href={paths.home} aria-label="Prettyfull" className="self-start">
						<BrandLogo className="text-[2.6rem] text-white" />
					</Link>
					<p className="max-w-[34rem] text-[1.4rem] leading-relaxed text-stone-400">
						{t("description")}
					</p>
					<div className="space-y-1.5 text-[1.4rem] text-stone-400">
						<p className="text-[1.4rem] text-stone-400">{t("address")}</p>
						<a href={`mailto:${CONTACT_EMAIL}`} className="block transition-colors hover:text-white">
							{CONTACT_EMAIL}
						</a>
						<a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="block transition-colors hover:text-white">
							{CONTACT_PHONE}
						</a>
					</div>
					<div className="flex gap-3 items-center">
						{SOCIALS_DATA_FOOTER.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								aria-label={item.label}
								className="flex justify-center items-center size-[4rem] rounded-full border transition-colors border-white/20 hover:border-white hover:bg-white/10 [&_svg]:size-[1.6rem]"
							>
								<item.icon />
							</Link>
						))}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
					{FOOTER_DATA.map((column) => (
						<div key={column.titleKey}>
							<h5 className="mb-5 text-[1.9rem] font-normal! text-white [font-family:var(--font-display)]!">
								{t(column.titleKey)}
							</h5>
							<ul className="space-y-3.5 text-[1.4rem]">
								{column.links.map((link) => (
									<li key={link.labelKey + link.url}>
										<Link
											href={link.url}
											className="underline-offset-4 transition-colors text-stone-400 hover:text-white hover:underline"
										>
											{t(link.labelKey)}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			{/* Bas de page */}
			<div className="border-t border-white/10">
				<div className="flex flex-col gap-4 justify-between items-center px-6 py-6 mx-auto max-w-[150rem] text-[1.3rem] text-stone-500 sm:flex-row lg:px-12">
					<span>{t("copyright")}</span>
					<div className="flex gap-6">
						<Link href={paths.terms} className="transition-colors hover:text-white">
							{t("termsLink")}
						</Link>
						<Link href={paths.shippingReturn} className="transition-colors hover:text-white">
							{t("shippingReturns")}
						</Link>
					</div>
				</div>
			</div>

			{/* Wordmark géant en filigrane */}
			<div aria-hidden="true" className="flex justify-center pb-4 select-none">
				<BrandLogo className="text-[10.5vw] text-white/[0.07]" />
			</div>
		</footer>
	);
};

export default Footer;
