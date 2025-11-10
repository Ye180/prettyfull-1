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
	error,
}) => {
	const [dragActive, setDragActive] = useState(false);

	const maxSizeInBytes = maxSizeMB * 1024 * 1024;
	const acceptedFormatsString = acceptedFormats.join(",");

	const handleFileChange = useCallback(
		(files, onChange) => {
			if (!files) return;
			const newFiles = Array.from(files);

			const validFiles = [];
			for (const file of newFiles) {
				if (file.size > maxSizeInBytes) {
					alert(
						`File "${file.name}" is too large. Max size is ${maxSizeMB} MB.`
					);
					continue;
				}
				if (!acceptedFormats.some((format) => file.name.endsWith(format))) {
					alert(
						`File "${
							file.name
						}" has an invalid format. Accepted formats are ${acceptedFormats.join(
							", "
						)}.`
					);
					continue;
				}
				validFiles.push(file);
			}

			if (validFiles.length > 0) {
				const currentFiles = form.getValues(valueName) || [];
				onChange([...currentFiles, ...validFiles]);
			}
		},
		[acceptedFormats, form, maxSizeInBytes, maxSizeMB, valueName]
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
								const input = document.getElementById("fichiers");
								if (input) {
									input.click();
								}
							}}
							aria-label="Drag and drop files here or click to browse"
							role="button"
							tabIndex={0}
						>
							<FormControl className="flex justify-center ">
								<Input
									type="file"
									accept={acceptedFormatsString}
									multiple
									className="hidden"
									id="fichiers"
									inputId="fichiers"
									onChange={(e) => {
										handleFileChange(e.target.files, field.onChange);
									}}
								/>
							</FormControl>

							<FormLabel
								htmlFor="fichiers"
								className="flex flex-col gap-5 cursor-pointer"
							>
								<span className="font-medium text-[#1675BA]">
									Déposer des fichiers ou parcourir
								</span>
								<p className="text-gray-500 mt-1 text-[0.8rem]">
									Formats : {acceptedFormats.join(", ")} &nbsp; | &nbsp; Taille
									max : {maxSizeMB} MB
								</p>
							</FormLabel>
						</div>

						{/* Liste des fichiers sélectionnés */}
						{field.value &&
							Array.isArray(field.value) &&
							field.value.length > 0 && (
								<div className="mt-4 space-y-2">
									{field.value?.map((file, index) => (
										<div
											key={index}
											className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 rounded-2xl"
										>
											<div className="flex items-center gap-4">
												<File className="text-[#1675BA]" />
												<span className="text-[1rem] font-semibold">
													{file.name}
												</span>
												<span className="text-gray-500 text-[0.8rem]">
													{(file.size / (1024 * 1024)).toFixed(2)} MB
												</span>
											</div>
											<button
												type="button"
												onClick={() => {
													const newFiles =
														(Array.isArray(field.value)
															? field.value.filter((_, i) => i !== index)
															: []) || [];
													field.onChange(newFiles);
												}}
												className="text-gray-500 transition hover:text-red-600"
											>
												<X className="size-4" />
											</button>
										</div>
									))}
								</div>
							)}

						<FormMessage className="text-[1.2rem]"> {error}</FormMessage>
					</div>
				</FormItem>
			)}
		/>
	);
};

export default InputDrag;
