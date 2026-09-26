import { Checkbox } from "@prettyfull/ui";

const SIZES = ["30 gélules", "60 gélules", "90 gélules", "120 gélules"];

/**
 * Format/dosage en cases à cocher simples dans la sidebar - distinct du
 * `SizeSelector` en pastilles rondes utilisé sur PDP/panier.
 */
const DosageFormat = () => {
	return (
		<div className="space-y-3">
			{SIZES.map((size) => (
				<label
					key={size}
					className="flex gap-3 items-center text-sm text-gray-800 cursor-pointer"
				>
					<Checkbox />
					{size}
				</label>
			))}
		</div>
	);
};

export default DosageFormat;
