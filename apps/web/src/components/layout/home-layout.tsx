"use client";
import { useGetPrimaryCategory } from "@/features/homepage/api/get-primary-category";
// import { useGetPrimaryCategory } from "@/features/homepage/api/get-children-category";
import Footer from "@/shared/components/organims/footer";
import Header from "@/shared/components/organims/header";
import { cn } from "@prettyfull/utils";
import { PropsWithChildren } from "react";

interface HomeLayoutProps extends PropsWithChildren<{ className?: string }> {}

const HomeLayout = ({
	children,
	className,
}: PropsWithChildren<HomeLayoutProps>) => {
	const { data: main_category } = useGetPrimaryCategory();

	console.log("main_category", main_category); // Debugging line, can be removed later

	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden">
			<Header main_category={main_category} />
			<div className={cn("h-fit", className)}>{children}</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;
