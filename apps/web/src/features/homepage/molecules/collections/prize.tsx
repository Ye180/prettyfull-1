interface PrizeProps {
	minPrice: number | null;
	maxPrice: number | null;
	onChange: (minPrice: number | null, maxPrice: number | null) => void;
}

/**
 * Section "Prize" (prix) — le seul bloc de la sidebar réellement câblé sur
 * `useCollectionFilters` (minPrice/maxPrice), le reste reste présentationnel.
 */
const Prize = ({ minPrice, maxPrice, onChange }: PrizeProps) => {
	const inputClass =
		"w-full rounded-full border border-gray-200 py-2.5 pl-8 pr-4 text-sm outline-none focus:border-black placeholder:text-gray-400";

	return (
		<div className="flex gap-3">
			<div className="relative flex-1">
				<span className="absolute left-4 top-1/2 text-sm text-gray-400 -translate-y-1/2">$</span>
				<input
					type="number"
					defaultValue={minPrice ?? ""}
					onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null, maxPrice)}
					placeholder="Minimum"
					className={inputClass}
				/>
			</div>
			<div className="relative flex-1">
				<span className="absolute left-4 top-1/2 text-sm text-gray-400 -translate-y-1/2">$</span>
				<input
					type="number"
					defaultValue={maxPrice ?? ""}
					onChange={(e) => onChange(minPrice, e.target.value ? Number(e.target.value) : null)}
					placeholder="Maximum"
					className={inputClass}
				/>
			</div>
		</div>
	);
};

export default Prize;
