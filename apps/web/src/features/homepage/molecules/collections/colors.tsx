import { Checkbox } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";

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

const Colors = () => {
	return (
		<div className="max-md:flex max-md:flex-wrap max-md:gap-y-10   md:grid md:grid-cols-2 justify-start pb-8 mt-4 md:space-y-6 gap-y-4 gap-x-10 text-balance">
			{items.map((item, i) => (
				<span className="flex items-center gap-2 cursor-pointer" key={i}>
					<Checkbox
						className={cn(
							"w-8 h-8 border border-black rounded-2xl",
							`data-[state=checked]:bg-[${item.hex}] data-[state=checked]:border`
						)}
						style={{
							backgroundColor: item.hex,
						}}
					/>
					{/* <span className="w-8 h-8 bg-red-500 rounded-2xl" /> */}
					<span className="ml-2 text-[1.6rem]">{item.fr}</span>
				</span>
			))}
		</div>
	);
};

export default Colors;
