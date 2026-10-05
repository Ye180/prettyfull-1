"use client";

import { AccountMenu } from "@/features/account/components/account-menu";
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";

const AccountLayout = ({ children }: PropsWithChildren) => {
	const t = useTranslations("Account.layout");
	return (
		<div className="px-4 pt-10 pb-24 mx-auto w-full max-w-[130rem] min-h-screen sm:px-6 lg:px-10">
			<h1 className="mb-8 text-[3.6rem]! md:hidden">{t("title")}</h1>

			<div className="grid grid-cols-1 gap-10 md:grid-cols-[26rem_1fr] lg:gap-16">
				<aside>
					<div className="md:sticky md:top-56">
						<AccountMenu />
					</div>
				</aside>

				<main className="min-w-0">{children}</main>
			</div>
		</div>
	);
};

export default AccountLayout;
