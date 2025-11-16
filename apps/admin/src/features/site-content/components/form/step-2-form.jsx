import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { SelectScrollable } from "@/shared/component/select-within-search";

import { Separator } from "@/components/ui/separator";

import { Minus, PlusIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
export const StepFormTwo = ({
	control,
	form,
	fieldFourSection,
	appendFourField,
	removeFourField,
	primaryCategories,
	products,
	fieldFiveSection,
	appendFiveField,
	removeFiveField,
}) => {
	return (
		<>
			<Card className="border border-gray-200 shadow-md">
				<CardHeader>
					<CardTitle>Quatrieme section</CardTitle>
					<CardDescription>
						Liste de sous-blocs liés à cette section (ex: produits, catégories…)
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
									<FormMessage />
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
									<FormMessage />
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
										<Input placeholder="Sous-titre facultatif..." {...field} />
									</FormControl>
									<FormMessage />
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name="fourthSection.imageUrl"
							render={({ field: { onChange, value, ...field } }) => (
								<FormItem>
									<FormLabel>Image</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) onChange(file);
											}}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>{" "}
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
						<div key={item.id}>
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
								control={form.control}
								nameId={`fourthSection.products.${index}`}
								placeholder="Sélectionner une produit"
								data={products || []}
							/>
						</div>
					))}
					<div className="flex items-end justify-start h-fit">
						<button
							type="button"
							className="h-8 w-fit"
							onClick={() => appendFourField("fourthSection.products", " ")}
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
									<FormMessage />
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
									<FormMessage />
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
									<FormMessage />
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
									<FormMessage />
								</FormItem>
							)}
						/>

						<Separator />

						{fieldFiveSection.map((item, index) => (
							<div key={item.id}>
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
									control={form.control}
									nameId={`fiveSection.subCategory.${index}`}
									placeholder="Sélectionner une categorie"
									data={primaryCategories || []}
								/>
							</div>
						))}
						<div className="flex items-end justify-start h-fit">
							<button
								type="button"
								className="h-8 w-fit"
								onClick={() => appendFiveField("fiveSection.subCategory", " ")}
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
							Liste de sous-blocs liés à cette section (ex: catégories, images…)
						</CardDescription>
					</CardHeader>
					<CardContent className={"space-y-6"}>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={control}
								name="sixSection.imageUrlDesktop"
								render={({ field: { onChange, value, ...field } }) => (
									<FormItem>
										<FormLabel>Image (Desktop)</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="image/*"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) onChange(file);
												}}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="sixSection.imageUrlMobile"
								render={({ field: { onChange, value, ...field } }) => (
									<FormItem>
										<FormLabel>Image (Mobile)</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="image/*"
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) onChange(file);
												}}
												{...field}
											/>
										</FormControl>
										<FormMessage />
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
		</>
	);
};
