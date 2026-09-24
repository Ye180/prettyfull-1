import HomeLayout from "@/components/layout/home-layout";
import { PropsWithChildren } from "react";

// ponytail: auth pages reuse the site's normal chrome (header/footer) instead
// of a bespoke split-screen layout - keeps nav/logo/cart reachable and
// matches the rest of the site with zero extra design work.
const AuthRootLayout = ({ children }: PropsWithChildren<{}>) => {
	return (
		<HomeLayout className="max-w-md mx-auto py-16 px-4">{children}</HomeLayout>
	);
};

export default AuthRootLayout;
