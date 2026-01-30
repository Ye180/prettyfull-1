// web/src/app/(home)/(informations)/account/layout.tsx
import { AccountMenu } from "@/features/account/components/account-menu";
import { PropsWithChildren } from "react";

const AccountLayout = ({ children }: PropsWithChildren<{}>) => {
	return (
		<div className="py-12 min-h-screen">
			<div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<div className="mb-6 md:hidden">
					<h1 className="text-3xl font-bold text-gray-900">Mon Espace</h1>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
					<aside className="md:col-span-4 lg:col-span-3">
						<div className="sticky top-28">
							<AccountMenu />
						</div>
					</aside>

					<main className="space-y-8 md:col-span-8 lg:col-span-9">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
};

export default AccountLayout;
