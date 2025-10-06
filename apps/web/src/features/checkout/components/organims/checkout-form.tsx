import { Button, Checkbox, Input } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import InfosDelivery from "../molecules/infos-delivery";

const CheckoutForm = () => {
	const t = useTranslations("CheckoutPage.checkoutForm");

	const tsave = useTranslations("CheckoutPage.infosCheckout");
	return (
		<div>
			<div className="space-y-15 ">
				<Input label={t("labelMethod")} placeholder={t("placeholderMethod")} />
				<Input
					label={t("labelAddress")}
					placeholder={t("placeholderNumber")}
					type="number"
				/>

				<Input label="" placeholder={t("placeholderLastName")} />

				<Input label="" placeholder={t("placeholderAddress")} />
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					<Input
						label={t("labelPostCode")}
						placeholder={t("placeholderPostCode")}
					/>
					<Input label={t("labelCity")} placeholder={t("placeholderCity")} />
				</div>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
					<Input label={t("labelState")} placeholder={t("placeholderState")} />
					<Input
						label={t("labelCountry")}
						placeholder={t("placeholderCountry")}
					/>
				</div>
			</div>

			<div className="flex flex-col mt-10 space-y-8">
				<div className="flex items-center space-x-4">
					<Checkbox />
					<span>{tsave("save")}</span>
				</div>
				<div className="flex items-center space-x-4">
					<Checkbox />
					<span>{tsave("favorite")}</span>
				</div>
			</div>
			<div className="flex flex-col mt-10 space-y-12">
				<div className="flex items-center space-x-4">
					<h4 className="!text-[2.8rem] ">{tsave("termes")}</h4>
				</div>
				<div className="flex items-center space-x-4">
					<Checkbox />
					<span>{tsave("accept")}</span>
				</div>
				<div className="flex items-center space-x-4 sm:w-2/3 lg:w-2/3">
					<Button className="!px-36 max-sm:w-full sm:w-fit" disabled={true}>
						{tsave("ctaButton")}
					</Button>
				</div>
				<InfosDelivery />
			</div>
		</div>
	);
};

export default CheckoutForm;
