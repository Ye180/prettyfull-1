import { useTranslations } from "next-intl";

const BADGE_ICONS = [
	{
		key: "nonGmo",
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M12 2C9 5 7 8 7 12a5 5 0 0 0 10 0c0-4-2-7-5-10z" />
			</svg>
		),
	},
	{
		key: "glutenFree",
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M12 2v20M12 6l4-2M12 10l4-2M12 14l4-2M12 18l4-2M12 6l-4-2M12 10l-4-2M12 14l-4-2M12 18l-4-2" />
			</svg>
		),
	},
	{
		key: "vegan",
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
			</svg>
		),
	},
	{
		key: "vegetarian",
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<circle cx="12" cy="12" r="9" />
				<path d="M8 12h8M12 8v8" />
			</svg>
		),
	},
	{
		key: "natural",
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
				<path d="M12 22V12M12 12C7 12 4 9 4 4c5 0 8 3 8 8zM12 12c5 0 8-3 8-8-5 0-8 3-8 8z" />
			</svg>
		),
	},
];

/**
 * Bande de badges de confiance sous le hero, dans le style
 * "Formulated with Your Wellness in Mind" de la référence.
 */
export const TrustBadgesSection = () => {
	const t = useTranslations("HomePage.trustBadges");

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
			<div className="mb-8 space-y-3 text-center">
				<p className="text-[1.2rem] font-semibold tracking-widest text-amber-600 uppercase">
					{t("eyebrow")}
				</p>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#080808]">
					{t("title")}
				</h2>
			</div>

			<div className="flex flex-wrap justify-center gap-x-10 gap-y-6 pb-8 border-b border-gray-100 sm:gap-x-14">
				{BADGE_ICONS.map((badge) => (
					<div key={badge.key} className="flex flex-col items-center gap-3 w-20 text-center">
						<div className="flex justify-center items-center w-16 h-16 text-amber-600 rounded-full border border-gray-200">
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
