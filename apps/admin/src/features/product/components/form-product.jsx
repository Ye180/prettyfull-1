"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAddVariants } from "../api/add-variants-products";
import { useCreateInit } from "../api/create-init-products";
import { useCreate } from "../api/create-products";
import FormProductAddVariant from "./form-add-variant";
import FormProductInitCreation from "./form-product-init-creation";
import ProductStepper from "./product-stepper";
// Define PRODUCTS_QUERY_KEY (assuming it's defined elsewhere, e.g., 'products')
const PRODUCTS_QUERY_KEY = "products";
// Assuming toast is defined globally or imported
const toast = {
	success: (message) => console.log(`SUCCESS: ${message}`),
	error: (message) => console.error(`ERROR: ${message}`),
};

export default function ProductForm() {
	const router = useRouter();
	const { mutate: createProduct, isPending } = useCreate();
	const { mutate: createInitProduct, isPending: isInitPending } =
		useCreateInit();

	const { mutate: addVariantProduct, isPending: isAddVariantPending } =
		useAddVariants();

	const queryClient = useQueryClient();

	const [currentStep, setCurrentStep] = useState(0);
	const [productId, setProductId] = useState(null);
	const [isStep1Completed, setIsStep1Completed] = useState(false);

	const form = useForm({
		mode: "onChange",
		// Réinitialiser le formulaire lors du changement d'étape
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
				currencyFr: "XOF",
				currencyEn: "USD",

				solde: false,
				reducedPrice: 0,
				pourcentage: 0,
				labelFr: "",
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
						colorLabel: "",
						colorCode: "#FFFFFF",
						size: "",
						quantity: 0,
						image: [],
					},
				],
			},
		},
	});

	const { control, handleSubmit, trigger, getValues, formState } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "step2.variants",
	});

	// Valider et passer à l'étape suivante
	const handleNext = async (e) => {
		e.preventDefault();
		if (currentStep === 0) {
			// Déclenche la validation de tous les champs step1
			const isValid = await trigger([
				"step1.nameFr",
				"step1.nameEn",
				"step1.descriptionFr",
				"step1.descriptionEn",
				"step1.smallDescriptionFr",
				"step1.smallDescriptionEn",
				"step1.categoryId",
				"step1.link",
				"step1.sku",
				"step1.slug",
				"step1.priceAmountFr",
				"step1.priceAmountEn",
				"step1.currencyFr",
				"step1.currencyEn",
				"step1.stock",
				"step1.seoTitleFr",
				"step1.seoTitleEn",
				"step1.seoDescFr",
				"step1.seoDescEn",
			]);
			// Si en solde, valider aussi les champs promotion
			if (getValues("step1.solde")) {
				const promoValid = await trigger([
					"step1.reducedPrice",
					"step1.pourcentage",
				]);
				if (!promoValid) {
					toast.error("Veuillez corriger les erreurs de promotion");
					return;
				}
			}
			if (!isValid) {
				toast.error(
					"Veuillez remplir tous les champs obligatoires avant de continuer"
				);
				return;
			}
			await submitStep1(getValues("step1"));
		}
	};

	const handlePrevious = (e) => {
		e.preventDefault();
		// Ne pas permettre de revenir en arrière si le produit a déjà été créé
		if (productId) {
			toast.error(
				"Vous ne pouvez plus modifier l'étape 1 après la création du produit"
			);
			return;
		}
		setCurrentStep(0);
	};

	// Soumettre step1 et créer le produit initial
	const submitStep1 = async (step1Data) => {
		const dataSend = {
			name: {
				fr: step1Data.nameFr,
				en: step1Data.nameEn,
			},
			description: {
				fr: step1Data.descriptionFr,
				en: step1Data.descriptionEn,
			},
			smallDescription: {
				fr: step1Data.smallDescriptionFr,
				en: step1Data.smallDescriptionEn,
			},
			categoryId: step1Data.categoryId,
			link: step1Data.link,
			sku: step1Data.sku,
			slug: step1Data.slug,
			price: {
				amount: {
					fr: Number(step1Data.priceAmountFr),
					en: Number(step1Data.priceAmountEn),
				},
				currency: {
					fr: step1Data.currencyFr,
					en: step1Data.currencyEn,
				},
			},
			solde: step1Data.solde,
			promotion: step1Data.solde
				? {
						reduced_price: {
							fr: Number(step1Data.reducedPrice),
							en: Number(step1Data.reducedPrice),
						},
						pourcentage: Number(step1Data.pourcentage),
					}
				: undefined,
			label: {
				fr: step1Data.labelFr,
				en: step1Data.labelEn,
			},
			isActive: step1Data.isActive,
			isFeatured: step1Data.isFeatured,
			stock: Number(step1Data.stock),
			seoMeta: {
				title: {
					fr: step1Data.seoTitleFr,
					en: step1Data.seoTitleEn,
				},
				description: {
					fr: step1Data.seoDescFr,
					en: step1Data.seoDescEn,
				},
				keywords: step1Data.seoKeywords
					? step1Data.seoKeywords
							.split(",")
							.map((k) => k.trim())
							.filter((k) => k)
					: [],
			},
		};

		createInitProduct(dataSend, {
			onSuccess: async (response) => {
				await queryClient.invalidateQueries({
					queryKey: [PRODUCTS_QUERY_KEY],
				});

				setProductId(response._id);
				setIsStep1Completed(true);
				setCurrentStep(1);
				toast.success(
					"Produit créé avec succès ! Ajoutez maintenant les variantes"
				);
			},
			onError: (error) => {
				console.error(
					"Erreur lors de la création de l'initialisation du produit :",
					error
				);
				toast.error("Erreur lors de la création du produit !");
			},
		});
	};

	// Soumettre step2 et créer les variantes
	const onSubmit = async (data) => {
		if (currentStep === 0) {
			// Si on est à l'étape 1, appeler handleNext qui gère la validation
			await handleNext(new Event("submit"));
			return;
		}

		if (currentStep === 1) {
			// Vérifier qu'on a un productId
			if (!productId) {
				toast.error("Erreur : Aucun produit créé. Veuillez recommencer.");
				return;
			}

			const step2Data = getValues("step2");

			// Valider step2 manuellement avec Zod
			const { productStep2Schema } = await import("../schema/product-schema");
			const validation = productStep2Schema.safeParse(step2Data);

			if (!validation.success) {
				const errors = validation.error?.errors || [];
				console.log("Erreurs de validation step2:", errors);

				if (errors.length) {
					errors.forEach((error) => {
						const fieldPath = `step2.${error.path.join(".")}`;
						form.setError(fieldPath, {
							type: "manual",
							message: error.message,
						});
					});
				}

				toast.error("Veuillez corriger les erreurs dans les variantes");
				return;
			}

			// Vérifier les doublons manuellement aussi
			const colorCodes = step2Data.variants.map((v) =>
				v.colorCode.toLowerCase()
			);
			const uniqueColorCodes = new Set(colorCodes);
			if (colorCodes.length !== uniqueColorCodes.size) {
				toast.error(
					"Vous ne pouvez pas créer deux variantes avec la même couleur"
				);
				return;
			}

			// Vérifier qu'on a au moins une variante
			if (!step2Data.variants || step2Data.variants.length === 0) {
				toast.error("Vous devez créer au moins une variante");
				return;
			}

			// 1) Construire le tableau variants conforme au DTO backend
			const variantsArray = (step2Data.variants || []).map((v, idx) => {
				const sizes = (v?.size || "")
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
				return {
					// id est optionnel côté DTO, on peut l'omettre
					color:
						v?.colorLabel && v?.colorCode
							? { label: v.colorLabel, code: v.colorCode }
							: undefined,
					size: sizes,
					quantity: Number(v?.quantity ?? 0),
					// Ajout d'un champ pour lier les fichiers envoyés à cette variante
					imageField: `images_${idx}`,
				};
			});

			// 2) Rassembler et ajouter les fichiers par variant dans le FormData
			const formData = new FormData();
			formData.append("variants", JSON.stringify(variantsArray));

			(step2Data.variants || []).forEach((v, idx) => {
				const fieldName = `images_${idx}`;

				// Gérer FileList ou Array de Files
				let files = [];
				if (v?.image) {
					if (v.image instanceof FileList) {
						files = Array.from(v.image);
					} else if (Array.isArray(v.image)) {
						files = v.image;
					} else {
						files = [v.image];
					}
				}

				// Ajouter chaque fichier sous le bon fieldname
				files.forEach((file) => {
					if (file instanceof File) {
						formData.append(fieldName, file);
					}
				});
			});

			// Debug: Log FormData entries
			console.log("FormData entries:");
			for (let pair of formData.entries()) {
				console.log(pair[0], pair[1]);
			}

			const variantsPayload = {
				productId,
				data: formData,
			};

			addVariantProduct(variantsPayload, {
				onSuccess: async () => {
					await queryClient.invalidateQueries({
						queryKey: [PRODUCTS_QUERY_KEY],
					});
					toast.success("Produit créé avec succès avec toutes ses variantes !");
					// Redirection automatique vers la liste des produits
					router.push("/product-list");
				},
				onError: (error) => {
					console.error("Erreur lors de l'ajout des variantes :", error);
					toast.error("Erreur lors de l'ajout des variantes !");
				},
			});
		}
	};

	const stepComponents = () => {
		switch (currentStep) {
			case 0:
				return (
					<FormProductInitCreation
						control={control}
						form={form}
						isDisabled={isStep1Completed}
					/>
				);
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

	return (
		<div className="w-full p-6 mx-auto">
			<ProductStepper
				currentStep={currentStep}
				isStep1Completed={isStep1Completed}
			/>

			<Form {...form}>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
					{stepComponents()}

					<div className="flex items-center justify-between w-full pt-6 mt-8 border-t gap-y-8">
						<div className="flex gap-x-4">
							{currentStep === 1 && (
								<Button
									type="button"
									size="lg"
									variant="outline"
									onClick={handlePrevious}
									disabled={productId !== null}
									className="py-4 w-fit"
								>
									Retour
								</Button>
							)}
						</div>

						<div className="flex gap-x-4">
							{currentStep === 0 ? (
								<Button
									type="button"
									size="lg"
									variant="default"
									onClick={handleNext}
									disabled={isInitPending || isStep1Completed}
									className="py-4 w-fit"
								>
									{isInitPending
										? "Création en cours..."
										: isStep1Completed
											? "Produit créé ✓"
											: "Créer le produit et continuer"}
								</Button>
							) : (
								<Button
									type="submit"
									size="lg"
									variant="default"
									disabled={isAddVariantPending || !productId}
									className="py-4 w-fit"
								>
									{isAddVariantPending
										? "Ajout en cours..."
										: "Ajouter les variantes"}
								</Button>
							)}
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
