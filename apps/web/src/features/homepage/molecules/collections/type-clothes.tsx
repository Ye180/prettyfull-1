import { Checkbox } from "@prettyfull/ui";

const items = [
	{ id: "robes", label: "Robes" },
	{ id: "ensembles-coordonnés", label: "Ensembles coordonnés" },
	{ id: "hauts", label: "Hauts" },
	{ id: "jupes", label: "Jupes" },
	{ id: "jeans", label: "Jeans" },
];

const TypeClothes = () => {
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

export default TypeClothes;
