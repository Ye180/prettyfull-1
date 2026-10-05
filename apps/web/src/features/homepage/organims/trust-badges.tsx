import { useTranslations } from "next-intl";

const SVG = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const BADGE_ICONS = [
	{
		key: "authentic",
		icon: (
			<svg {...SVG}>
				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				<path d="m9 12 2 2 4-4" />
			</svg>
		),
	},
	{
		key: "madeInUsa",
		icon: (
			<svg {...SVG}>
				<path d="m12 3 2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />
			</svg>
		),
	},
	{
		key: "sealed",
		icon: (
			<svg {...SVG}>
				<path d="M21 8 12 3 3 8v8l9 5 9-5z" />
				<path d="M3 8l9 5 9-5M12 13v8" />
			</svg>
		),
	},
	{
		key: "secondHand",
		icon: (
			<svg {...SVG}>
				<path d="M21 12a9 9 0 0 1-15.5 6.2M3 12a9 9 0 0 1 15.5-6.2" />
				<path d="M18.5 2v4h-4M5.5 22v-4h4" />
			</svg>
		),
	},
	{
		key: "delivery",
		icon: (
			<svg {...SVG}>
				<rect x="1" y="6" width="14" height="11" rx="1.5" />
				<path d="M15 10h4l3 3.5V17h-7z" />
				<circle cx="6" cy="19.5" r="1.8" />
				<circle cx="17.5" cy="19.5" r="1.8" />
			</svg>
		),
	},
];

/** Bande de badges de confiance sous le hero. */
export const TrustBadgesSection = () => {
	const t = useTranslations("HomePage.trustBadges");

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="mb-8 space-y-3 text-center">
				<p className="text-[1.2rem] font-semibold tracking-widest text-stone-900 uppercase">
					{t("eyebrow")}
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#080808]">
					{t("title")}
				</h2>
			</div>

			<div className="flex flex-wrap justify-center gap-x-10 gap-y-6 pb-8 border-b border-gray-100 sm:gap-x-14">
				{BADGE_ICONS.map((badge) => (
					<div key={badge.key} className="flex flex-col items-center gap-3 w-20 text-center">
						<div className="flex justify-center items-center w-16 h-16 text-stone-900 rounded-full border border-gray-200">
							{badge.icon}
						</div>
						<span className="text-[1.2rem] font-medium text-[#333333]">{t(badge.key)}</span>
					</div>
				))}
			</div>
		</section>
	);
};

export default TrustBadgesSection;
