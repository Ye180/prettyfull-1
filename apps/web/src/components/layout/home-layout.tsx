"use client";
import { useGetPrimaryCategories } from "@/features/homepage/api/medusa/get-primary-categories";
import Footer from "@/shared/components/organims/footer";
import Header from "@/shared/components/organims/header";
import { cn } from "@prettyfull/utils";
import { PropsWithChildren } from "react";

interface HomeLayoutProps extends PropsWithChildren<{ className?: string }> {}

const HomeLayout = ({
	children,
	className,
}: PropsWithChildren<HomeLayoutProps>) => {
	const { data: parentsCategoryMedusa } = useGetPrimaryCategories();

	return (
		<div className="flex flex-col min-h-screen bg-white">
			<Header main_category={parentsCategoryMedusa} />
			<div className={cn("h-fit", className)}>{children}</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;
