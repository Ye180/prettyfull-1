"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Undo2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
// import { Check, ChevronsUpDown, Undo2, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

// export interface SelectOption {
// 	id: string;
// 	label: string;
// 	account?: string | number;
// 	code?: string;
// }

// interface SelectWithSearchProps {
// 	options: SelectOption[];
// 	setOptions?: Dispatch<SetStateAction<SelectOption[]>>;
// 	value: string;
// 	onChange: (value: string | null) => void;
// 	placeholder: string;
// 	label?: string;
// 	searchPlaceholder?: string;
// 	emptyMessage?: string;
// 	className?: string;
// 	id?: string;
// 	disabled?: boolean;
// 	loading?: boolean;
// 	error?: string;
// 	classNameCustom?: string;
// 	personnalize?: string;
// 	classNameCommand?: string;
// 	formatOptionLabel?: (option: SelectOption) => string;
// }

const SelectWithSearch = ({
	options,
	setOptions,
	value,
	onChange,
	placeholder,
	label,
	searchPlaceholder = "Rechercher...",
	emptyMessage = "Aucun résultat trouvé.",
	className = "",
	disabled = false,
	loading = false,
	personnalize,
	error,
	classNameCustom,
	classNameCommand,
	formatOptionLabel,
}) => {
	const [open, setOpen] = useState(false);
	const [viewInput, setViewInput] = useState({
		input: false,
		value: null,
	});

	// Mémoriser l'option sélectionnée pour éviter les recherches répétitives
	const selectedOption = useMemo(() => {
		return options.find((option) => option.id === value);
	}, [options, value]);

	// Mémoriser la fonction de formatage pour éviter sa re-création
	const getFormattedLabel = useCallback(
		(option) => {
			if (formatOptionLabel) {
				return formatOptionLabel(option);
			}
			return option.account
				? `${option.account} - ${option.label}`
				: option.label;
		},
		[formatOptionLabel]
	);

	// Mémoriser le texte d'affichage pour éviter le recalcul

	const displayText = useMemo(() => {
		if (loading) return "Chargement...";

		if (!selectedOption || !selectedOption.label) {
			return placeholder;
		}

		if (selectedOption.label === personnalize) {
			return placeholder;
		}

		return getFormattedLabel(selectedOption);
	}, [loading, selectedOption, placeholder, getFormattedLabel, personnalize]);

	// Mémoriser les classes CSS du bouton
	const buttonClasses = useMemo(
		() =>
			cn(
				"w-full justify-between rounded-md border-none bg-[#F2F2F2] disabled:opacity-50 h-10 px-3",
				"text-left font-normal",
				open && "focus-within:ring-2 focus-within:ring-primary-800",
				error ? "border-red-500" : "border-gray-300",
				className
			),
		[open, error, className]
	);

	// Mémoriser les classes CSS du CommandGroup
	const commandGroupClasses = useMemo(
		() => cn("h-96 overflow-y-auto", classNameCustom),
		[classNameCustom]
	);

	// Mémoriser les classes CSS du conteneur d'input
	const inputContainerClasses = useMemo(
		() => cn("flex items-center gap-2 w-full", !viewInput.input && "hidden"),
		[viewInput.input]
	);

	// Handler optimisé pour la sélection d'option
	const handleOptionSelect = useCallback(
		(optionId) => {
			onChange(optionId);
			setOpen(false);
			setViewInput((prev) => ({
				...prev,
				input: optionId === personnalize,
			}));
		},
		[onChange, personnalize]
	);

	// Handler optimisé pour le changement d'input personnalisé
	const handleCustomInputChange = useCallback((e) => {
		setViewInput((prev) => ({
			...prev,
			value: e.target.value,
		}));
	}, []);

	// Handler optimisé pour le retour depuis l'input personnalisé
	const handleReturnFromCustomInput = useCallback(async () => {
		const addOfOption = {
			id: viewInput.value,
			label: viewInput.value,
		};
		onChange(addOfOption.id);
		if (setOptions) {
			const isOptionExists = options.some(
				(option) => option.id === addOfOption.id
			);
			if (!isOptionExists) {
				setOptions((prev) => [...prev, addOfOption]);
			}
		}

		setViewInput((prev) => ({
			...prev,
			input: false,
		}));
	}, [viewInput.value, onChange, setOptions, options]);

	return (
		<AnimatePresence>
			<div className="flex flex-col w-full gap-1">
				{label && (
					<label className="text-sm font-medium text-gray-700">{label}</label>
				)}

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						asChild
						className={cn("", viewInput.input && "hidden")}
					>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							disabled={disabled || loading}
							className={buttonClasses}
						>
							<span className="w-[30rem] truncate text-start font-medium">
								{displayText}
							</span>
							<ChevronsUpDown className="text-[1rem] opacity-50" />
						</Button>
					</PopoverTrigger>

					<PopoverContent className="w-full p-2" align="start">
						<motion.div
							initial={{ opacity: 0, x: 2 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<Command>
								<CommandInput
									placeholder={searchPlaceholder}
									className="h-12  text-[1.3rem]"
								/>
								<CommandList className="">
									<CommandEmpty className="w-[30rem] p-4 text-center text-[1.4rem] font-medium">
										{emptyMessage}
									</CommandEmpty>
									<CommandGroup
										className={`h-96 overflow-y-auto ${classNameCommand}`}
									>
										{options.map((option) => (
											<CommandItem
												key={option.id}
												value={option?.label ? String(option.label) : undefined}
												onSelect={() => handleOptionSelect(option.id)}
												className="w-full truncate whitespace-nowrap text-[1.3rem] font-medium"
											>
												<span className="w-[30rem] truncate font-medium">
													{getFormattedLabel(option)}
												</span>
												<Check
													className={cn(
														"ml-auto",

														value === option.id ? "opacity-100" : "opacity-0",

														value === personnalize && "opacity-0"
													)}
												/>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</motion.div>
					</PopoverContent>

					<div className={inputContainerClasses}>
						<div className="w-[90%] gap-2">
							<Input
								inputId="custom"
								placeholder="Autres :"
								type="text"
								className="h-full border-0 border-b-2 bg-[#F2F2F2]"
								onClick={(e) => e.stopPropagation()}
								onChange={handleCustomInputChange}
							/>
						</div>

						<button
							type="button"
							className="flex h-20 w-[10%] items-center justify-center rounded-xl bg-[#F2F2F2] p-2 text-black"
							onClick={handleReturnFromCustomInput}
							disabled={!viewInput.value?.trim()}
						>
							<Undo2 className="text-black/60" />
						</button>
						<button
							type="button"
							className="flex h-20 w-[10%] items-center justify-center rounded-xl bg-[#F2F2F2] p-2 text-black"
							onClick={() => {
								onChange(null);
								setViewInput({ ...viewInput, input: false });
							}}
						>
							<X className="text-black/60" />
						</button>
					</div>
				</Popover>

				{error && <p className="text-[1.4rem] text-red-500">{error}</p>}
			</div>
		</AnimatePresence>
	);
};

export default SelectWithSearch;
