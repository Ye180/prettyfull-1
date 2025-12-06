"use client";

import {
	Button,
	Checkbox,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputSelect from "../../../../../../../packages/ui/src/input-select";
import {
	useUpdateCartAddress,
	type AddressData,
} from "../../api/update-cart-address";
import { useCheckoutStep } from "../../hooks/use-checkout-step";
import { useCheckoutStore } from "../../stores/use-checkout-store";

interface AddressFormValues {
	email: string;
	firstName: string;
	lastName: string;
	company?: string;
	address: string;
	address2?: string;
	postCode: string;
	city: string;
	region: string;
	country?: string;
	phone: string;
}

interface AddressStepProps {
	cartId: string | null;
	onComplete?: (data: AddressData) => void;
}

export function AddressStep({ cartId, onComplete }: AddressStepProps) {
	const { goToStep, isStepCompleted, isStepActive } = useCheckoutStep();
	const { setShippingAddress, setSameBillingAddress, shippingAddress } =
		useCheckoutStore();
	const updateCartAddress = useUpdateCartAddress();
	const [isLoading, setIsLoading] = useState(false);
	const [sameBilling, setSameBilling] = useState(true);

	const isOpen = isStepActive("address");
	const isCompleted = isStepCompleted("address");

	const form = useForm<AddressFormValues>({
		mode: "onChange",
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			company: "",
			address: "",
			address2: "",
			postCode: "",
			city: "",
			region: "",
			country: "",
			phone: "",
		},
	});

	const handleSubmit = form.handleSubmit(async (data) => {
		if (!cartId) return;

		setIsLoading(true);
		try {
			// Map form values to Medusa address format
			const addressData: AddressData = {
				email: data.email,
				first_name: data.firstName,
				last_name: data.lastName,
				company: data.company,
				address_1: data.address,
				address_2: data.address2,
				postal_code: data.postCode,
				city: data.city,
				province: data.region,
				country_code: getCountryCode(data.country || ""),
				phone: data.phone,
			};

			// Update cart with address via Medusa API
			await updateCartAddress.mutateAsync({
				cartId,
				shippingAddress: addressData,
				billingAddress: sameBilling ? undefined : addressData,
			});

			// Save to store
			setShippingAddress(addressData);
			setSameBillingAddress(sameBilling);

			onComplete?.(addressData);
		} catch (error) {
			console.error("Failed to update address:", error);
		} finally {
			setIsLoading(false);
		}
	});

	// Helper to convert country name to ISO code
	const getCountryCode = (country: string): string => {
		const countryMap: Record<string, string> = {
			Cameroun: "cm",
			France: "fr",
			Belgique: "be",
			Suisse: "ch",
			Canada: "ca",
			"Côte d'Ivoire": "ci",
			Sénégal: "sn",
		};
		return countryMap[country] || "cm";
	};

	const handleEdit = () => {
		goToStep("address");
	};

	const classNameInput = cn("py-6");

	// Countries list - you can expand this
	const countries = [
		"Cameroun",
		"France",
		"Belgique",
		"Suisse",
		"Canada",
		"Côte d'Ivoire",
		"Sénégal",
	];

	return (
		<div className="bg-white">
			{/* Header */}
			<div className="flex flex-row justify-between items-center mb-6">
				<h2
					className={cn(
						"flex flex-row font-medium gap-x-2 items-center text-3xl! tracking-wider",
						{
							"opacity-50 pointer-events-none select-none":
								!isOpen && !isCompleted,
						}
					)}
				>
					Shipping Address
					{isCompleted && (
						<svg
							className="w-8 h-8 text-green-600"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</h2>
				{!isOpen && isCompleted && (
					<Button
						variant="outline"
						onClick={handleEdit}
						className="px-6 py-2 text-sm text-dark w-fit"
					>
						Edit
					</Button>
				)}
			</div>

			{/* Form Content */}
			{isOpen ? (
				<Form {...form}>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email */}
						<FormField
							control={form.control}
							name="email"
							rules={{
								required: "Email requis",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Email invalide",
								},
							}}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											placeholder="your@email.com"
											className={classNameInput}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Name Row */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="firstName"
								rules={{ required: "Prénom requis" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>First name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="First name"
												className={classNameInput}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="lastName"
								rules={{ required: "Nom requis" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Last name"
												className={classNameInput}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Company (optional) */}
						<FormField
							control={form.control}
							name="company"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company (optional)</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Company name"
											className={classNameInput}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Address */}
						<FormField
							control={form.control}
							name="address"
							rules={{ required: "Adresse requise" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Street address"
											className={classNameInput}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Address 2 (optional) */}
						<FormField
							control={form.control}
							name="address2"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Apartment, suite, etc. (optional)</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Apartment, suite, etc."
											className={classNameInput}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* City / Postal Code Row */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="postCode"
								rules={{ required: "Code postal requis" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Postal code</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Postal code"
												className={classNameInput}
											/>
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
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="City"
												className={classNameInput}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Region / Country Row */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={form.control}
								name="region"
								rules={{ required: "Région requise" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>State / Province</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="State / Province"
												className={classNameInput}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="country"
								// rules={{ required: "Pays requis" }}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputSelect
												label="Country"
												placeholder="Select country"
												classNameSelect="py-2"
												items={countries}
												onChange={(value: string) =>
													form.setValue("country", value, {
														shouldValidate: true,
													})
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Phone */}
						<FormField
							control={form.control}
							name="phone"
							rules={{ required: "Téléphone requis" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="tel"
											placeholder="+237 6XX XXX XXX"
											className={classNameInput}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Same billing address checkbox */}
						<div className="flex items-center pt-4 space-x-3">
							<Checkbox
								id="sameBilling"
								checked={sameBilling}
								onCheckedChange={(checked) => setSameBilling(checked === true)}
							/>
							<label htmlFor="sameBilling" className="text-sm">
								Billing address same as shipping address
							</label>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							className="py-6 mt-6 w-full"
							disabled={isLoading || !cartId}
						>
							{isLoading ? "Saving..." : "Continue to delivery"}
						</Button>
					</form>
				</Form>
			) : isCompleted ? (
				/* Summary when completed */
				<div className="space-y-1 text-sm text-gray-600">
					<p>
						{form.getValues("firstName")} {form.getValues("lastName")}
					</p>
					<p>{form.getValues("address")}</p>
					<p>
						{form.getValues("postCode")}, {form.getValues("city")}
					</p>
					<p>{form.getValues("country")}</p>
					<p>{form.getValues("phone")}</p>
					<p>{form.getValues("email")}</p>
				</div>
			) : null}

			<div className="mt-8 border-t border-gray-200" />
		</div>
	);
}

export default AddressStep;
