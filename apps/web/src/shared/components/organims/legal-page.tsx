"use client";

import Link from "next/link";

export interface LegalSection {
	id: string;
	title: string;
	description: string;
}

interface LegalPageProps {
	eyebrow: string;
	title: string;
	intro: string;
	sections: LegalSection[];
	contactLabel: string;
	contactCta: string;
}

/** Retire la numérotation saisie dans le titre ("1. OBJET") : la page la recalcule. */
const cleanTitle = (title: string) => title.replace(/^\d+\.\s*/, "");

/**
 * Gabarit des pages juridiques (CGV, livraison & retours) : sommaire collant
 * à gauche, articles numérotés à droite, dans la typographie du site.
 */
export const LegalPage = ({ eyebrow, title, intro, sections, contactLabel, contactCta }: LegalPageProps) => (
	<main className="pb-24 w-full">
		<header className="border-b bg-(--color-surface-card) border-(--color-surface-border)">
			<div className="px-6 py-16 mx-auto max-w-[120rem] sm:py-20 lg:px-10">
				<p className="text-[1.3rem] font-semibold tracking-[0.14em] uppercase text-(--color-surface-muted)">{eyebrow}</p>
				<h1 className="mt-4 text-[4rem]! sm:text-[5.6rem]!">{title}</h1>
				<p className="mt-5 max-w-[64ch] text-[1.6rem] leading-relaxed text-(--color-ink)/75">{intro}</p>
			</div>
		</header>

		<div className="grid gap-12 px-6 pt-14 mx-auto max-w-[120rem] lg:grid-cols-[26rem_1fr] lg:gap-20 lg:px-10">
			<nav aria-label={title} className="hidden lg:block">
				<ol className="sticky top-56 space-y-2.5 text-[1.35rem]">
					{sections.map((section, index) => (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								className="flex gap-3 transition-colors text-(--color-surface-muted) hover:text-(--color-ink)"
							>
								<span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
								<span>{cleanTitle(section.title)}</span>
							</a>
						</li>
					))}
				</ol>
			</nav>

			<div>
				{sections.map((section, index) => (
					<section
						key={section.id}
						id={section.id}
						className="py-9 border-b scroll-mt-60 first:pt-0 border-(--color-surface-border)"
					>
						<p className="text-[1.2rem] font-semibold tracking-[0.14em] tabular-nums text-(--color-surface-muted)">
							{String(index + 1).padStart(2, "0")}
						</p>
						<h2 className="mt-2 text-[2.4rem]!">{cleanTitle(section.title)}</h2>
						<p className="mt-4 max-w-[72ch] text-[1.55rem] leading-[1.75] text-(--color-ink)/80">{section.description}</p>
					</section>
				))}

				<div className="flex flex-col gap-5 p-8 mt-12 sm:flex-row sm:justify-between sm:items-center bg-(--color-surface-card)">
					<p className="text-[1.5rem] text-(--color-ink)">{contactLabel}</p>
					<Link
						href="/contact"
						className="inline-flex justify-center px-8 py-3.5 text-[1.3rem] font-semibold tracking-[0.1em] text-white uppercase transition-colors shrink-0 bg-(--color-ink) hover:bg-black"
					>
						{contactCta}
					</Link>
				</div>
			</div>
		</div>
	</main>
);

export default LegalPage;
