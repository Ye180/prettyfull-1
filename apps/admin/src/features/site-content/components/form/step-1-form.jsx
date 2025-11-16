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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
export const StepFormOne = ({
	control,
	form,
	primaryCategories,
	fieldSecondSection,
	appendSecondField,
	removeSecondField,
}) => {
	return (
		<>
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
								<FormMessage />
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
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="sortOrder"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ordre d'affichage</FormLabel>
								<FormControl>
									<Input type="number" min={0} {...field} />
								</FormControl>
								<FormMessage />
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
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>
			</Card>

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
									<FormMessage />
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
									<FormMessage />
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
									<FormMessage />
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
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Separator />

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={control}
							name="first.imageUrlDesktop"
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
							name="first.imageUrlMobile"
							render={({ field: { onChange, value, ...field } }) => (
								<FormItem>
									<FormLabel>Image (Mobile) </FormLabel>
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

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={control}
							name="first.video"
							render={({ field: { onChange, value, ...field } }) => (
								<FormItem className="col-span-1 md:col-span-2">
									<FormLabel>Video (facultatif)</FormLabel>
									<FormControl>
										<Input
											type="file"
											accept="video/*"
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
							name="first.ctaText.fr"
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
							name="first.ctaText.en"
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

			{/* Sections 2 et 3 */}
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
									<FormMessage />
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
									<FormMessage />
								</FormItem>
							)}
						/>

						{fieldSecondSection.map((field, index) => (
							<div key={field.id}>
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
									control={form.control}
									nameId={`secondSection.category.${index}`}
									placeholder="Sélectionner une catégorie"
									data={primaryCategories || []}
								/>
							</div>
						))}
						<div className="flex items-end justify-start h-fit">
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
									<FormMessage />
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<SelectScrollable
							control={form.control}
							nameId="secondSection.parentCategory"
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
							Liste de sous-blocs liés à cette section (ex: catégories, images…)
						</CardDescription>
					</CardHeader>
					<CardContent className={"space-y-6"}>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={control}
								name="thirdSection.imageUrlDesktop"
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
								name="thirdSection.imageUrlMobile"
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
							nameId={`thirdSection.category`}
							placeholder="Sélectionner une catégorie"
							data={primaryCategories || []}
						/>
					</CardContent>
				</Card>
			</div>
		</>
	);
};
