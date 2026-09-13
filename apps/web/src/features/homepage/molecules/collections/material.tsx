import { Checkbox } from "@prettyfull/ui";

const items = [
	{ id: "cotton", label: "Cotton" },
	{ id: "linen", label: "Linen" },
	{ id: "wool", label: "Wool" },
	{ id: "polyester", label: "Polyester" },
	{ id: "silk", label: "Silk" },
];

/**
 * Section "Material" — présentationnelle (pas de filtrage réel), même
 * pattern que `type-clothes.tsx`.
 */
const Material = () => {
	return (
		<div className="space-y-3">
			{items.map((item) => (
				<label key={item.id} className="flex gap-3 items-center text-sm text-gray-800 cursor-pointer">
					<Checkbox />
					{item.label}
				</label>
			))}
		</div>
	);
};

export default Material;
