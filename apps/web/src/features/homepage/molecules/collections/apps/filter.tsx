import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
} from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import Adjust from "../adjust";
import Colors from "../colors";
import Size from "../size";
import ToPull from "../to-pull";
import TypeClothes from "../type-clothes";

const Filter = () => {
	const checkboxClass =
		"pb-8 mt-4 space-y-10  max-md:flex max-md:flex-wrap max-md:gap-x-10";

	const headerClass = "!font-manrope  text-lg font-medium ";
	return (
		<div>
			<Accordion
				type="multiple"
				className="w-full text-black"
				defaultValue={["item-12", "item-1", "item-2", "item-3", "item-4"]}
			>
				<AccordionItem value="item-12" className="pb-4 space-y-2 md:hidden">
					<AccordionTrigger className={cn(headerClass)}>
						Trier par
					</AccordionTrigger>
					<AccordionContent className="pb-8 mt-4 space-y-10 ">
						<ToPull />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-1" className="space-y-2">
					<AccordionTrigger className={cn(headerClass)}>
						Type Habits
					</AccordionTrigger>
					<AccordionContent className={cn(checkboxClass)}>
						<TypeClothes />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger className={cn(headerClass)}>
						Couleur
					</AccordionTrigger>
					<AccordionContent className="">
						<Colors />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3" className="space-y-2">
					<AccordionTrigger className={cn(headerClass)}>
						Ajuster
					</AccordionTrigger>
					<AccordionContent className={cn(checkboxClass)}>
						<Adjust />
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-4">
					<AccordionTrigger className={cn(headerClass)}>
						Taille
					</AccordionTrigger>
					<AccordionContent className="flex flex-wrap gap-8 text-balance">
						<Size />
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<div className="justify-between hidden w-full gap-5 mt-8 max-md:flex">
				<Button variant="outline">Effacer</Button>
				<Button>Appliquer</Button>
			</div>
		</div>
	);
};

export default Filter;
