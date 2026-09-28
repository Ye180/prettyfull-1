"use client";

import PhotoOverlayBanner from "@/shared/components/organims/photo-overlay-banner";
import { useGetPromoBanner } from "../api/medusa/get-promo-banner";
import BestSellingSection from "../organims/best-selling";
import CustomerExperienceSection from "../organims/customer-experience";
import HeroBanner from "../organims/hero-banner";
import NewCollectionShowcase from "../organims/new-collection-showcase";
import ProductRecommendations from "../organims/product-recommendations";
import ShopNewProducts from "../organims/shop-new-products";
import TrustBadgesSection from "../organims/trust-badges";

const HomeView = () => {
	const { data: promoBanner } = useGetPromoBanner();

	return (
		<main className="pb-12 w-full min-h-screen bg-white">
			{/* 1. Hero Section */}
			<HeroBanner />

			{/* 1b. Grille "Shop New Products" (2 grandes + 3 petites tuiles) */}
			<ShopNewProducts />

			{/* 1c. Trust badges */}
			<TrustBadgesSection />

			{/* 3. We Deliver Exceptional Customer Experiences (Dark Section) */}
			<CustomerExperienceSection />

			{/* 4. Explore Our New Collection (Asymmetric Editorial Grid) */}
			<NewCollectionShowcase />

			{/* 5. Product Recommendations (Editorial Articles / Stories) */}
			<ProductRecommendations />

			{/* 2. Explore Our Best Selling Product Collection */}
			<BestSellingSection />

			{/* 6. Stratosphere Call-To-Action Banner */}
			<PhotoOverlayBanner
				image={promoBanner?.image || "/home/supplements-hero-flatlay.jpg"}
				title={promoBanner?.title || "Votre bien-être, notre priorité"}
				subtitle={
					promoBanner?.subtitle ||
					"Formules testées en laboratoire, ingrédients sélectionnés avec soin. Découvrez la gamme qui accompagne votre routine santé au quotidien."
				}
				cta={{
					label: promoBanner?.cta || "Découvrir la boutique",
					href: promoBanner?.link || "/collections",
				}}
				contained={true}
				height="lg"
			/>
		</main>
	);
};

export default HomeView;
