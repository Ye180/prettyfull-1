import { Checkbox } from "@prettyfull/ui";

const items = ["Énergie", "Immunité", "Sommeil", "Digestion", "Sport"];

/**
 * Section "Objectif santé" (renommée depuis "Fit"/"Adjust") - présentationnel.
 */
const Adjust = () => {
	return (
		<div className="space-y-3">
			{items.map((item) => (
				<label
					key={item}
					className="flex gap-3 items-center text-sm text-gray-800 cursor-pointer"
				>
					<Checkbox />
					{item}
				</label>
			))}
		</div>
	);
};

export default Adjust;
