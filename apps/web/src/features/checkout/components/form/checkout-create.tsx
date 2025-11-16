"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@prettyfull/ui";
import { useForm } from "react-hook-form";
import InputSelect from "../../../../../../../packages/ui/src/input-select";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";

interface CheckoutFormValues {
  method: string;
  address: string;
  name: string;
  postCode: string;
  city: string;
  region: string;
  country: string;
}

const CreateCheckoutForm = ({ onFormChange }: { onFormChange?: (valid: boolean) => void }) => {
  const t = useTranslations("CheckoutPage.checkoutForm");

  const form = useForm<CheckoutFormValues>({
    mode: "onChange",
    defaultValues: {
      method: "",
      address: "",
      name: "",
      postCode: "",
      city: "",
      region: "",
      country: "",
    },
  });

  // 🔁 Dès que le form change, on prévient le parent (CheckoutForm)
  const isValid = form.formState.isValid;
  if (onFormChange) onFormChange(isValid);

  const classNameSelect = cn("!text-[1.7rem] py-2 hover:bg-gray-100 cursor-pointer");

  return (
    <Form {...form}>
      <div className="space-y-10">
        <InputSelect
          label={t("placeholderMethod")}
          placeholder={t("placeholderMethod")}
          classNameSelect={classNameSelect}
          items={["Rapide", "Expédition", "Dans 3 jours"]}
          onChange={(value: string) => form.setValue("method", value, { shouldValidate: true })}
        />

        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Nom requis" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("labelName")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("placeholderLastName")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          rules={{ required: "Adresse requise" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("labelAddress")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t("placeholderAddress")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="postCode"
            rules={{ required: "Code postal requis" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labelPostCode")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("placeholderPostCode")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            rules={{ required: "Ville requise" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labelCity")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("placeholderCity")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="region"
            rules={{ required: "Région requise" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labelState")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("placeholderState")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            rules={{ required: "Pays requis" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("labelCountry")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("placeholderCountry")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
};

export default CreateCheckoutForm;
