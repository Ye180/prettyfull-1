import { Checkbox } from "@prettyfull/ui";

const items = [
	{ id: "vitamines", label: "Vitamines" },
	{ id: "mineraux", label: "Minéraux" },
	{ id: "proteines", label: "Protéines" },
	{ id: "probiotiques", label: "Probiotiques" },
	{ id: "gummies", label: "Gummies" },
];

const TypeSupplement = () => {
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

export default TypeSupplement;
