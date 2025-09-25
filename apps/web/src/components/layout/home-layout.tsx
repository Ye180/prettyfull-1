import Footer from "@/shared/components/organims/footer";
import Header from "@/shared/components/organims/header";
import { cn } from "@prettyfull/utils";
import { PropsWithChildren } from "react";

interface HomeLayoutProps extends PropsWithChildren<{ className?: string }> {}

const HomeLayout = ({
	children,
	className,
}: PropsWithChildren<HomeLayoutProps>) => {
	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden">
			<Header />
			<div className={cn("h-fit", className)}>{children}</div>
			<Footer />
		</div>
	);
};

export default HomeLayout;
