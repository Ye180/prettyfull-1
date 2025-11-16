"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useGetPrimaryCategory } from "@/features/shared/api/get-primary-category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
// import { toast } from "sonner";
import { toast } from "sonner";
import { useCreateSiteContent } from "../../api/create-site-content";
import { useGetProducts } from "../../api/get-product";
import { useUpdateSiteContent2 } from "../../api/update-site-content-2";
import { useUpdateSiteContent3 } from "../../api/update-site-content-3";
import { siteContentSchema } from "../../lib/site-content-schema";
import { StepFormOne } from "./step-1-form";
import { StepFormTwo } from "./step-2-form";
import { StepFormThird } from "./step-3-form";

/**
 * 📝 NOTES IMPORTANTES :
 *
 * 1. GESTION DE L'ID :
 *    - Au step 0, on crée le document via POST /site-content/step-1
 *    - On stocke l'ID retourné dans `siteContentId`
 *    - Les steps 1 et 2 utilisent cet ID pour les mises à jour (PATCH)
 *
 * 2. VERROUILLAGE DES ÉTAPES :
 *    - `completedSteps` track les étapes terminées avec succès
 *    - On ne peut avancer que si l'étape courante est complétée
 *    - Les boutons "Précédent" sont désactivés après soumission réussie
 *
 * 3. FLUX DE VALIDATION :
 *    - Validation Zod sur chaque étape avant soumission
 *    - Si validation échoue → affichage des erreurs, pas d'appel API
 *    - Si API échoue → toast d'erreur, reste sur l'étape actuelle
 *    - Si API réussit → passage automatique à l'étape suivante
 *
 * 4. REDIRECTION FINALE :
 *    - Après step 3, redirection vers /site-content
 *    - Toast de succès affiché
 */

