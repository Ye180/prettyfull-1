"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetPrimaryCategory } from "@/features/shared/api/get-primary-category";
import { SelectScrollable } from "@/shared/component/select-within-search";
import { Minus, PlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

// ✅ 1. Validation Schema (Zod)
const siteContentSchema = z.object({
	key: z.string().min(1, "La clé est obligatoire"),
	type: z.enum(["PAGE", "SECTION"]),
	isActive: z.boolean().default(true),
	sortOrder: z.number().min(0).default(0),
	publishedAt: z.string().optional(),
	expiresAt: z.string().optional(),

	content: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		description: z.string().optional(),
		imageUrl: z.string().url().optional(),
		imageAlt: z.string().optional(),
		ctaText: z.string().optional(),
		ctaLink: z.string().optional(),
		items: z
			.array(
				z.object({
					title: z.string().optional(),
					description: z.string().optional(),
					imageUrl: z.string().optional(),
					link: z.string().optional(),
				})
			)
			.optional(),
	}),
});

// type SiteContentFormValues = z.infer<typeof siteContentSchema>;

// ✅ 2. Le formulaire principal
export default function SiteContentForm() {
	const form = useForm({
		defaultValues: {
			key: "",
			type: "PAGE",
			sortOrder: 0,
			quote: {
				en: "",
				fr: "",
			},
			isActive: true,
			first: {
				title: { fr: "", en: "" },
				description: { fr: "", en: "" },
				imageUrlDesktop: "",
				imageUrlMobile: "",
				video: "",
				ctaText: { fr: "", en: "" },
				category: "",
			},
			secondSection: {
				title: { fr: "", en: "" },
				category: ["default"],
				ctaText: { fr: "", en: "" },
				parentCategory: "",
			},
			thirdSection: {
				imageUrlDesktop: "",
				imageUrlMobile: "",
				category: "",
			},
			fourthSection: {
				title: { fr: "", en: "" },
				description: { fr: "", en: "" },
				imageUrl: "",
				category: "",
				products: [""],
			},
			fiveSection: {
				title: { fr: "", en: "" },
				category: "",
				ctaText: { fr: "", en: "" },
				subCategory: [""],
			},
			sixSection: {
				imageUrlDesktop: "",
				imageUrlMobile: "",
				category: "",
			},
			sevenSection: {
				title: { fr: "", en: "" },
				ctaText: { fr: "", en: "" },
				subCategory: "",
				products: [""],
			},
			eightSection: {
				imageUrlDesktop: "",
				imageUrlMobile: "",
				category: "",
			},
			nineSection: {
				title: { fr: "", en: "" },
				ctaText: { fr: "", en: "" },
				subCategory: [""],
			},
			ten: {
				imageUrlDesktop: "",
				imageUrlMobile: "",
				category: "",
			},
		},
	});

	const { control, handleSubmit } = form;
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

	const { data: primaryCategories } = useGetPrimaryCategory();

	const onSubmit = (data) => {
		console.log("Form submitted:", data);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full p-6 mx-auto space-y-8"
			>
				<Card className="border border-gray-200 shadow-md">
					<CardHeader>
						<CardTitle>Informations générales</CardTitle>
						<CardDescription>
							Configure la clé, le type et les métadonnées de ton contenu.
						</CardDescription>
					</CardHeader>

					<CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<SelectScrollable
							control={form.control}
							nameId="key"
							label="Catégorie"
							placeholder="Sélectionner une catégorie"
							data={primaryCategories || []}
						/>

						<FormField
							control={control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type de contenu</FormLabel>
									<FormControl>
										<select
											{...field}
											className="w-full px-3 py-2 border rounded-md"
										>
											<option value="PAGE">PAGE</option>
											<option value="SECTION">SECTION</option>
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="quote.fr"
							render={({ field }) => (
								<FormItem className="flex flex-col space-y-2">
									<FormLabel>Citation (fr)</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Citation (fr)..."
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="quote.en"
							render={({ field }) => (
								<FormItem className="flex flex-col space-y-2">
									<FormLabel>Citation (en)</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Citation (en)..."
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="sortOrder"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ordre d’affichage</FormLabel>
									<FormControl>
										<Input type="number" min={0} {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex flex-col space-y-2">
									<FormLabel>Actif</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>
				{/* Section Content */}

				<Card className="w-full border-gray-200 shadow-md ">
					<CardHeader>
						<CardTitle>Premiere section</CardTitle>
						<CardDescription>
							Définis le texte, les images et les CTA de cette section.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4 ">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<FormField
								control={control}
								name="first.title.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Titre (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Titre principal..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="first.title.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title (EN)</FormLabel>
										<FormControl>
											<Input placeholder="Main title..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="first.description.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description (FR)</FormLabel>
										<FormControl>
											<Textarea placeholder="Décris ta section..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="first.description.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description (EN)</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe your section..."
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<Separator />

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={control}
								name="first.imageUrlDesktop"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Image (URL-Desktop)</FormLabel>
										<FormControl>
											<Input placeholder="https://..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="first.imageUrlMobile"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Image (URL-Mobile) </FormLabel>
										<FormControl>
											<Input placeholder="https://..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={control}
								name="first.video"
								render={({ field }) => (
									<FormItem className="col-span-1 md:col-span-2">
										<FormLabel>Video (facultatif)</FormLabel>
										<FormControl>
											<Input placeholder="https://..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="first.ctaText.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Texte du bouton (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Ex: Voir la collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="first.ctaText.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Button text (EN)</FormLabel>
										<FormControl>
											<Input placeholder="E.g. View collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<SelectScrollable
							control={form.control}
							nameId="first.category"
							label="Catégorie"
							placeholder="Sélectionner une catégorie"
							data={primaryCategories || []}
						/>
					</CardContent>
				</Card>

				<div className="flex justify-center max-md:flex-col gap-x-4 gap-y-8">
					<Card className="w-full border border-gray-200 shadow-md md:w-1/2">
						<CardHeader>
							<CardTitle>Deuxième section</CardTitle>
							<CardDescription>
								Liste de sous-blocs liés à cette section (ex: produits,
								catégories…)
							</CardDescription>
						</CardHeader>
						<CardContent className={"space-y-6"}>
							<FormField
								control={control}
								name="secondSection.title.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Titre (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Titre principal..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="secondSection.title.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title (EN)</FormLabel>
										<FormControl>
											<Input placeholder="Main title..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							{fieldSecondSection.map((field, index) => (
								<div key={index}>
									<div className="flex items-center justify-between mb-2">
										<FormLabel>Sous Catégorie {index + 1}</FormLabel>
										<button
											type="button"
											className="h-4  bg-red-600 w-4 rounded-full! flex justify-center items-center text-white"
											onClick={() => removeSecondField(index)}
										>
											<Minus className="size-6!" />
										</button>
									</div>
									<SelectScrollable
										key={index}
										control={form.control}
										nameId={`secondSection.category.${index}`}
										placeholder="Sélectionner une catégorie"
										data={primaryCategories || []}
									/>
								</div>
							))}
							<div className="flex items-end justify-start h-fit">
								{/* <p>Sous Catégorie"</p> */}
								<button
									type="button"
									className="h-8 w-fit"
									onClick={() =>
										appendSecondField({ "secondSection.category": "" })
									}
								>
									<PlusIcon className="inline-block p-1 mb-2 mr-2 text-white bg-black size-6 rounded-2xl" />
								</button>
							</div>
							{/* <SelectScrollable
								control={form.control}
								nameId="secondSection.category"
								label="Sous Catégorie"
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/> */}

							{/* Add a append */}
							<Separator />
							<FormField
								control={control}
								name="secondSection.ctaText.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Texte du bouton (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Ex: Voir la collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="secondSection.ctaText.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Button text (EN)</FormLabel>
										<FormControl>
											<Input placeholder="E.g. View collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<SelectScrollable
								control={form.control}
								nameId="secondSection.category"
								label="Catégorie Mère"
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/>
						</CardContent>
					</Card>

					<Card className="w-full border border-gray-200 shadow-md md:w-1/2">
						<CardHeader>
							<CardTitle>Troisième section</CardTitle>
							<CardDescription>
								Liste de sous-blocs liés à cette section (ex: catégories,
								images…)
							</CardDescription>
						</CardHeader>
						<CardContent className={"space-y-6"}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={control}
									name="thirdSection.imageUrlDesktop"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Image (URL-Desktop)</FormLabel>
											<FormControl>
												<Input placeholder="https://..." {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name="thirdSection.imageUrlMobile"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Image (URL-Mobile)</FormLabel>
											<FormControl>
												<Input placeholder="https://..." {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<SelectScrollable
								control={form.control}
								nameId={`thirdSection.category`}
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/>
						</CardContent>
					</Card>
				</div>

				<Card className="border border-gray-200 shadow-md">
					<CardHeader>
						<CardTitle>Quatrieme section</CardTitle>
						<CardDescription>
							Liste de sous-blocs liés à cette section (ex: produits,
							catégories…)
						</CardDescription>
					</CardHeader>
					<CardContent className={"space-y-6"}>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={control}
								name="fourthSection.title.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Titre (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Titre principal..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="fourthSection.title.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title (EN)</FormLabel>
										<FormControl>
											<Input placeholder="Main title..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="fourthSection.description.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Sous-titre (FR)</FormLabel>
										<FormControl>
											<Input
												placeholder="Sous-titre facultatif..."
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="fourthSection.description.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Subtitle (EN)</FormLabel>
										<FormControl>
											<Input placeholder="Optional subtitle..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="fourthSection.imageUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Image</FormLabel>
										<FormControl>
											<Input placeholder="Image..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<SelectScrollable
								control={form.control}
								nameId={"fourthSection.category"}
								label="Catégorie Mère"
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/>
						</div>
						<Separator />
						{fieldFourSection.map((item, index) => (
							<div key={index}>
								<div className="flex items-center justify-between mb-2">
									<FormLabel>Produit {index + 1}</FormLabel>
									<button
										type="button"
										className="h-4  bg-red-600 w-4 rounded-full! flex justify-center items-center text-white"
										onClick={() => removeFourField(index)}
									>
										<Minus className="size-6!" />
									</button>
								</div>
								<SelectScrollable
									key={index}
									control={form.control}
									nameId={`fourthSection.products.${index}`}
									placeholder="Sélectionner une produit"
									data={primaryCategories || []}
								/>
							</div>
						))}
						<div className="flex items-end justify-start h-fit">
							{/* <p>Sous Catégorie"</p> */}
							<button
								type="button"
								className="h-8 w-fit"
								onClick={() =>
									appendFourField({ "fourthSection.products": "" })
								}
							>
								<PlusIcon className="inline-block p-1 mb-2 mr-2 text-white bg-black size-6 rounded-2xl" />
							</button>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-center max-md:flex-col gap-x-4 gap-y-8">
					<Card className="w-full border border-gray-200 shadow-md md:w-1/2">
						<CardHeader>
							<CardTitle>Cinquieme section</CardTitle>
							<CardDescription>
								Liste de sous-blocs liés à cette section (ex: catégories…)
							</CardDescription>
						</CardHeader>
						<CardContent className={"space-y-6"}>
							<FormField
								control={control}
								name="fiveSection.title.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Titre (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Titre principal..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="fiveSection.title.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title (EN)</FormLabel>
										<FormControl>
											<Input placeholder="Main title..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<SelectScrollable
								control={form.control}
								nameId={"fiveSection.category"}
								label="Catégorie Mère"
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/>
							<FormField
								control={control}
								name="fiveSection.ctaText.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Texte du bouton (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Ex: Voir la collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="fiveSection.ctaText.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Button text (EN)</FormLabel>
										<FormControl>
											<Input placeholder="E.g. View collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<Separator />

							{fieldFiveSection.map((item, index) => (
								<div key={index}>
									<div className="flex items-center justify-between mb-2">
										<FormLabel>Sous Categories {index + 1}</FormLabel>
										<button
											type="button"
											className="h-4  bg-red-600 w-4 rounded-full! flex justify-center items-center text-white"
											onClick={() => removeFiveField(index)}
										>
											<Minus className="size-6!" />
										</button>
									</div>
									<SelectScrollable
										key={index}
										control={form.control}
										nameId={`fiveSection.subCategory.${index}`}
										placeholder="Sélectionner une categorie"
										data={primaryCategories || []}
									/>
								</div>
							))}
							<div className="flex items-end justify-start h-fit">
								{/* <p>Sous Catégorie"</p> */}
								<button
									type="button"
									className="h-8 w-fit"
									onClick={() =>
										appendFiveField({ "fiveSection.subCategory": "" })
									}
								>
									<PlusIcon className="inline-block p-1 mb-2 mr-2 text-white bg-black size-6 rounded-2xl" />
								</button>
							</div>
						</CardContent>
					</Card>

					<Card className="w-full border border-gray-200 shadow-md md:w-1/2">
						<CardHeader>
							<CardTitle>Sixieme section</CardTitle>
							<CardDescription>
								Liste de sous-blocs liés à cette section (ex: catégories,
								images…)
							</CardDescription>
						</CardHeader>
						<CardContent className={"space-y-6"}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={control}
									name="sixSection.imageUrlDesktop"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Image (URL-Desktop)</FormLabel>
											<FormControl>
												<Input placeholder="https://..." {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name="sixSection.imageUrlMobile"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Image (URL-Mobile)</FormLabel>
											<FormControl>
												<Input placeholder="https://..." {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<SelectScrollable
								control={form.control}
								nameId={"sixSection.category"}
								label="Catégorie Mère"
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/>
						</CardContent>
					</Card>
				</div>

				<div className="flex justify-center max-md:flex-col gap-x-4 gap-y-8">
					<Card className="w-full border border-gray-200 shadow-md md:w-1/2">
						<CardHeader>
							<CardTitle>Septieme section</CardTitle>
							<CardDescription>
								Liste de sous-blocs liés à cette section (ex: produits,
								catégories…)
							</CardDescription>
						</CardHeader>
						<CardContent className={"space-y-6"}>
							<FormField
								control={control}
								name="sevenSection.title.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Titre (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Titre principal..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="sevenSection.title.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title (EN)</FormLabel>
										<FormControl>
											<Input placeholder="Main title..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="sevenSection.ctaText.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Texte du bouton (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Ex: Voir la collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="sevenSection.ctaText.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Button text (EN)</FormLabel>
										<FormControl>
											<Input placeholder="E.g. View collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<SelectScrollable
								control={form.control}
								nameId={"sevenSection.subCategory"}
								label="Catégorie Mère"
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/>
							<Separator />
							{fieldSevenSection.map((item, index) => (
								<div key={index}>
									<div className="flex items-center justify-between mb-2">
										<FormLabel>Produit {index + 1}</FormLabel>
										<button
											type="button"
											className="h-4  bg-red-600 w-4 rounded-full! flex justify-center items-center text-white"
											onClick={() => removeSevenField(index)}
										>
											<Minus className="size-6!" />
										</button>
									</div>
									<SelectScrollable
										key={index}
										control={form.control}
										nameId={`sevenSection.products.${index}`}
										placeholder="Sélectionner une produit"
										data={primaryCategories || []}
									/>
								</div>
							))}
							<div className="flex items-end justify-start h-fit">
								{/* <p>Sous Catégorie"</p> */}
								<button
									type="button"
									className="h-8 w-fit"
									onClick={() =>
										appendSevenField({ "sevenSection.products": "" })
									}
								>
									<PlusIcon className="inline-block p-1 mb-2 mr-2 text-white bg-black size-6 rounded-2xl" />
								</button>
							</div>
						</CardContent>
					</Card>

					<Card className="w-full border border-gray-200 shadow-md md:w-1/2">
						<CardHeader>
							<CardTitle>Huitieme section</CardTitle>
							<CardDescription>
								Liste de sous-blocs liés à cette section (ex: catégories…)
							</CardDescription>
						</CardHeader>
						<CardContent className={"space-y-6"}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={control}
									name="eightSection.imageUrlDesktop"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Image (URL-Desktop)</FormLabel>
											<FormControl>
												<Input placeholder="https://..." {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name="eightSection.imageUrlMobile"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Image (URL-Mobile)</FormLabel>
											<FormControl>
												<Input placeholder="https://..." {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<SelectScrollable
								control={form.control}
								nameId={"eightSection.category"}
								label="Catégorie Mère"
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/>
						</CardContent>
					</Card>
				</div>
				<div className="flex justify-center max-md:flex-col gap-x-4 gap-y-8">
					<Card className="w-full border border-gray-200 shadow-md md:w-1/2">
						<CardHeader>
							<CardTitle>Neuvième section</CardTitle>
							<CardDescription>
								Liste de sous-blocs liés à cette section (ex: produits,
								catégories…)
							</CardDescription>
						</CardHeader>
						<CardContent className={"space-y-6"}>
							<FormField
								control={control}
								name="nineSection.title.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Titre (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Titre principal..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="nineSection.title.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title (EN)</FormLabel>
										<FormControl>
											<Input placeholder="Main title..." {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={control}
								name="nineSection.ctaText.fr"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Texte du bouton (FR)</FormLabel>
										<FormControl>
											<Input placeholder="Ex: Voir la collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="nineSection.ctaText.en"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Button text (EN)</FormLabel>
										<FormControl>
											<Input placeholder="E.g. View collection" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>

							<SelectScrollable
								control={form.control}
								nameId={"nineSection.category"}
								label="Catégorie Mère"
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/>
							<Separator />

							{fieldNineSection.map((item, index) => (
								<div key={index}>
									<div className="flex items-center justify-between mb-2">
										<FormLabel>Sous Categories {index + 1}</FormLabel>
										<button
											type="button"
											className="h-4  bg-red-600 w-4 rounded-full! flex justify-center items-center text-white"
											onClick={() => removeNineField(index)}
										>
											<Minus className="size-6!" />
										</button>
									</div>
									<SelectScrollable
										key={index}
										control={form.control}
										nameId={`nineSection.subCategory.${index}`}
										placeholder="Sélectionner une sous catégorie"
										data={primaryCategories || []}
									/>
								</div>
							))}
							<div className="flex items-end justify-start h-fit">
								{/* <p>Sous Catégorie"</p> */}
								<button
									type="button"
									className="h-8 w-fit"
									onClick={() =>
										appendNineField({ "nineSection.subCategory": "" })
									}
								>
									<PlusIcon className="inline-block p-1 mb-2 mr-2 text-white bg-black size-6 rounded-2xl" />
								</button>
							</div>
						</CardContent>
					</Card>

					<Card className="w-full border border-gray-200 shadow-md md:w-1/2">
						<CardHeader>
							<CardTitle>Dixieme section</CardTitle>
							<CardDescription>
								Liste de sous-blocs liés à cette section (ex: catégories…)
							</CardDescription>
						</CardHeader>
						<CardContent className={"space-y-6"}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={control}
									name="ten.imageUrlDesktop"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Image (URL-Desktop)</FormLabel>
											<FormControl>
												<Input placeholder="https://..." {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name="ten.imageUrlMobile"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Image (URL-Mobile)</FormLabel>
											<FormControl>
												<Input placeholder="https://..." {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<SelectScrollable
								control={form.control}
								nameId={"ten.category"}
								label="Catégorie Mère"
								placeholder="Sélectionner une catégorie"
								data={primaryCategories || []}
							/>
						</CardContent>
					</Card>
				</div>

				<CardFooter className="justify-end">
					<Button type="submit" className="px-8 py-4 font-medium">
						Enregistrer le contenu
					</Button>
				</CardFooter>
			</form>
		</Form>
	);
}
