"use client";

import { FOOTER_DATA } from "@/lib/utils/constants/constants";
import { useTranslations } from "next-intl";
import Link from "next/link";

const LinksFooter = () => {
	const t = useTranslations("Footer");

	return (
		<div className="grid grid-cols-2 col-span-1 gap-8 sm:grid-cols-4 lg:col-span-4">
			{FOOTER_DATA.map((item, index) => (
				<div key={index} className="text-left space-y-4">
					<h5 className="text-[1.5rem] font-semibold text-white tracking-wide">
						{t(item.titleKey)}
					</h5>
					<ul className="space-y-3 text-[1.4rem] text-white/60">
						{item.links.map((link) => (
							<li key={link.labelKey}>
								<Link
									href={link.url}
									className="transition-colors hover:text-white"
								>
									{t(link.labelKey)}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default LinksFooter;
