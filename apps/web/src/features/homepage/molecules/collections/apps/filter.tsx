import { Button } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Adjust from "../adjust";
import Availability from "../availability";
import Colors from "../colors";
import Material from "../material";
import Prize from "../prize";
import Size from "../size";
import TypeClothes from "../type-clothes";

interface FilterProps {
	/** Ferme le panneau (drawer) en conservant les filtres sélectionnés. */
	onApply?: () => void;
	/** Réinitialise les filtres pilotés par l'URL (recherche/tri/prix) puis ferme. */
	onClear?: () => void;
	minPrice?: number | null;
	maxPrice?: number | null;
	/** Seul filtre réellement câblé sur `useCollectionFilters` — appliqué au clic sur "Apply". */
	onPriceChange?: (minPrice: number | null, maxPrice: number | null) => void;
}

const Filter = ({ onApply, onClear, minPrice = null, maxPrice = null, onPriceChange }: FilterProps) => {
	const t = useTranslations("CollectionPage.filters");

	// Draft local pour le prix : appliqué seulement au clic sur "Apply".
	const [priceDraft, setPriceDraft] = useState<{ min: number | null; max: number | null }>({
		min: minPrice,
		max: maxPrice,
	});
	// Force le remontage de <Prize> (inputs non contrôlés) quand on efface.
	const [priceResetKey, setPriceResetKey] = useState(0);

	const handleApply = () => {
		onPriceChange?.(priceDraft.min, priceDraft.max);
		onApply?.();
	};

	const handleClear = () => {
		setPriceDraft({ min: null, max: null });
		setPriceResetKey((key) => key + 1);
		onClear?.();
	};

	const sectionTitleClass = "mb-4 text-sm font-semibold text-black";

	return (
		<div>
			<div className="space-y-8 divide-y divide-gray-100">
				<div className="pt-0">
					<h4 className={sectionTitleClass}>{t("type_clothes")}</h4>
					<TypeClothes />
				</div>
				<div className="pt-8">
					<h4 className={sectionTitleClass}>{t("taille")}</h4>
					<Size />
				</div>
				<div className="pt-8">
					<h4 className={sectionTitleClass}>Prize</h4>
					<Prize
						key={priceResetKey}
						minPrice={priceDraft.min}
						maxPrice={priceDraft.max}
						onChange={(min, max) => setPriceDraft({ min, max })}
					/>
				</div>
				<div className="pt-8">
					<h4 className={sectionTitleClass}>{t("colors")}</h4>
					<Colors />
				</div>
				<div className="pt-8">
					<h4 className={sectionTitleClass}>Fit</h4>
					<Adjust />
				</div>
				<div className="pt-8">
					<h4 className={sectionTitleClass}>Material</h4>
					<Material />
				</div>
				<div className="pt-8">
					<h4 className={sectionTitleClass}>Availability</h4>
					<Availability />
				</div>
			</div>

			{(onApply || onClear) && (
				<div className="flex gap-5 justify-between w-full mt-8">
					<Button type="button" variant="outline" onClick={handleClear}>
						{t("clear")}
					</Button>
					<Button type="button" onClick={handleApply}>
						{t("apply")}
					</Button>
				</div>
			)}
		</div>
	);
};

export default Filter;
