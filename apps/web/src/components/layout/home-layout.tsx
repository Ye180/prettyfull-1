"use client";
import { useGetPrimaryCategory } from "@/features/homepage/api/backend/get-primary-category";
import { useGetSiteKeyContent } from "@/shared/api/key-site-content";
import Footer from "@/shared/components/organims/footer";
import Header from "@/shared/components/organims/header";
import { cn } from "@prettyfull/utils";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

import { useGetParentsCategoryMedusa } from "@/features/homepage/api/medusa/get-parent-category-medusa";

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

	const {
		data: parentsCategoryMedusa,
		isLoading: loadingParentsCategoryMedusa,
	} = useGetParentsCategoryMedusa();

	// useEffect(() => {
	// 	const cartId = localStorage.getItem("cart_id");
	// 	if (cartId) {
	// 		// Le panier existe déjà, ne rien faire
	// 		return;
	// 	}
	// 	// Créer un nouveau panier et stocker son id
	// 	const items = sdk.store.cart
	// 		.create({ region_id: "reg_01KAGE6E6H99WSEH3F2A8BB684" })
	// 		.then(({ cart }) => {
	// 			localStorage.setItem("cart_id", cart.id);
	// 		});
	// }, []);

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
