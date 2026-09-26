import { useState } from "react";

const OPTIONS = ["En stock", "Précommande", "Tout"] as const;

/**
 * Section "Availability" - radio group présentationnel (pas de filtrage
 * réel). Pas de primitive Radix RadioGroup dans @prettyfull/ui, donc input
 * natif stylé plutôt qu'ajouter une dépendance pour trois boutons.
 */
const Availability = () => {
	const [selected, setSelected] =
		useState<(typeof OPTIONS)[number]>("En stock");

	return (
		<div className="space-y-3">
			{OPTIONS.map((option) => (
				<label
					key={option}
					className="flex gap-3 items-center text-sm text-gray-800 cursor-pointer"
				>
					<input
						type="radio"
						name="availability"
						checked={selected === option}
						onChange={() => setSelected(option)}
						className="accent-black size-4"
					/>
					{option}
				</label>
			))}
		</div>
	);
};

export default Availability;
