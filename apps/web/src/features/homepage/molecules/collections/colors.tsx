import { useState } from "react";

const items = [
	{ name: "Black", fr: "Noir", hex: "#000000" },
	{ name: "White", fr: "Blanc", hex: "#FFFFFF" },
	{ name: "Brown", fr: "Marron", hex: "#6B4423" },
	{ name: "Yellow", fr: "Jaune", hex: "#FFFF66" },
	{ name: "Purple", fr: "Violet", hex: "#9370DB" },
	{ name: "Gold", fr: "Or", hex: "#FFD700" },
	{ name: "Nude", fr: "Nude", hex: "#E3BC9A" },
	{ name: "Blue", fr: "Bleu", hex: "#4682B4" },
	{ name: "Pink", fr: "Rose", hex: "#FFB6C1" },
	{ name: "Red", fr: "Rouge", hex: "#DC143C" },
	{ name: "Green", fr: "Vert", hex: "#228B22" },
	{ name: "Orange", fr: "Orange", hex: "#FFA500" },
	{ name: "Silver", fr: "Argent", hex: "#C0C0C0" },
	{ name: "Ivory", fr: "Ivoire", hex: "#FFFFF0" },
];

/**
 * Chips couleur sélectionnées + bouton "+" pour en ajouter — présentationnel
 * (pas de filtrage réel derrière), juste une sélection réactive côté UI.
 */
const Colors = () => {
	const [selected, setSelected] = useState<number[]>([10]); // "Green", comme l'inspo

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
						<span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: item.hex }} />
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
					aria-label="Ajouter une couleur"
					className="flex justify-center items-center w-8 h-8 text-gray-400 rounded-full border border-gray-200 hover:border-black hover:text-black cursor-pointer"
				>
					+
				</button>
			)}
		</div>
	);
};

export default Colors;
