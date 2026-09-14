"use client";

import MonalisaHero from "../organims/monalisa-hero";
import BestSellingSection from "../organims/best-selling";
import CustomerExperienceSection from "../organims/customer-experience";
import NewCollectionShowcase from "../organims/new-collection-showcase";
import ProductRecommendations from "../organims/product-recommendations";
import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";

const HomeView = () => {
	return (
		<main className="w-full min-h-screen bg-white pb-12">
			{/* 1. Hero Section with floating interactive New Collection card */}
			<MonalisaHero />

			{/* 2. Explore Our Best Selling Product Collection */}
			<BestSellingSection />

			{/* 3. We Deliver Exceptional Customer Experiences (Dark Section) */}
			<CustomerExperienceSection />

			{/* 4. Explore Our New Collection (Asymmetric Editorial Grid) */}
			<NewCollectionShowcase />

			{/* 5. Product Recommendations (Editorial Articles / Stories) */}
			<ProductRecommendations />

			{/* 6. Stratosphere Call-To-Action Banner */}
			<PhotoOverlayBanner
				image="/home/cover-box-3.jpg"
				title="Sublimez votre style"
				subtitle="Prêt à passer au niveau supérieur ? Découvrez nos pièces phares et osez de nouvelles associations."
				cta={{
					label: "Découvrir la boutique",
					href: "/collections",
				}}
				contained={true}
				height="lg"
			/>
		</main>
	);
};

export default HomeView;
