"use client";
import { useGetParentsCategoryMedusa } from "@/features/homepage/api/medusa/get-parent-category-medusa";
import Footer from "@/shared/components/organims/footer";
import Header from "@/shared/components/organims/header";
import { cn } from "@prettyfull/utils";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

interface HomeLayoutProps extends PropsWithChildren<{ className?: string }> {}

const HomeLayout = ({
	children,
	className,
}: PropsWithChildren<HomeLayoutProps>) => {
	const router = useRouter();
	const pathname = usePathname();

	const {
		data: parentsCategoryMedusa,
		isLoading: loadingParentsCategoryMedusa,
	} = useGetParentsCategoryMedusa();

	useEffect(() => {
		if (
			!loadingParentsCategoryMedusa &&
			parentsCategoryMedusa &&
			parentsCategoryMedusa.length > 0 &&
			pathname === "/"
		) {
			const firstPageHandle = parentsCategoryMedusa[0]?.handle;
			if (firstPageHandle) {
				router.replace(`/pages/${firstPageHandle}`);
			}
		}
	}, [parentsCategoryMedusa, loadingParentsCategoryMedusa, pathname, router]);

	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden">
			<Header
				main_category={parentsCategoryMedusa}
				loading={loadingParentsCategoryMedusa}
			/>
			<div className={cn("h-fit", className)}>{children}</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;
