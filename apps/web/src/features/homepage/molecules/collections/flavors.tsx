import { useState } from "react";

const items = [
	{ name: "Unflavored", fr: "Neutre", hex: "#F5F5F0" },
	{ name: "Berry", fr: "Fruits rouges", hex: "#B5324F" },
	{ name: "Orange", fr: "Orange", hex: "#FF8A3D" },
	{ name: "Lemon", fr: "Citron", hex: "#F4D35E" },
	{ name: "Vanilla", fr: "Vanille", hex: "#EFE0C0" },
	{ name: "Chocolate", fr: "Chocolat", hex: "#5C3A21" },
	{ name: "Mint", fr: "Menthe", hex: "#4AAE8C" },
	{ name: "Tropical", fr: "Tropical", hex: "#F2A65A" },
];

/**
 * Chips saveur sélectionnées + bouton "+" pour en ajouter - présentationnel
 * (pas de filtrage réel derrière), juste une sélection réactive côté UI.
 */
const Flavors = () => {
	const [selected, setSelected] = useState<number[]>([1]); // "Berry" par défaut

	const removeColor = (index: number) => {
		setSelected((prev) => prev.filter((i) => i !== index));
	};

	const addNextColor = () => {
		const next = items.findIndex((_, i) => !selected.includes(i));
		if (next !== -1) setSelected((prev) => [...prev, next]);
	};

	return (
		<div className="flex flex-wrap gap-2 items-center">
			{selected.map((index) => {
				const item = items[index];
				if (!item) return null;
				return (
					<span
						key={item.name}
						className="inline-flex gap-2 items-center px-3 py-1.5 text-sm rounded-full border border-gray-200"
					>
						<span
							className="w-3 h-3 rounded-full border border-black/10"
							style={{ backgroundColor: item.hex }}
						/>
						{item.fr}
						<button
							type="button"
							onClick={() => removeColor(index)}
							aria-label={`Retirer ${item.fr}`}
							className="text-gray-400 hover:text-black cursor-pointer"
						>
							−
						</button>
					</span>
				);
			})}
			{selected.length < items.length && (
				<button
					type="button"
					onClick={addNextColor}
					aria-label="Ajouter une saveur"
					className="flex justify-center items-center w-8 h-8 text-gray-400 rounded-full border border-gray-200 hover:border-amber-600 hover:text-amber-600 cursor-pointer"
				>
					+
				</button>
			)}
		</div>
	);
};

export default Flavors;
