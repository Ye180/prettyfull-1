"use client";
import { useGetPrimaryCategory } from "@/features/homepage/api/get-primary-category";
import { useGetSiteKeyContent } from "@/shared/api/key-site-content";
// import { useGetPrimaryCategory } from "@/features/homepage/api/get-children-category";
import Footer from "@/shared/components/organims/footer";
import Header from "@/shared/components/organims/header";
import { cn } from "@prettyfull/utils";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

import { useGetParentsCategoryMedusa } from "@/features/homepage/api/get-parent-category-medusa";
import { useGetProductsMedusa } from "@/features/homepage/api/get-products-medusa";

interface HomeLayoutProps extends PropsWithChildren<{ className?: string }> {}

const HomeLayout = ({
	children,
	className,
}: PropsWithChildren<HomeLayoutProps>) => {
	const router = useRouter();
	const pathname = usePathname();

	const {
		data: main_category,
		isLoading,
		isError,
		error,
	} = useGetPrimaryCategory();

	const { data: keyContent, isLoading: isLoadingKeyContent } =
		useGetSiteKeyContent();

	const { data: productMedusa, isLoading: loadingProductsMedusa } =
		useGetProductsMedusa();

	const {
		data: parentsCategoryMedusa,
		isLoading: loadingParentsCategoryMedusa,
	} = useGetParentsCategoryMedusa();

	console.log("Products from Medusa:", productMedusa);
	console.log("Parent Categories from Medusa:", parentsCategoryMedusa);
	// Redirection automatique depuis "/" vers la première page
	useEffect(() => {
		if (
			!isLoadingKeyContent &&
			keyContent &&
			keyContent.length > 0 &&
			pathname === "/"
		) {
			const firstPageSlug = keyContent[0]?.slug;
			if (firstPageSlug) {
				router.replace(`/pages/${firstPageSlug}`);
			}
		}
	}, [keyContent, isLoadingKeyContent, pathname, router]);

	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden">
			<Header main_category={keyContent} />
			<div className={cn("h-fit", className)}>{children}</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;
