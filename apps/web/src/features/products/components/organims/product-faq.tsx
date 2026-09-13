import { DataRule } from "@/features/faq/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@prettyfull/ui";

/**
 * Mini-FAQ PDP : sous-ensemble statique du contenu FAQ existant (pas de
 * duplication de texte), même pattern visuel que l'accordéon de la page FAQ
 * (ligne active en fond noir).
 */
const PDP_FAQ_ITEMS = DataRule.slice(0, 4);

export function ProductFaq() {
	return (
		<div className="py-9">
			<h2 className="mb-8 text-3xl font-bebas-neue">Frequently Asked Questions</h2>
			<Accordion type="single" collapsible className="flex flex-col gap-3 w-full">
				{PDP_FAQ_ITEMS.map((item) => (
					<AccordionItem
						key={item.title}
						value={item.title}
						className="px-6 rounded-2xl border border-b-0 border-black/10 data-[state=open]:bg-black data-[state=open]:border-black data-[state=open]:text-white"
					>
						<AccordionTrigger className="font-manrope text-lg font-medium">
							{item.title}
						</AccordionTrigger>
						<AccordionContent className="font-manrope text-base leading-relaxed opacity-80">
							{item.description}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}

export default ProductFaq;
