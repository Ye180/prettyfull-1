// Component input for drag and drop files

import { cn } from "@/lib/utils";
import { File, X } from "lucide-react";
import { useCallback, useState } from "react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./form";
import { Input } from "./input";

// interface  {
// 	form: UseFormReturn<T>;
// 	valueName: Path<T>;
// 	label?: string;
// 	maxSizeMB?: number;
// 	acceptedFormats?: string[];
// 	error?: string;
// }

const InputDrag = ({
	form,
	valueName,
	label = "Documents",

	maxSizeMB = 25,
	acceptedFormats = [".pdf", ".png", ".jpeg", ".jpg"],
	// error, // laisser RHF gérer les erreurs
}) => {
	const [dragActive, setDragActive] = useState(false);

	const maxSizeInBytes = maxSizeMB * 1024 * 1024;
	const acceptedFormatsString = acceptedFormats.join(",");
	const acceptedLower = acceptedFormats.map((f) => f.toLowerCase());

	const handleFileChange = useCallback(
		(files, onChange) => {
			if (!files) return;
			const newFiles = Array.from(files);

			const validFiles = [];
			let lastError = null;

			for (const file of newFiles) {
				if (file.size > maxSizeInBytes) {
					lastError = `Le fichier "${file.name}" est trop volumineux. Taille max: ${maxSizeMB} Mo.`;
					continue;
				}
				const nameLower = file.name.toLowerCase();
				const hasAllowedExt = acceptedLower.some((ext) =>
					nameLower.endsWith(ext)
				);
				if (!hasAllowedExt) {
					lastError = `Le fichier "${file.name}" a un format invalide. Formats acceptés: ${acceptedFormats.join(
						", "
					)}.`;
					continue;
				}
				validFiles.push(file);
			}

			if (validFiles.length > 0) {
				const currentFiles = form.getValues(valueName) || [];
				onChange([...currentFiles, ...validFiles]);
				// Effacer une éventuelle erreur précédente
				form.clearErrors?.(valueName);
			} else if (lastError) {
				// Propager l'erreur dans RHF pour l'afficher sous le champ
				form.setError?.(valueName, { type: "validate", message: lastError });
			}
		},
		[acceptedLower, acceptedFormats, form, maxSizeInBytes, maxSizeMB, valueName]
	);

	return (
		<FormField
			control={form.control}
			name={valueName}
			render={({ field }) => (
				<FormItem>
					<div className="flex h-fit w-full  flex-col gap-2 rounded-[2rem] bg-white py-6">
						<FormLabel className="">{label}</FormLabel>

						<p className="text-[0.8rem] text-[#666666]">
							Veuillez télécharger les documents au format pdf, png ou jpeg et
							assurez-vous que la taille du fichier est inférieure à {maxSizeMB}{" "}
							Mo.
						</p>

						{/* Zone de drop */}
						<div
							className={cn(
								"mt-2 border-2 border-dashed rounded-[1rem] p-6 text-center cursor-pointer transition flex flex-col items-center justify-center",
								dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
							)}
							onDragOver={(e) => {
								e.preventDefault();
								setDragActive(true);
							}}
							onDragLeave={() => setDragActive(false)}
							onDrop={(e) => {
								e.preventDefault();
								setDragActive(false);
								handleFileChange(e.dataTransfer.files, field.onChange);
							}}
							onClick={(e) => {
								e.stopPropagation();
								const input =
									e.currentTarget.querySelector('input[type="file"]');
								if (input) input.click();
							}}
							aria-label="Glissez-déposez les fichiers ici ou cliquez pour parcourir"
							role="button"
							tabIndex={0}
						>
							<FormControl className="flex justify-center ">
								<Input
									type="file"
									accept={acceptedFormatsString}
									multiple
									className="hidden"
									onChange={(e) => {
										handleFileChange(e.target.files, field.onChange);
									}}
								/>
							</FormControl>

							<FormLabel className="flex flex-col gap-5 cursor-pointer">
								<span className="font-medium text-[#1675BA]">
									Déposer des fichiers ou parcourir
								</span>
								<p className="text-gray-500 mt-1 text-[0.8rem]">
									Formats : {acceptedFormats.join(", ")} &nbsp; | &nbsp; Taille
									max : {maxSizeMB} Mo
								</p>
							</FormLabel>
						</div>

						{/* Liste des fichiers sélectionnés */}
						{Array.isArray(field.value) && field.value.length > 0 && (
							<div className="mt-4 space-y-2">
								{field.value.map((file, index) => (
									<div
										key={index}
										className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 rounded-2xl"
									>
										<div className="flex items-center gap-4">
											<File className="text-[#1675BA]" />
											<span className="text-[1rem] font-semibold">
												{file?.name ?? "Fichier"}
											</span>
											{typeof file?.size === "number" && (
												<span className="text-gray-500 text-[0.8rem]">
													{(file.size / (1024 * 1024)).toFixed(2)} MB
												</span>
											)}
										</div>
										<button
											type="button"
											onClick={() => {
												const next = Array.isArray(field.value)
													? field.value.filter((_, i) => i !== index)
													: [];
												field.onChange(next);
												if (next.length === 0) {
													// Optionnel: lever une erreur si requis
													// form.setError?.(valueName, { type: "required", message: "Au moins une image est requise." });
													form.clearErrors?.(valueName);
												}
											}}
											className="text-gray-500 transition hover:text-red-600"
										>
											<X className="size-4" />
										</button>
									</div>
								))}
							</div>
						)}

						{/* Affichage des erreurs RHF/Zod */}
						<FormMessage />
					</div>
				</FormItem>
			)}
		/>
	);
};

export default InputDrag;
