import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import InputSelect from "../../../../../../../packages/ui/src/input-select";

const CreateCheckoutForm = () => {
	const form = useForm();

	const t = useTranslations("CheckoutPage.checkoutForm");

	const tsave = useTranslations("CheckoutPage.infosCheckout");

	const classNameSelect = cn(
		" !text-[1.7rem] py-2 hover:bg-gray-100 cursor-pointer"
	);

	return (
		<div>
			<Form {...form}>
				<div className="space-y-15 ">
					<InputSelect
						label={t("placeholderMethod")}
						placeholder={t("placeholderMethod")}
						classNameSelect={classNameSelect}
						items={["Rapide", "Expedition", "Dans 3 jours"]}
					/>

					<FormField
						control={form.control}
						name="adress"
						render={() => (
							<FormItem>
								<FormLabel>{t("labelAddress")} </FormLabel>
								<FormControl>
									<Input placeholder={t("placeholderNumber")} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="name"
						render={() => (
							<FormItem>
								<FormControl>
									<Input label="" placeholder={t("placeholderLastName")} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="adress"
						render={() => (
							<FormItem>
								<FormControl>
									<Input label="" placeholder={t("placeholderAddress")} />
								</FormControl>

								<FormDescription>{t("description")}</FormDescription>

								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<FormField
							control={form.control}
							name="postCode"
							render={() => (
								<FormItem>
									<FormLabel>{t("labelPostCode")} </FormLabel>
									<FormControl>
										<Input label="" placeholder={t("placeholderPostCode")} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="labelCity"
							render={() => (
								<FormItem>
									<FormLabel>{t("labelCity")} </FormLabel>
									<FormControl>
										<Input label="" placeholder={t("placeholderCity")} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<FormField
							control={form.control}
							name="labelState"
							render={() => (
								<FormItem>
									<FormLabel>{t("labelState")} </FormLabel>
									<FormControl>
										<Input label="" placeholder={t("placeholderState")} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="labelCity"
							render={() => (
								<FormItem>
									<FormLabel>{t("labelCountry")} </FormLabel>
									<FormControl>
										<Input label="" placeholder={t("placeholderCountry")} />
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</Form>
		</div>
	);
};

export default CreateCheckoutForm;
