import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	DropdownMenuSeparator,
} from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";

const InfosDelivery = () => {
	const style = "!text-[1.9rem] font-normal !font-manrope text-gray-500";

	const t = useTranslations("CheckoutPage.features");
	return (
		<div className="w-full mt-8 md:w-3/5 lg:mt-0">
			<DropdownMenuSeparator />
			<Accordion type="single" collapsible className="space-y-4">
				{[
					{
						title: t("delivery"),
						content: t("data"),
					},
					{
						title: t("shipping"),
						content: t("data"),
					},
					{
						title: t("billing"),
						content: t("data"),
					},
					{
						title: t("payment"),
						content: t("data"),
					},
				].map((item, index) => (
					<AccordionItem key={index} value={`item-${index + 1}`}>
						<AccordionTrigger className={cn(style)}>
							{item.title}
						</AccordionTrigger>
						<AccordionContent>
							<p className="text-gray-700 ">{item.content}</p>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
};

export default InfosDelivery;
