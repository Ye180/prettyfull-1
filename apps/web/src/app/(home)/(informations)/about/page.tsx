import type { Metadata } from "next";
import AboutViews from "@/features/about/views";

export const metadata: Metadata = {
	title: "About Us - Prettyfull",
	description:
		"Discover Prettyfull's approach to vitamins and supplements: lab-tested ingredients, precise dosing, and formulas designed for your daily wellness routine.",
};

const Page = () => <AboutViews />;

export default Page;
