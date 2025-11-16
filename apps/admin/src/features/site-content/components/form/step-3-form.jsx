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
export const StepFormThird = ({
	control,
	form,
	products,
	primaryCategories,
	fieldSevenSection,
	appendSevenField,
	removeSevenField,
	fieldNineSection,
	appendNineField,
	removeNineField,
}) => {
	return (
		<>
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
									<FormMessage />
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
									<FormMessage />
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
									<FormMessage />
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
									<FormMessage />
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
							<div key={item.id}>
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
									control={form.control}
									nameId={`sevenSection.products.${index}`}
									placeholder="Sélectionner une produit"
									data={products || []}
								/>
							</div>
						))}
						<div className="flex items-end justify-start h-fit">
							<button
								type="button"
								className="h-8 w-fit"
								onClick={() => appendSevenField("sevenSection.products", "")}
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
								name="eightSection.imageUrlMobile"
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
									<FormMessage />
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
									<FormMessage />
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
									<FormMessage />
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
									<FormMessage />
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
							<div key={item.id}>
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
									control={form.control}
									nameId={`nineSection.subCategory.${index}`}
									placeholder="Sélectionner une sous catégorie"
									data={primaryCategories || []}
								/>
							</div>
						))}
						<div className="flex items-end justify-start h-fit">
							<button
								type="button"
								className="h-8 w-fit"
								onClick={() => appendNineField("nineSection.subCategory", "")}
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
								name="tenSection.imageUrlDesktop"
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
								name="tenSection.imageUrlMobile"
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
							nameId={"tenSection.category"}
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
