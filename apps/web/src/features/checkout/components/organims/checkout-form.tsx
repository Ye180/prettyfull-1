"use client";

import { Button, Checkbox } from "@prettyfull/ui";
import { useState } from "react";
import { useTranslations } from "next-intl";
import CreateCheckoutForm from "../form/checkout-create";
import InfosDelivery from "../molecules/infos-delivery";

const CheckoutForm = () => {
  const tsave = useTranslations("CheckoutPage.infosCheckout");
  const [isFormValid, setIsFormValid] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = () => {
    if (!isFormValid || !termsAccepted) return;
    console.log("✅ Proceeding to payment...");
  };

  const isDisabled = !isFormValid || !termsAccepted;

  return (
    <div>
      <CreateCheckoutForm onFormChange={setIsFormValid} />

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
          <Checkbox
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(!!checked)}
          />
          <span>{tsave("accept")}</span>
        </div>

        <div className="flex items-center space-x-4 sm:w-2/3 lg:w-2/3">
          <Button
            className="!px-36 max-sm:w-full sm:w-fit"
            disabled={isDisabled}
            onClick={handleSubmit}
          >
            {tsave("ctaButton")}
          </Button>
        </div>

        <InfosDelivery />
      </div>
    </div>
  );
};

export default CheckoutForm;
