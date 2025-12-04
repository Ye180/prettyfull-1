"use client";

import { parseAsStringEnum, useQueryState } from "nuqs";

export type CheckoutStep = "address" | "delivery" | "payment" | "review";

const CHECKOUT_STEPS: CheckoutStep[] = [
	"address",
	"delivery",
	"payment",
	"review",
];

export function useCheckoutStep() {
	const [step, setStep] = useQueryState(
		"step",
		parseAsStringEnum<CheckoutStep>(CHECKOUT_STEPS).withDefault("address")
	);

	const currentStepIndex = CHECKOUT_STEPS.indexOf(step);

	const goToStep = (newStep: CheckoutStep) => {
		setStep(newStep);
	};

	const goToNextStep = () => {
		const nextIndex = currentStepIndex + 1;
		if (nextIndex < CHECKOUT_STEPS.length) {
			setStep(CHECKOUT_STEPS[nextIndex] as CheckoutStep);
		}
	};

	const goToPreviousStep = () => {
		const prevIndex = currentStepIndex - 1;
		if (prevIndex >= 0) {
			setStep(CHECKOUT_STEPS[prevIndex] as CheckoutStep);
		}
	};

	const isStepCompleted = (checkStep: CheckoutStep) => {
		return CHECKOUT_STEPS.indexOf(checkStep) < currentStepIndex;
	};

	const isStepActive = (checkStep: CheckoutStep) => {
		return step === checkStep;
	};

	const canAccessStep = (checkStep: CheckoutStep) => {
		return CHECKOUT_STEPS.indexOf(checkStep) <= currentStepIndex;
	};

	return {
		step,
		steps: CHECKOUT_STEPS,
		currentStepIndex,
		goToStep,
		goToNextStep,
		goToPreviousStep,
		isStepCompleted,
		isStepActive,
		canAccessStep,
		isFirstStep: currentStepIndex === 0,
		isLastStep: currentStepIndex === CHECKOUT_STEPS.length - 1,
	};
}
