"use client";

import { useTranslations } from "next-intl";
import { useGetHighlights } from "../api/medusa/get-highlights";

const ICONS: Record<string, React.ReactNode> = {
	lab: (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
		</svg>
	),
	leaf: (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	),
	truck: (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<rect x="1" y="6" width="14" height="11" rx="1.5" />
			<path d="M15 10h4l3 3.5V17h-7z" />
			<circle cx="6" cy="19.5" r="1.8" />
			<circle cx="17.5" cy="19.5" r="1.8" />
		</svg>
	),
	shield: (
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	),
};

const DEFAULT_ICON = (
	<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="9" />
		<path d="M12 8v4l3 2" />
	</svg>
);

const DEFAULT_FEATURE_KEYS = [
	{
		icon: "shield",
		titleKey: "authenticTitle",
		descriptionKey: "authenticDescription",
	},
	{
		icon: "truck",
		titleKey: "deliveryTitle",
		descriptionKey: "deliveryDescription",
	},
	{
		icon: "lab",
		titleKey: "supportTitle",
		descriptionKey: "supportDescription",
	},
];

export const CustomerExperienceSection = () => {
	const t = useTranslations("HomePage.customerExperience");
	const { data: highlights } = useGetHighlights("home_trust");

	const DEFAULT_FEATURES = DEFAULT_FEATURE_KEYS.map((feature) => ({
		icon: feature.icon,
		title: t(feature.titleKey),
		description: t(feature.descriptionKey),
	}));

	const features = highlights && highlights.length > 0 ? highlights : DEFAULT_FEATURES;

	return (
		<section className="w-full bg-[#141210] text-white py-14 my-6">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="max-w-2xl mx-auto text-center space-y-4 pb-10">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
						{t("title")}
					</h2>
					<p className="text-[1.5rem] sm:text-[1.6rem] text-white/70 leading-relaxed font-light">
						{t("subtitle")}
					</p>
				</div>

				{/* 3 Columns */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
					{features.map((feature, idx) => (
						<div key={idx} className="flex flex-col items-start space-y-5">
							<div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg">
								{ICONS[feature.icon] ?? DEFAULT_ICON}
							</div>
							<h3 className="text-[1.8rem] font-bold text-white tracking-tight">
								{feature.title}
							</h3>
							<p className="text-[1.4rem] text-white/65 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default CustomerExperienceSection;