export default function SiteContentForm() {
	const router = useRouter();
	const { data: primaryCategories } = useGetPrimaryCategory();

	const { data: products, isLoading: productsLoading } = useGetProducts({
		// paginationParams: {
		page: 1,
		limit: 10,
		// },
	});

	// 🎯 État local : étape courante + ID du contenu créé
	const [step, setStep] = useState(0);
	const [siteContentId, setSiteContentId] = useState(null);

	// 🔒 Track des étapes complétées (pour verrouillage)
	const [completedSteps, setCompletedSteps] = useState([]);

	// 🚀 Mutations API avec gestion des callbacks
	const createMutation = useCreateSiteContent({
		onSuccess: (data) => {
			// toast.success("Étape 1 complétée avec succès!");
			setSiteContentId(data._id); // 💾 Sauvegarde de l'ID
			setCompletedSteps([...completedSteps, 0]);
			setStep(1); // Passage automatique au step 2
		},
		onError: (error) => {
			toast.error(
				error?.response?.data?.message || "Erreur lors de la création"
			);
		},
	});

	const updateStep2Mutation = useUpdateSiteContent2({
		onSuccess: () => {
			// toast.success("Étape 2 complétée avec succès!");
			setCompletedSteps([...completedSteps, 1]);
			setStep(2); // Passage automatique au step 3
		},
		onError: (error) => {
			toast.error(
				error?.response?.data?.message || "Erreur lors de la mise à jour"
			);
		},
	});

	const updateStep3Mutation = useUpdateSiteContent3({
		onSuccess: () => {
			// toast.success("Site Content créé avec succès!");
			setCompletedSteps([...completedSteps, 2]);
			// 🎉 Redirection finale
			setTimeout(() => router.back(), 1500);
		},
		onError: (error) => {
			toast.error(
				error?.response?.data?.message || "Erreur lors de la finalisation"
			);
		},
	});

	const form = useForm({
		resolver: zodResolver(siteContentSchema),
		mode: "onChange",
	});

	const { control, handleSubmit, trigger } = form;

	const {
		fields: fieldSecondSection,
		append: appendSecondField,
		remove: removeSecondField,
	} = useFieldArray({
		control,
		name: "secondSection.category",
	});

	const {
		fields: fieldFourSection,
		append: appendFourField,
		remove: removeFourField,
	} = useFieldArray({
		control,
		name: "fourthSection.products",
	});

	const {
		fields: fieldFiveSection,
		append: appendFiveField,
		remove: removeFiveField,
	} = useFieldArray({
		control,
		name: "fiveSection.subCategory",
	});
	const {
		fields: fieldSevenSection,
		append: appendSevenField,
		remove: removeSevenField,
	} = useFieldArray({
		control,
		name: "sevenSection.products",
	});

	const {
		fields: fieldNineSection,
		append: appendNineField,
		remove: removeNineField,
	} = useFieldArray({
		control,
		name: "nineSection.subCategory",
	});

	const onSubmit = (data) => {
		console.log("Form submitted:", data);
	};

	// Définir les champs à valider par étape
	const stepFields = {
		0: [
			"key",
			"quote",
			"sortOrder",
			"isActive",
			"first",
			"secondSection",
			"thirdSection",
		],
		1: ["fourthSection", "fiveSection", "sixSection"],
		2: ["sevenSection", "eightSection", "nineSection", "tenSection"],
	};

	/**
	 * 🚦 LOGIQUE DE NAVIGATION "SUIVANT"
	 *
	 * 1. Valide les champs de l'étape courante
	 * 2. Si invalide → affiche les erreurs Zod
	 * 3. Si valide → appelle l'API correspondante
	 * 4. L'API callback gère la transition automatique
	 */
	const handleNext = async () => {
		const fieldsToValidate = stepFields[step];
		const isValid = await trigger(fieldsToValidate);

		if (!isValid) {
			toast.error("Veuillez corriger les erreurs avant de continuer");
			return;
		}

		const formData = form.getValues();

		// 📌 STEP 0: Création du document
		if (step === 0) {
			// Préparer les données de base
			const step1Data = {
				key: formData.key || "",
				type: "SECTION", // Type par défaut, ajustable selon besoin
				isActive: formData.isActive ?? true,
				sortOrder:
					formData.sortOrder !== undefined &&
					formData.sortOrder !== null &&
					formData.sortOrder !== ""
						? Number(formData.sortOrder)
						: 0,
				quote: formData.quote,
				first: {
					title: formData.first?.title,
					description: formData.first?.description,
					ctaText: formData.first?.ctaText,
					category: formData.first?.category,
				},
				secondSection: formData.secondSection,
				thirdSection: {
					category: formData.thirdSection?.category,
				},
			};

			// Vérifier s'il y a des fichiers à uploader
			const hasFiles =
				formData.first?.imageUrlDesktop instanceof File ||
				formData.first?.imageUrlMobile instanceof File ||
				formData.first?.video instanceof File ||
				formData.thirdSection?.imageUrlDesktop instanceof File ||
				formData.thirdSection?.imageUrlMobile instanceof File;

			if (hasFiles) {
				// Construire un FormData si des fichiers sont présents
				const formDataToSend = new FormData();

				// Ajouter les valeurs primitives directement (avec validation)
				formDataToSend.append("key", step1Data.key);
				formDataToSend.append("type", step1Data.type);
				formDataToSend.append("isActive", step1Data.isActive.toString());
				formDataToSend.append(
					"sortOrder",
					isNaN(step1Data.sortOrder) ? "0" : step1Data.sortOrder.toString()
				);

				// Ajouter les objets JSON stringifiés
				if (step1Data.quote) {
					formDataToSend.append("quote", JSON.stringify(step1Data.quote));
				}
				if (step1Data.first) {
					formDataToSend.append("first", JSON.stringify(step1Data.first));
				}
				if (step1Data.secondSection) {
					formDataToSend.append(
						"secondSection",
						JSON.stringify(step1Data.secondSection)
					);
				}
				if (step1Data.thirdSection) {
					formDataToSend.append(
						"thirdSection",
						JSON.stringify(step1Data.thirdSection)
					);
				}

				// Ajouter les fichiers avec leurs fieldnames correspondants
				if (formData.first?.imageUrlDesktop instanceof File) {
					formDataToSend.append(
						"first.imageUrlDesktop",
						formData.first.imageUrlDesktop
					);
				}
				if (formData.first?.imageUrlMobile instanceof File) {
					formDataToSend.append(
						"first.imageUrlMobile",
						formData.first.imageUrlMobile
					);
				}
				if (formData.first?.video instanceof File) {
					formDataToSend.append("first.video", formData.first.video);
				}
				if (formData.thirdSection?.imageUrlDesktop instanceof File) {
					formDataToSend.append(
						"thirdSection.imageUrlDesktop",
						formData.thirdSection.imageUrlDesktop
					);
				}
				if (formData.thirdSection?.imageUrlMobile instanceof File) {
					formDataToSend.append(
						"thirdSection.imageUrlMobile",
						formData.thirdSection.imageUrlMobile
					);
				}

				createMutation.mutate(formDataToSend);
			} else {
				// Pas de fichiers, envoi JSON classique
				createMutation.mutate(step1Data);
			}
		}

		// 📌 STEP 1: Mise à jour sections 4-6
		if (step === 1 && siteContentId) {
			const step2Data = {
				fourthSection: {
					title: formData.fourthSection?.title,
					description: formData.fourthSection?.description,
					category: formData.fourthSection?.category,
					products: formData.fourthSection?.products,
				},
				fiveSection: formData.fiveSection,
				sixSection: {
					category: formData.sixSection?.category,
				},
			};

			// Vérifier s'il y a des fichiers à uploader
			const hasFiles =
				formData.fourthSection?.imageUrl instanceof File ||
				formData.sixSection?.imageUrlDesktop instanceof File ||
				formData.sixSection?.imageUrlMobile instanceof File;

			if (hasFiles) {
				// Construire un FormData si des fichiers sont présents
				const formDataToSend = new FormData();

				// Ajouter l'ID
				formDataToSend.append("id", siteContentId);

				// Ajouter les objets JSON stringifiés
				if (step2Data.fourthSection) {
					formDataToSend.append(
						"fourthSection",
						JSON.stringify(step2Data.fourthSection)
					);
				}
				if (step2Data.fiveSection) {
					formDataToSend.append(
						"fiveSection",
						JSON.stringify(step2Data.fiveSection)
					);
				}
				if (step2Data.sixSection) {
					formDataToSend.append(
						"sixSection",
						JSON.stringify(step2Data.sixSection)
					);
				}

				// Ajouter les fichiers
				if (formData.fourthSection?.imageUrl instanceof File) {
					formDataToSend.append(
						"fourthSection.imageUrl",
						formData.fourthSection.imageUrl
					);
				}
				if (formData.sixSection?.imageUrlDesktop instanceof File) {
					formDataToSend.append(
						"sixSection.imageUrlDesktop",
						formData.sixSection.imageUrlDesktop
					);
				}
				if (formData.sixSection?.imageUrlMobile instanceof File) {
					formDataToSend.append(
						"sixSection.imageUrlMobile",
						formData.sixSection.imageUrlMobile
					);
				}

				updateStep2Mutation.mutate(formDataToSend);
			} else {
				// Pas de fichiers, envoi JSON classique
				updateStep2Mutation.mutate({ id: siteContentId, ...step2Data });
			}
		}
	};

	/**
	 * 🔙 LOGIQUE "PRÉCÉDENT"
	 *
	 * - Désactivé si step = 0
	 * - Désactivé si l'étape actuelle est déjà complétée (évite modifications)
	 */
	const handlePrevious = () => {
		if (step > 0 && !completedSteps.includes(step - 1)) {
			setStep((prev) => prev - 1);
		}
	};

	/**
	 * 📤 SOUMISSION FINALE (Step 3)
	 */
	const handleFinalSubmit = async (data) => {
		const fieldsToValidate = stepFields[2];
		const isValid = await trigger(fieldsToValidate);

		if (!isValid) {
			toast.error("Veuillez corriger les erreurs avant de finaliser");
			return;
		}

		if (!siteContentId) {
			toast.error("ID du contenu introuvable. Veuillez recommencer.");
			return;
		}

		const step3Data = {
			sevenSection: data.sevenSection,
			eightSection: {
				category: data.eightSection?.category,
			},
			nineSection: data.nineSection,
			tenSection: {
				category: data.tenSection?.category,
			},
		};

		// Vérifier s'il y a des fichiers à uploader
		const hasFiles =
			data.eightSection?.imageUrlDesktop instanceof File ||
			data.eightSection?.imageUrlMobile instanceof File ||
			data.tenSection?.imageUrlDesktop instanceof File ||
			data.tenSection?.imageUrlMobile instanceof File;

		if (hasFiles) {
			// Construire un FormData si des fichiers sont présents
			const formDataToSend = new FormData();

			// Ajouter l'ID
			formDataToSend.append("id", siteContentId);

			// Ajouter les objets JSON stringifiés
			if (step3Data.sevenSection) {
				formDataToSend.append(
					"sevenSection",
					JSON.stringify(step3Data.sevenSection)
				);
			}
			if (step3Data.eightSection) {
				formDataToSend.append(
					"eightSection",
					JSON.stringify(step3Data.eightSection)
				);
			}
			if (step3Data.nineSection) {
				formDataToSend.append(
					"nineSection",
					JSON.stringify(step3Data.nineSection)
				);
			}
			if (step3Data.tenSection) {
				formDataToSend.append(
					"tenSection",
					JSON.stringify(step3Data.tenSection)
				);
			}

			// Ajouter les fichiers
			if (data.eightSection?.imageUrlDesktop instanceof File) {
				formDataToSend.append(
					"eightSection.imageUrlDesktop",
					data.eightSection.imageUrlDesktop
				);
			}
			if (data.eightSection?.imageUrlMobile instanceof File) {
				formDataToSend.append(
					"eightSection.imageUrlMobile",
					data.eightSection.imageUrlMobile
				);
			}
			if (data.tenSection?.imageUrlDesktop instanceof File) {
				formDataToSend.append(
					"tenSection.imageUrlDesktop",
					data.tenSection.imageUrlDesktop
				);
			}
			if (data.tenSection?.imageUrlMobile instanceof File) {
				formDataToSend.append(
					"tenSection.imageUrlMobile",
					data.tenSection.imageUrlMobile
				);
			}

			updateStep3Mutation.mutate(formDataToSend);
		} else {
			// Pas de fichiers, envoi JSON classique
			updateStep3Mutation.mutate({ id: siteContentId, ...step3Data });
		}
	};

	// 🔄 Loading states
	const isLoading =
		createMutation.isPending ||
		updateStep2Mutation.isPending ||
		updateStep3Mutation.isPending;

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(handleFinalSubmit)}
				className="w-full p-6 mx-auto space-y-8"
			>
				{/* Stepper Indicator */}
				<div className="flex items-center justify-center mb-8">
					<div className="flex items-center gap-4">
						{[1, 2, 3].map((stepNumber) => (
							<div key={stepNumber} className="flex items-center">
								<div
									className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all ${
										step + 1 === stepNumber
											? "bg-black text-white border-black"
											: completedSteps.includes(stepNumber - 1)
												? "bg-green-500 text-white border-green-500"
												: "bg-gray-200 text-gray-600 border-gray-300"
									}`}
								>
									{completedSteps.includes(stepNumber - 1) ? "✓" : stepNumber}
								</div>
								{stepNumber < 3 && (
									<div
										className={`w-16 h-1 mx-2 transition-all ${
											completedSteps.includes(stepNumber - 1)
												? "bg-green-500"
												: "bg-gray-300"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>

				{/* 📊 Indicateur de progression */}
				{siteContentId && (
					<div className="p-4 mb-4 text-sm border border-blue-200 rounded-lg bg-blue-50">
						<p className="font-medium text-blue-900">
							✅ Document créé :{" "}
							<code className="px-2 py-1 bg-blue-100 rounded">
								{siteContentId}
							</code>
						</p>
						<p className="mt-1 text-blue-700">
							Étape {step + 1} sur 3 • {completedSteps.length} étape(s)
							complétée(s)
						</p>
					</div>
				)}

				{/* Step 1: Informations générales + Sections 1-3 */}
				{step === 0 && (
					<>
						<StepFormOne
							control={control}
							form={form}
							primaryCategories={primaryCategories}
							fieldSecondSection={fieldSecondSection}
							appendSecondField={appendSecondField}
							removeSecondField={removeSecondField}
							disabled={completedSteps.includes(0)} // 🔒 Verrouillage
						/>
					</>
				)}

				{/* Step 2: Sections 4, 5 et 6 */}
				{step === 1 && (
					<>
						<StepFormTwo
							primaryCategories={primaryCategories}
							products={products?.products}
							control={control}
							form={form}
							fieldFourSection={fieldFourSection}
							appendFourField={appendFourField}
							removeFourField={removeFourField}
							fieldFiveSection={fieldFiveSection}
							appendFiveField={appendFiveField}
							removeFiveField={removeFiveField}
							disabled={completedSteps.includes(1)} // 🔒 Verrouillage
						/>
					</>
				)}

				{/* Step 3: Sections 7, 8, 9 et 10 */}
				{step === 2 && (
					<>
						<StepFormThird
							primaryCategories={primaryCategories}
							products={products?.products}
							control={control}
							form={form}
							fieldSevenSection={fieldSevenSection}
							appendSevenField={appendSevenField}
							removeSevenField={removeSevenField}
							fieldNineSection={fieldNineSection}
							removeNineField={removeNineField}
							appendNineField={appendNineField}
							disabled={completedSteps.includes(2)} // 🔒 Verrouillage
						/>
					</>
				)}

				{/* Navigation Buttons */}
				<CardFooter className="justify-between">
					<Button
						type="button"
						variant="outline"
						onClick={handlePrevious}
						disabled={
							step === 0 || completedSteps.includes(step - 1) || isLoading
						}
					>
						Précédent
					</Button>

					{step < 2 ? (
						<Button
							type="button"
							onClick={handleNext}
							disabled={isLoading || completedSteps.includes(step)}
						>
							{isLoading ? (
								<>
									<span className="mr-2">⏳</span>
									Enregistrement...
								</>
							) : (
								"Suivant"
							)}
						</Button>
					) : (
						<Button
							type="submit"
							className="px-8 py-4 font-medium"
							disabled={isLoading || completedSteps.includes(2)}
						>
							{isLoading ? (
								<>
									<span className="mr-2">⏳</span>
									Finalisation...
								</>
							) : (
								"Enregistrer le contenu"
							)}
						</Button>
					)}
				</CardFooter>
			</form>
		</Form>
	);
}
