import { cn } from "@prettyfull/utils";
import { PropsWithChildren } from "react";

interface ProductsLayoutProps extends PropsWithChildren<{}> {
	className?: string;
}

const ProductsLayout = ({ children, className }: ProductsLayoutProps) => {
	return <div className={cn("min-h-screen", className)}>{children}</div>;
};

export default ProductsLayout;
