"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAddVariants } from "../api/add-variants-products";
import { useCreateInit } from "../api/create-init-products";
import { useCreate } from "../api/create-products";
import FormProductAddVariant from "./form-add-variant";
import FormProductInitCreation from "./form-product-init-creation";
// Define PRODUCTS_QUERY_KEY (assuming it's defined elsewhere, e.g., 'products')
const PRODUCTS_QUERY_KEY = "products";
// Assuming toast is defined globally or imported
const toast = {
	success: (message) => console.log(`SUCCESS: ${message}`),
	error: (message) => console.error(`ERROR: ${message}`),
};

export default function ProductForm() {
	const { mutate: createProduct, isPending } = useCreate(); // Removed isSuccess, isError as they are not used immediately
	const { mutate: createInitProduct, isPending: isInitPending } =
		useCreateInit(); // Removed isSuccess, isError as they are not used immediately

	const { mutate: addVariantProduct, isPending: isAddVariantPending } =
		useAddVariants(); // Removed isSuccess, isError as they are not used immediately

	const form = useForm({
		defaultValues: {
			step1: {
				nameFr: "",
				nameEn: "",

				descriptionFr: "",
				descriptionEn: "",
				smallDescriptionFr: "",
				smallDescriptionEn: "",
				categoryId: "",
				link: "",
				sku: "",

				priceAmountFr: null,
				priceAmountEn: null,
				currencyFr: "",
				currencyEn: "",

				solde: false,
				reducedPrice: 0,
				pourcentage: 0,
				labelFr: "", // Corrected: Should be labelFr/En to match DTO structure
				labelEn: "",

				isActive: true,
				isFeatured: false,
				stock: 0,
				seoTitleFr: "",
				seoTitleEn: "",
				seoDescFr: "",
				seoDescEn: "",
				slug: "",
				seoKeywords: "",
			},
			step2: {
				variants: [
					{
						id: "",
						colorLabel: "",
						colorCode: "#FFFFFF",
						size: [""], // Comma-separated string for react-hook-form input
						quantity: 0,
						image: [], // FileList or array of files
					},
				],
			},
		},
	});

	const { control, handleSubmit } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "variants",
	});

	const queryClient = useQueryClient();

	const [currentStep, setCurrentStep] = useState(0);
	const [productId, setProductId] = useState(0);

	const handleNext = async (e) => {
		e.preventDefault(); // Empêcher la soumission du formulaire

		setCurrentStep((prev) => Math.min(prev + 1)); // Ajustez la
	};

	const handlePrevious = async (e) => {
		e.preventDefault(); // Empêcher la soumission du formulaire

		setCurrentStep((prev) => Math.min(prev - 1)); // Ajustez la
	};
	const onSubmit = async (data) => {
		// --- API Calls based on current step ---

		try {
			if (currentStep == 0) {
				const dataSend = {
					name: {
						fr: data.step1.nameFr,
						en: data.step1.nameEn,
					},
					description: {
						fr: data.step1.descriptionFr,
						en: data.step1.descriptionEn,
					},
					smallDescription: {
						fr: data.step1.smallDescriptionFr,
						en: data.step1.smallDescriptionEn,
					},

					categoryId: data.step1.categoryId,
					link: data.step1.link,
					sku: data.step1.sku,
					slug: data.step1.slug,
					price: {
						amount: {
							fr: Number(data.step1.priceAmountFr),
							en: Number(data.step1.priceAmountEn),
						},
						currency: {
							fr: data.step1.currencyFr,
							en: data.step1.currencyEn,
						},
					},
					solde: data.step1.solde,
					promotion: data.step1.solde
						? {
								reduced_price: {
									fr: Number(data.step1.reducedPrice),
									en: Number(data.step1.reducedPrice),
								},
								pourcentage: Number(data.step1.pourcentage),
							}
						: undefined,
					label: {
						fr: data.step1.labelFr,
						en: data.step1.labelEn,
					},
					isActive: data.step1.isActive,
					isFeatured: data.step1.isFeatured,
					stock: Number(data.step1.stock),
					seoMeta: {
						title: {
							fr: data.step1.seoTitleFr,
							en: data.step1.seoTitleEn,
						},
						description: {
							fr: data.step1.seoDescFr,
							en: data.step1.seoDescEn,
						},
						keywords: data.step1.seoKeywords
							? data.step1.seoKeywords
									.split(",")
									.map((k) => k.trim())
									.filter((k) => k)
							: [],
					},
				};

				createInitProduct(dataSend, {
					// Assuming createInitProduct returns a promise
					onSuccess: async (response) => {
						await queryClient.invalidateQueries({
							queryKey: [PRODUCTS_QUERY_KEY],
						});

						setProductId(response._id); // Set the product ID from response if needed
						setCurrentStep((prev) => Math.min(prev + 1, 1)); // Move to next step
					},
					onError: (error) => {
						console.error(
							"Erreur lors de la création de l'initialisation du produit :",
							error
						);
						throw error; // Re-throw to be caught by outer catch
					},
				});
			} else if (currentStep == 1) {
				const formData = new FormData();

				const variantsData = data.step2.variants.map((v) => ({
					id: v?.colorCode,
					color: v?.colorLabel
						? { label: v.colorLabel, code: v.colorCode }
						: undefined,
					size: v?.size
						.split(",")
						.map((s) => s.trim())
						.filter((s) => s), // Split string and trim/filter empty results
					quantity: Number(v.quantity),
					image: Array.isArray(v.image) ? v.image : [],
				}));
				for (const variant of variantsData) {
					for (const [key, value] of Object.entries(variant.color)) {
						formData.append(`color[${key}]`, value);
					}

					variant.size.forEach((size, index) => {
						formData.append(`size[${index}]`, size);
					});
					formData.append("quantity", variant.quantity);

					variant.image.forEach((image) => {
						formData.append("images", image);
					});
				}

				const variantsPayload = {
					productId: productId, // Assuming the product ID is returned from createInitProduct
					data: formData,
				};
				addVariantProduct(variantsPayload, {
					onSuccess: () => {
						toast.success("Variantes ajoutées avec succès !");
					},
					onError: (error) => {
						console.error("Erreur lors de l'ajout des variantes :", error);
						toast.error("Erreur lors de l'ajout des variantes !");
					},
				});
			}

			toast.success("Initialisation du produit créée avec succès !");
		} catch (error) {
			console.error("Erreur lors de l'initialisation du produit :", error);
			toast.error("Erreur lors de l'initialisation du produit !");
		}
	};

	const stepComponents = () => {
		switch (currentStep) {
			case 0:
				return <FormProductInitCreation control={control} form={form} />;
			case 1:
				return (
					<FormProductAddVariant
						form={form}
						control={control}
						fields={fields}
						append={append}
						remove={remove}
					/>
				);

			default:
				return null;
		}
	};

	const formatOptionLabel = (option) => {
		return `${option.account} - ${option.label}`;
	};

	// const { data: primaryCategories } = useGetPrimaryCategory(); // Not used, removed from JSX and kept here as reference

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{stepComponents()}

				<div className="flex items-center justify-between w-full mt-8 gap-y-8">
					<div className="flex gap-x-4">
						<Button
							type="submit"
							size="lg"
							variant="default"
							className={(cn("py-4 w-fit"), currentStep === 0 && "hidden")}
							onClick={handlePrevious}
						>
							Previous
						</Button>
						{/* <Button
							type="button"
							size="lg"
							variant="default"
							onClick={handleNext}
							className={(cn("py-4 w-fit "), currentStep === 1 && "hidden")}
						>
							Continuer
						</Button> */}
					</div>

					<Button type="submit" className="py-4 w-fit " disabled={isPending}>
						{isPending ? "Création en cours..." : "Créer le produit"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
