import { Checkbox } from "@prettyfull/ui";

const items = [
	{ id: "vegan", label: "Végétalien" },
	{ id: "sans-gluten", label: "Sans gluten" },
	{ id: "sans-ogm", label: "Sans OGM" },
	{ id: "bio", label: "Bio" },
	{ id: "sans-lactose", label: "Sans lactose" },
];

/**
 * Section "Régime alimentaire" - présentationnelle (pas de filtrage réel),
 * même pattern que `type-clothes.tsx`.
 */
const DietaryRegime = () => {
	return (
		<div className="space-y-3">
			{items.map((item) => (
				<label
					key={item.id}
					className="flex gap-3 items-center text-sm text-gray-800 cursor-pointer"
				>
					<Checkbox />
					{item.label}
				</label>
			))}
		</div>
	);
};

export default DietaryRegime;
