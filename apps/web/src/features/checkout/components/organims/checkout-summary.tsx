import { DATA_CARD } from "@/lib/utils/constants/constants";
import { DropdownMenuSeparator } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { FC } from "react";
import VisualSummary from "../molecules/visual-sumary";
import { CartSummaryType } from "../../types";

interface Props {
	summary: CartSummaryType;
}

const CheckoutSummary: FC<Props> = ({ summary }) => {
	const t = useTranslations("CheckoutPage.summary");

	return (
		<div className="w-full py-6 bg-white ">
			<div className="flex flex-col pb-8 space-y-10">
				{DATA_CARD.map((item) => (
					<VisualSummary key={item.id} item={item} />
				))}
			</div>

			<h3 className="py-8 !text-2xl lg:!text-3xl ">{t("title")}</h3>
			<div className="mb-6 space-y-8">
				<div className="space-y-8">
					<div className="flex justify-between text-md ">
						<span>{t("subtotal")}</span>
						<span>${summary.subtotal}</span>
					</div>
					<div className="flex justify-between text-md ">
						<span>{t("shipping")}</span>
						<span>${summary.shipping}</span>
					</div>

					<div className="flex justify-between text-md ">
						<span>{t("taxes")}</span>
						<span>{summary.taxes ? `$${summary.taxes}` : "-"}</span>
					</div>
				</div>

				<DropdownMenuSeparator />
				<div className="flex justify-between py-6 text-lg font-semibold ">
					<span>{t("total")}</span>
					<span>${summary.total}</span>
				</div>
			</div>
			<DropdownMenuSeparator />

			<p className="py-8 text-[1.5rem] font-semibold">
				Arrive Dim, 28 Sept - Vend 02 Aout
			</p>
		</div>
	);
};

export default CheckoutSummary;
