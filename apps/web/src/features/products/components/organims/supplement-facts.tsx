/**
 * Informations nutritionnelles - pas de champ backend par produit,
 * stub statique unique affiché pour tous les produits.
 */
const SUPPLEMENT_FACTS = [
	{ ingredient: "Portion", amount: "1 gélule", daily: "—" },
	{ ingredient: "Ingrédient actif", amount: "500 mg", daily: "100%" },
	{ ingredient: "Vitamine D3", amount: "10 µg", daily: "200%" },
	{ ingredient: "Zinc", amount: "5 mg", daily: "50%" },
];

const DIETARY_BADGES = [
	{
		label: "Sans OGM",
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M12 2C9 5 7 8 7 12a5 5 0 0 0 10 0c0-4-2-7-5-10z" />
			</svg>
		),
	},
	{
		label: "Végétarien",
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<circle cx="12" cy="12" r="9" />
				<path d="M8 12h8M12 8v8" />
			</svg>
		),
	},
	{
		label: "Végan",
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
			</svg>
		),
	},
];

/**
 * Bloc "Informations Nutritionnelles" + badges régime, sous la galerie -
 * même emplacement que sur la fiche produit de référence.
 */
export const SupplementFacts = () => {
	return (
		<div className="p-6 mt-6 rounded-md border border-gray-200">
			<h3 className="pb-4 text-xl font-bold text-[#080808]">
				Informations Nutritionnelles
			</h3>
			<p className="pb-4 text-xs text-gray-500">
				Portion : 1 gélule — Portions par boîte : 30
			</p>
			<table className="w-full text-sm border border-collapse border-gray-200">
				<thead>
					<tr className="bg-gray-50">
						<th className="p-3 text-left border border-gray-200">Ingrédient</th>
						<th className="p-3 text-left border border-gray-200">Par portion</th>
						<th className="p-3 text-left border border-gray-200">% AJR</th>
					</tr>
				</thead>
				<tbody>
					{SUPPLEMENT_FACTS.map((row) => (
						<tr key={row.ingredient}>
							<td className="p-3 font-medium border border-gray-200">{row.ingredient}</td>
							<td className="p-3 text-gray-600 border border-gray-200">{row.amount}</td>
							<td className="p-3 text-gray-600 border border-gray-200">{row.daily}</td>
						</tr>
					))}
				</tbody>
			</table>
			<p className="pt-3 text-xs text-gray-400">
				AJR : Apports Journaliers Références. Informations indicatives - consultez
				l&apos;étiquette du produit pour le détail exact.
			</p>

			<div className="flex gap-8 justify-start pt-6 mt-6 border-t border-gray-100">
				{DIETARY_BADGES.map((badge) => (
					<div key={badge.label} className="flex flex-col items-center gap-2 text-center">
						<div className="flex justify-center items-center w-14 h-14 text-gray-700 rounded-full border border-gray-300">
							{badge.icon}
						</div>
						<span className="text-xs font-medium text-gray-600">{badge.label}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default SupplementFacts;
