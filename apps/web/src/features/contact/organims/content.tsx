"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import ContactForm from "./contact-form";
import { getContactDetails, getShortcuts } from "../data";

/**
 * Corps de la page contact.
 *
 * Le formulaire occupe la colonne principale, les coordonnées la colonne
 * latérale : la plupart des visiteurs viennent écrire, pas relever une adresse.
 *
 * Au mobile, l'ordre est repensé - coordonnées, puis formulaire, puis horaires
 * et raccourcis. Faire défiler trois blocs avant d'atteindre le champ de saisie
 * décourage précisément ceux qui étaient venus écrire, tandis qu'un numéro de
 * téléphone en tête sert immédiatement ceux qui préfèrent appeler.
 */
const Content = () => {
	const t = useTranslations("ContactPage");
	const CONTACT_DETAILS = getContactDetails(t);
	const SHORTCUTS = getShortcuts(t);

	return (
		<section className="px-6 mx-auto w-full max-w-[130rem] lg:px-10">
			<div className="grid gap-14 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] sm:gap-14 md:gap-20">
				<div className="order-2 sm:order-1 sm:row-span-2">
					<h2 className="text-[3rem]! sm:text-[3.6rem]!">
						{t("form.title")}
					</h2>

					<p className="mb-10 mt-4 max-w-[58ch] text-[1.5rem] leading-relaxed text-(--color-ink)/75">
						{t("form.description")}
					</p>

					<ContactForm />
				</div>

				<aside className="order-1 sm:order-2">
					<div className="px-8 py-10 text-white bg-(--color-ink) sm:px-10">
						<h3 className="mb-8 text-[2.4rem]! font-normal! text-white! [font-family:var(--font-display)]!">
							{t("info.title")}
						</h3>

						<dl className="space-y-7">
							<div>
								<dt className="mb-2 text-[1.15rem] font-semibold uppercase tracking-[0.14em] text-white/50">
									{t("info.emailLabel")}
								</dt>
								<dd>
									<a
										href={`mailto:${CONTACT_DETAILS.email}`}
										className="text-[1.6rem] underline underline-offset-4 hover:no-underline"
									>
										{CONTACT_DETAILS.email}
									</a>
								</dd>
							</div>

							<div>
								<dt className="mb-2 text-[1.15rem] font-semibold uppercase tracking-[0.14em] text-white/50">
									{t("info.phoneLabel")}
								</dt>
								<dd>
									<a
										href={CONTACT_DETAILS.phoneHref}
										className="text-[1.6rem] underline underline-offset-4 hover:no-underline"
									>
										{CONTACT_DETAILS.phone}
									</a>
								</dd>
							</div>

							<div>
								<dt className="mb-2 text-[1.15rem] font-semibold uppercase tracking-[0.14em] text-white/50">
									{t("info.addressLabel")}
								</dt>
								<dd className="text-[1.6rem] leading-relaxed text-white/90">
									{CONTACT_DETAILS.address.line1}
									<br />
									{CONTACT_DETAILS.address.city},{" "}
									{CONTACT_DETAILS.address.country}
								</dd>
							</div>
						</dl>
					</div>
				</aside>

				<aside className="order-3 space-y-12">
					<div>
						<h3 className="mb-5 text-[2.2rem]! font-normal! [font-family:var(--font-display)]!">
							{t("hours.title")}
						</h3>

						<dl className="space-y-3">
							{CONTACT_DETAILS.hours.map((slot) => (
								<div
									key={slot.days}
									className="flex items-baseline justify-between gap-4 border-b border-(--color-surface-border) pb-3"
								>
									<dt className="text-[1.45rem] text-(--color-ink)/70">
										{slot.days}
									</dt>
									<dd className="text-[1.45rem] font-medium text-(--color-ink)">
										{slot.time}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div>
						<h3 className="mb-5 text-[2.2rem]! font-normal! [font-family:var(--font-display)]!">
							{t("quickAnswers.title")}
						</h3>

						<ul className="space-y-4">
							{SHORTCUTS.map((shortcut) => (
								<li key={shortcut.href}>
									<Link
										href={shortcut.href}
										className="block px-6 py-5 border transition-colors group border-(--color-surface-border) hover:border-(--color-ink)"
									>
										<span className="mb-1 block text-[1.5rem] font-medium text-(--color-ink)">
											{shortcut.title}
										</span>
										<span className="block text-[1.35rem] leading-relaxed text-(--color-surface-muted)">
											{shortcut.description}
										</span>
										<span className="mt-3 inline-block text-[1.3rem] font-medium underline underline-offset-4 text-(--color-ink) group-hover:no-underline">
											{shortcut.cta}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</aside>
			</div>
		</section>
	);
};

export default Content;
