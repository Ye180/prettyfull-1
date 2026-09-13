import React from "react";

export const CustomerExperienceSection = () => {
	const features = [
		{
			title: "Quick and Friendly Support",
			description:
				"Our support team responds quickly and is friendly, ensuring your experience is efficient and pleasant. We prioritize your needs and assist you every step.",
			icon: (
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
			),
		},
		{
			title: "New Collection Everyday",
			description:
				"Explore our new collection launched daily! Each piece is designed to add a fresh twist to your style. Stay tuned for updates and find something special!",
			icon: (
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			),
		},
		{
			title: "Satisfaction Guaranteed",
			description:
				"We guarantee your satisfaction with our support team, quick to respond and friendly. Your experience is our priority, and we're here to assist you.",
			icon: (
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
					<path d="m9 12 2 2 4-4" />
				</svg>
			),
		},
	];

	return (
		<section className="w-full bg-[#070707] text-white py-24 my-12">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="max-w-2xl mx-auto text-center space-y-4 pb-16">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
						We Deliver Exceptional Customer Experiences
					</h2>
					<p className="text-[1.5rem] sm:text-[1.6rem] text-white/70 leading-relaxed font-light">
						We are committed to delivering exceptional customer experiences that
						exceed expectations and make every interaction memorable.
					</p>
				</div>

				{/* 3 Columns */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
					{features.map((feature, idx) => (
						<div key={idx} className="flex flex-col items-start space-y-5">
							<div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
								{feature.icon}
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
