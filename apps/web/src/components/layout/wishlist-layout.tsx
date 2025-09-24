import { cn } from "@prettyfull/utils";
import { PropsWithChildren } from "react";

interface WishlistProps {
	className?: string;
}

const WishlistLayout = ({
	children,
	className,
}: PropsWithChildren<WishlistProps>) => {
	return <div className={cn(className)}>{children}</div>;
};

export default WishlistLayout;
