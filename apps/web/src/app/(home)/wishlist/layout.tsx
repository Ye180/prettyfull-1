import WishlistLayout from "@/components/layout/wishlist-layout";
import { PropsWithChildren } from "react";

const RootLayout = ({ children }: PropsWithChildren<{}>) => {
	return <WishlistLayout children={children} className="min-h-[90vh]" />;
};

export default RootLayout;
