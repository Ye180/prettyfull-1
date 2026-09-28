"use client";

import { paths } from "@/lib/routes/paths-en";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { FC } from "react";
import DescriptionFooter from "../molecules/footer/label";
import LinksFooter from "../molecules/footer/links";

const Footer: FC = () => {
	const t = useTranslations("Footer");

	return (
		<footer className="px-4 py-16 w-full text-white bg-black">
			<div className="max-w-[150rem] mx-auto w-full lg:px-8">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-12">
					<DescriptionFooter />
					<LinksFooter />
				</div>

				<div className="flex flex-col gap-4 justify-between items-center pt-8 mt-12 text-[1.3rem] border-t border-white/10 text-white/50 sm:flex-row">
					<span>{t("copyright")}</span>
					<div className="flex gap-6">
						<Link
							href={paths.terms}
							className="transition-colors cursor-pointer hover:text-white"
						>
							{t("termsLink")}
						</Link>
						<Link
							href={paths.shippingReturn}
							className="transition-colors cursor-pointer hover:text-white"
						>
							{t("shippingReturns")}
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
