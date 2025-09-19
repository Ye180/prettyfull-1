import ProductsLayout from "@/components/layout/products-layout";
import { PropsWithChildren } from "react";

const ProductsRootLayout = ({ children }: PropsWithChildren<{}>) => {
	return <ProductsLayout children={children} />;
};

export default ProductsRootLayout;
