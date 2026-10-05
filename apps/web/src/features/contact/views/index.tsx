"use client";

import { useTranslations } from "next-intl";
import Content from "../organims/content";

/** Page « Contact » : en-tête sobre, puis formulaire et coordonnées. */
const ContactViews = () => {
	const t = useTranslations("ContactPage");

	return (
		<main className="pb-24 w-full">
			<header className="border-b bg-(--color-surface-card) border-(--color-surface-border)">
				<div className="px-6 py-16 mx-auto max-w-[130rem] sm:py-20 lg:px-10">
					<p className="text-[1.3rem] font-semibold tracking-[0.14em] uppercase text-(--color-surface-muted)">
						{t("hero.eyebrow")}
					</p>
					<h1 className="mt-4 text-[4rem]! sm:text-[5.6rem]!">{t("hero.title")}</h1>
					<p className="mt-5 max-w-[60ch] text-[1.6rem] leading-relaxed text-(--color-ink)/75">{t("hero.subtitle")}</p>
				</div>
			</header>
			<div className="pt-14 md:pt-20">
				<Content />
			</div>
		</main>
	);
};

export default ContactViews;
