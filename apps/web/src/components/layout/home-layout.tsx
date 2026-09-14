"use client";
import { useGetParentsCategoryMedusa } from "@/features/homepage/api/medusa/get-parent-category-medusa";
import Footer from "@/shared/components/organims/footer";
import Header from "@/shared/components/organims/header";
import { cn } from "@prettyfull/utils";
import { PropsWithChildren, useState } from "react";

interface HomeLayoutProps extends PropsWithChildren<{ className?: string }> {}

const HomeLayout = ({
	children,
	className,
}: PropsWithChildren<HomeLayoutProps>) => {
	const {
		data: parentsCategoryMedusa,
		isLoading: loadingParentsCategoryMedusa,
	} = useGetParentsCategoryMedusa();
	// ponytail: footer is `position: fixed` behind the page (real sticky-reveal
	// effect, not a scroll-in animation) - the content column needs bottom
	// padding matching its live height so the footer only shows once scrolled
	// past, instead of sitting hidden under the content permanently.
	const [footerHeight, setFooterHeight] = useState(0);

	return (
		<div className="overflow-x-hidden">
			{/* ponytail: padding-bottom must live on THIS transparent wrapper, not
			 * the white one below - a background-color paints across its own
			 * padding box, so the reveal gap was being hidden by its own bg-white. */}
			<div className="relative z-10" style={{ paddingBottom: footerHeight }}>
				<div className="flex flex-col min-h-screen bg-white">
					<Header
						main_category={parentsCategoryMedusa}
						loading={loadingParentsCategoryMedusa}
					/>
					<div className={cn("h-fit", className)}>{children}</div>
				</div>
			</div>
			<Footer onHeightChange={setFooterHeight} />
		</div>
	);
};

export default HomeLayout;
