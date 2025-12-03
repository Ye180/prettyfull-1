"use client";

import { cn } from "@prettyfull/utils";

// Icône Check simple
const CheckIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={3}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
);

// Mapping des noms de couleurs vers des codes hexadécimaux
const COLOR_MAP: Record<string, string> = {
	// Couleurs de base
	black: "#000000",
	white: "#FFFFFF",
	red: "#EF4444",
	blue: "#3B82F6",
	green: "#22C55E",
	yellow: "#EAB308",
	orange: "#F97316",
	purple: "#A855F7",
	pink: "#EC4899",
	gray: "#6B7280",
	grey: "#6B7280",
	brown: "#92400E",
	beige: "#D4C4A8",
	navy: "#1E3A5F",
	cream: "#FFFDD0",
	ivory: "#FFFFF0",
	gold: "#FFD700",
	silver: "#C0C0C0",
	// Nuances
	"light blue": "#87CEEB",
	"dark blue": "#00008B",
	"light green": "#90EE90",
	"dark green": "#006400",
	"light pink": "#FFB6C1",
	"hot pink": "#FF69B4",
	burgundy: "#800020",
	maroon: "#800000",
	coral: "#FF7F50",
	salmon: "#FA8072",
	teal: "#008080",
	turquoise: "#40E0D0",
	lavender: "#E6E6FA",
	olive: "#808000",
	tan: "#D2B48C",
	khaki: "#F0E68C",
	charcoal: "#36454F",
	// Couleurs Fashion Nova style
	hunter: "#355E3B",
	"hunter green": "#355E3B",
	nude: "#E3BC9A",
	blush: "#DE5D83",
	wine: "#722F37",
	rust: "#B7410E",
	mustard: "#FFDB58",
	mauve: "#E0B0FF",
	sage: "#9DC183",
	mint: "#98FF98",
	peach: "#FFCBA4",
	rose: "#FF007F",
	taupe: "#483C32",
	camel: "#C19A6B",
	cognac: "#9F381D",
	mocha: "#967969",
	espresso: "#3C2415",
	chocolate: "#7B3F00",
	noir: "#000000",
	blanc: "#FFFFFF",
	rouge: "#EF4444",
	bleu: "#3B82F6",
	vert: "#22C55E",
	jaune: "#EAB308",
	rose_fr: "#FF007F",
	violet: "#8B5CF6",
	gris: "#6B7280",
	marron: "#92400E",
};

interface ColorSelectorProps {
	colors: string[];
	selectedColor: string;
	onColorChange: (color: string) => void;
	className?: string;
}

export function ColorSelector({
	colors,
	selectedColor,
	onColorChange,
	className,
}: ColorSelectorProps) {
	const getColorCode = (colorName: string): string => {
		const normalizedName = colorName.toLowerCase().trim();
		return COLOR_MAP[normalizedName] || "#CCCCCC";
	};

	const isLightColor = (hexColor: string): boolean => {
		const hex = hexColor.replace("#", "");
		const r = parseInt(hex.substr(0, 2), 16);
		const g = parseInt(hex.substr(2, 2), 16);
		const b = parseInt(hex.substr(4, 2), 16);
		const brightness = (r * 299 + g * 587 + b * 114) / 1000;
		return brightness > 155;
	};

	if (!colors || colors.length === 0) return null;

	return (
		<div className={cn("space-y-3", className)}>
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-gray-900 capitalize">
					{selectedColor || "Sélectionner une couleur"}
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{colors.map((color, index) => {
					const colorCode = getColorCode(color);
					const isSelected = selectedColor === color;
					const isLight = isLightColor(colorCode);

					return (
						<button
							key={index}
							onClick={() => onColorChange(color)}
							className={cn(
								"w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center",
								"border-2 hover:scale-110",
								isSelected
									? "ring-2 ring-offset-2 ring-black border-transparent"
									: "border-gray-200 hover:border-gray-400"
							)}
							style={{ backgroundColor: colorCode }}
							title={color}
							aria-label={`Couleur ${color}`}
						>
							{isSelected && (
								<CheckIcon
									className={cn(
										"w-4 h-4",
										isLight ? "text-black" : "text-white"
									)}
								/>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
