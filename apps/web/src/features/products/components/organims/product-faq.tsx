"use client";

import { getFaqItems } from "@/features/faq/data";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@prettyfull/ui";
import { useTranslations } from "next-intl";

/**
 * Mini-FAQ PDP : sous-ensemble du contenu FAQ existant (pas de duplication
 * de texte), même accordéon que la page FAQ.
 */
export function ProductFaq() {
	const t = useTranslations("FaqPage");
	const PDP_FAQ_ITEMS = getFaqItems(t).slice(0, 4);

	return (
		<div className="py-9">
			<h2 className="mb-6 text-[3rem]!">{t("productFaqTitle")}</h2>
			<Accordion type="single" collapsible className="w-full border-t border-(--color-surface-border)">
				{PDP_FAQ_ITEMS.map((item) => (
					<AccordionItem
						key={item.title}
						value={item.title}
						className="border-b border-(--color-surface-border)"
					>
						<AccordionTrigger className="py-5 text-[1.6rem] font-medium text-left hover:no-underline text-(--color-ink)">
							{item.title}
						</AccordionTrigger>
						<AccordionContent className="pb-6 max-w-[70ch] text-[1.5rem] leading-relaxed text-(--color-ink)/75">
							{item.description}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}

export default ProductFaq;
