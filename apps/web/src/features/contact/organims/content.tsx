import Link from "next/link";
import ContactForm from "./contact-form";
import { CONTACT_DETAILS, SHORTCUTS } from "../data";

/**
 * Corps de la page contact.
 *
 * Le formulaire occupe la colonne principale, les coordonnées la colonne
 * latérale : la plupart des visiteurs viennent écrire, pas relever une adresse.
 *
 * Au mobile, l'ordre est repensé — coordonnées, puis formulaire, puis horaires
 * et raccourcis. Faire défiler trois blocs avant d'atteindre le champ de saisie
 * décourage précisément ceux qui étaient venus écrire, tandis qu'un numéro de
 * téléphone en tête sert immédiatement ceux qui préfèrent appeler.
 */
const Content = () => (
	<section className="mx-auto w-full max-w-[140rem] px-8 sm:px-20">
		<div className="grid gap-14 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] sm:gap-14 md:gap-20">
			<div className="order-2 sm:order-1 sm:row-span-2">
				<span className="mb-6 block h-px w-16 bg-black" aria-hidden="true" />

				<h2 className="font-bebas-neue text-[3.6rem]! leading-[1.05] tracking-wide uppercase md:text-[4.6rem]!">
					Écrivez-nous
				</h2>

				<p className="mb-12 mt-5 max-w-[58ch] text-[1.7rem] font-light leading-relaxed text-neutral-600 font-manrope">
					Une question sur une taille, un colis, un retour&nbsp;? Décrivez-nous
					votre situation : quelqu’un qui connaît les produits vous répondra.
				</p>

				<ContactForm />
			</div>

			<aside className="order-1 sm:order-2">
				<div className="rounded-2xl bg-black px-8 py-10 text-white sm:px-10">
					<h3 className="mb-8 font-bebas-neue text-[2.8rem]! leading-none tracking-wide uppercase">
						Nous joindre
					</h3>

					<dl className="space-y-7">
						<div>
							<dt className="mb-2 text-[1.2rem] font-medium uppercase tracking-[0.2em] text-white/50 font-manrope">
								E-mail
							</dt>
							<dd>
								<a
									href={`mailto:${CONTACT_DETAILS.email}`}
									className="text-[1.7rem] font-light underline underline-offset-4 font-manrope hover:no-underline"
								>
									{CONTACT_DETAILS.email}
								</a>
							</dd>
						</div>

						<div>
							<dt className="mb-2 text-[1.2rem] font-medium uppercase tracking-[0.2em] text-white/50 font-manrope">
								Téléphone
							</dt>
							<dd>
								<a
									href={CONTACT_DETAILS.phoneHref}
									className="text-[1.7rem] font-light underline underline-offset-4 font-manrope hover:no-underline"
								>
									{CONTACT_DETAILS.phone}
								</a>
							</dd>
						</div>

						<div>
							<dt className="mb-2 text-[1.2rem] font-medium uppercase tracking-[0.2em] text-white/50 font-manrope">
								Adresse
							</dt>
							<dd className="text-[1.7rem] font-light leading-relaxed text-white/90 font-manrope">
								{CONTACT_DETAILS.address.line1}
								<br />
								{CONTACT_DETAILS.address.city}, {CONTACT_DETAILS.address.country}
							</dd>
						</div>
					</dl>
				</div>
			</aside>

			<aside className="order-3 space-y-12">
				<div>
					<h3 className="mb-6 font-bebas-neue text-[2.4rem]! leading-none tracking-wide uppercase">
						Horaires
					</h3>

					<dl className="space-y-3">
						{CONTACT_DETAILS.hours.map((slot) => (
							<div
								key={slot.days}
								className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-3"
							>
								<dt className="text-[1.5rem] font-light text-neutral-600 font-manrope">
									{slot.days}
								</dt>
								<dd className="text-[1.5rem] font-medium font-manrope">{slot.time}</dd>
							</div>
						))}
					</dl>
				</div>

				<div>
					<h3 className="mb-6 font-bebas-neue text-[2.4rem]! leading-none tracking-wide uppercase">
						Réponse immédiate
					</h3>

					<ul className="space-y-4">
						{SHORTCUTS.map((shortcut) => (
							<li key={shortcut.href}>
								<Link
									href={shortcut.href}
									className="group block rounded-xl border border-neutral-200 px-6 py-5 transition-colors hover:border-black"
								>
									<span className="mb-1 block text-[1.6rem] font-medium font-manrope">
										{shortcut.title}
									</span>
									<span className="block text-[1.4rem] font-light leading-relaxed text-neutral-500 font-manrope">
										{shortcut.description}
									</span>
									<span className="mt-3 inline-block text-[1.3rem] font-medium underline underline-offset-4 font-manrope group-hover:no-underline">
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

export default Content;
