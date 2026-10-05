"use client";

import {
	createAddress,
	deleteAddress,
	fetchAddresses,
	updateAddress,
} from "@/lib/store-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input,
} from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const MapPinIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
		<circle cx="12" cy="10" r="3" />
	</svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M5 12h14" />
		<path d="M12 5v14" />
	</svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
		<path d="m15 5 4 4" />
	</svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M3 6h18" />
		<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
		<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
		<line x1="10" x2="10" y1="11" y2="17" />
		<line x1="14" x2="14" y1="11" y2="17" />
	</svg>
);

const StarIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className={className}
	>
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Address {
	id: string;
	first_name: string;
	last_name: string;
	company?: string;
	address_1: string;
	address_2?: string;
	city: string;
	postal_code: string;
	province?: string;
	country_code: string;
	phone?: string;
	is_default_shipping?: boolean;
	is_default_billing?: boolean;
}

interface AddressFormData {
	first_name: string;
	last_name: string;
	company: string;
	address_1: string;
	address_2: string;
	city: string;
	postal_code: string;
	province: string;
	country_code: string;
	phone: string;
}

const emptyForm: AddressFormData = {
	first_name: "",
	last_name: "",
	company: "",
	address_1: "",
	address_2: "",
	city: "",
	postal_code: "",
	province: "",
	country_code: "",
	phone: "",
};

// ─── Address Card ─────────────────────────────────────────────────────────────

const AddressCard = ({
	address,
	onEdit,
	onDelete,
	isDeleting,
}: {
	address: Address;
	onEdit: (address: Address) => void;
	onDelete: (id: string) => void;
	isDeleting: boolean;
}) => {
	const t = useTranslations("Account.addresses");
	const isDefault = address.is_default_shipping || address.is_default_billing;

	return (
		<div className="relative p-6 bg-white rounded-xl border border-gray-200 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
			{isDefault && (
				<div className="flex gap-1.5 items-center mb-4">
					<StarIcon className="w-4 h-4 text-stone-700" />
					<span className="text-xs font-semibold tracking-wider text-stone-900 uppercase">
						{t("default")}
					</span>
				</div>
			)}

			<div className="space-y-1 text-sm text-gray-600">
				<p className="text-base font-semibold text-gray-900">
					{address.first_name} {address.last_name}
				</p>
				{address.company && <p className="text-gray-500">{address.company}</p>}
				<p>{address.address_1}</p>
				{address.address_2 && <p>{address.address_2}</p>}
				<p>
					{address.postal_code} {address.city}
				</p>
				{address.province && <p>{address.province}</p>}
				<p className="uppercase">{address.country_code}</p>
				{address.phone && (
					<p className="pt-2 text-gray-400">{t("phonePrefix")} {address.phone}</p>
				)}
			</div>

			<div className="flex gap-3 items-center pt-5 mt-5 border-t border-gray-100">
				<button
					onClick={() => onEdit(address)}
					className="flex gap-1.5 items-center px-4 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg transition-all hover:bg-gray-100 hover:text-black text-[1.3rem] cursor-pointer"
				>
					<PencilIcon className="w-3.5 h-3.5" />
					{t("edit")}
				</button>
				<button
					onClick={() => onDelete(address.id)}
					disabled={isDeleting}
					className="flex gap-1.5 items-center px-4 py-2 text-xs font-medium text-red-600 rounded-lg transition-all hover:bg-red-50 disabled:opacity-50 text-[1.3rem] cursor-pointer"
				>
					<TrashIcon className="w-3.5 h-3.5" />
					{isDeleting ? t("deleting") : t("delete")}
				</button>
			</div>
		</div>
	);
};

// ─── Address Form Modal ───────────────────────────────────────────────────────

const AddressFormModal = ({
	open,
	onOpenChange,
	editingAddress,
	onSave,
	isSaving,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editingAddress: Address | null;
	onSave: (data: AddressFormData) => Promise<void>;
	isSaving: boolean;
}) => {
	const t = useTranslations("Account.addresses");
	const [form, setForm] = useState<AddressFormData>(emptyForm);
	const [errors, setErrors] = useState<
		Partial<Record<keyof AddressFormData, string>>
	>({});

	useEffect(() => {
		if (editingAddress) {
			setForm({
				first_name: editingAddress.first_name || "",
				last_name: editingAddress.last_name || "",
				company: editingAddress.company || "",
				address_1: editingAddress.address_1 || "",
				address_2: editingAddress.address_2 || "",
				city: editingAddress.city || "",
				postal_code: editingAddress.postal_code || "",
				province: editingAddress.province || "",
				country_code: editingAddress.country_code || "",
				phone: editingAddress.phone || "",
			});
		} else {
			setForm(emptyForm);
		}
		setErrors({});
	}, [editingAddress, open]);

	const handleChange =
		(field: keyof AddressFormData) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			updateField(
				field,
				field === "country_code"
					? e.target.value.toLowerCase()
					: e.target.value,
			);
		};

	const updateField = (field: keyof AddressFormData, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof AddressFormData, string>> = {};
		const required = t("required");
		if (!form.first_name.trim()) newErrors.first_name = required;
		if (!form.last_name.trim()) newErrors.last_name = required;
		if (!form.address_1.trim()) newErrors.address_1 = required;
		if (!form.city.trim()) newErrors.city = required;
		if (!form.postal_code.trim()) newErrors.postal_code = required;
		if (!form.country_code.trim()) newErrors.country_code = required;
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		await onSave(form);
	};

	// Champs compacts : le label par défaut de `Input` (2.4rem) est pensé pour
	// les pages pleines, trop lourd dans une modale.
	const field = {
		className:
			"h-16 px-4 py-0 rounded-lg border-gray-300 text-[1.4rem] focus-visible:border-black max-md:h-16",
		labelClassName:
			"mb-1.5 text-[1.3rem] max-md:text-[1.3rem] font-sans font-medium text-gray-700",
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex flex-col gap-0 p-0 sm:max-w-[64rem] max-h-[90vh] rounded-2xl overflow-hidden">
				<DialogHeader className="px-8 pt-8 pb-6 text-left border-b border-gray-100">
					<DialogTitle className="text-[2.4rem]! font-bold tracking-wide">
						{editingAddress ? t("editAddressTitle") : t("newAddressTitle")}
					</DialogTitle>
					<DialogDescription className="text-[1.4rem] text-gray-500">
						{editingAddress
							? t("editAddressDescription")
							: t("newAddressDescription")}
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col flex-1 min-h-0"
				>
					<div className="grid overflow-y-auto grid-cols-1 gap-x-4 gap-y-5 px-8 py-6 sm:grid-cols-2">
						<Input
							{...field}
							label={t("firstName")}
							placeholder="Jean"
							value={form.first_name}
							onChange={handleChange("first_name")}
							errorMessage={errors.first_name}
						/>
						<Input
							{...field}
							label={t("lastName")}
							placeholder="Dupont"
							value={form.last_name}
							onChange={handleChange("last_name")}
							errorMessage={errors.last_name}
						/>
						<Input
							{...field}
							label={t("company")}
							placeholder={t("optional")}
							value={form.company}
							onChange={handleChange("company")}
						/>
						<Input
							{...field}
							label={t("phone")}
							placeholder={t("phonePlaceholder")}
							value={form.phone}
							onChange={handleChange("phone")}
						/>
						<div className="sm:col-span-2">
							<Input
								{...field}
								label={t("address")}
								placeholder="123 Rue de la Paix"
								value={form.address_1}
								onChange={handleChange("address_1")}
								errorMessage={errors.address_1}
							/>
						</div>
						<div className="sm:col-span-2">
							<Input
								{...field}
								label={t("address2")}
								placeholder={t("address2Placeholder")}
								value={form.address_2}
								onChange={handleChange("address_2")}
							/>
						</div>
						<Input
							{...field}
							label={t("city")}
							placeholder="Paris"
							value={form.city}
							onChange={handleChange("city")}
							errorMessage={errors.city}
						/>
						<Input
							{...field}
							label={t("postalCode")}
							placeholder="75001"
							value={form.postal_code}
							onChange={handleChange("postal_code")}
							errorMessage={errors.postal_code}
						/>
						<Input
							{...field}
							label={t("region")}
							placeholder={t("regionPlaceholder")}
							value={form.province}
							onChange={handleChange("province")}
						/>
						<Input
							{...field}
							label={t("countryCode")}
							placeholder="fr"
							value={form.country_code}
							onChange={handleChange("country_code")}
							errorMessage={errors.country_code}
						/>
					</div>

					<div className="flex gap-3 justify-end px-8 py-5 border-t border-gray-100 max-sm:flex-col-reverse">
						<Button
							type="button"
							variant="outline"
							className="rounded-full border-gray-300"
							onClick={() => onOpenChange(false)}
						>
							{t("cancel")}
						</Button>
						<Button
							type="submit"
							className="text-white bg-black rounded-full hover:bg-gray-800"
							disabled={isSaving}
						>
							{isSaving
								? t("saving")
								: editingAddress
									? t("update")
									: t("addAddress")}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

const DeleteConfirmModal = ({
	open,
	onOpenChange,
	onConfirm,
	isDeleting,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isDeleting: boolean;
}) => {
	const t = useTranslations("Account.addresses");
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[420px]">
				<DialogHeader className="space-y-4">
					<DialogTitle className="text-[2.7rem]! font-bold tracking-wide">
						{t("deleteAddressTitle")}
					</DialogTitle>
					<DialogDescription className="text-gray-500">
						{t("deleteAddressConfirm")}
					</DialogDescription>
				</DialogHeader>
				<div className="flex gap-3 justify-end pt-4">
					<Button
						variant="outline"
						className="rounded-full border-gray-300"
						onClick={() => onOpenChange(false)}
					>
						{t("cancel")}
					</Button>
					<Button
						className="font-semibold text-white bg-red-600 rounded-full"
						onClick={onConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? t("deleting") : t("delete")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

// ─── Main Page ────────────────────────────────────────────────────────────────

/**
 * Traduit une adresse de l'API vers la forme snake_case utilisée par cette
 * page. Le rendu reste inchangé ; seule la provenance des données a bougé.
 */
const toLocalAddress = (address: {
	id: string;
	firstName: string;
	lastName: string;
	company: string | null;
	address1: string;
	address2: string | null;
	city: string;
	postalCode: string | null;
	province: string | null;
	countryCode: string;
	phone: string | null;
	isDefaultShipping: boolean;
	isDefaultBilling: boolean;
}): Address => ({
	id: address.id,
	first_name: address.firstName,
	last_name: address.lastName,
	company: address.company ?? undefined,
	address_1: address.address1,
	address_2: address.address2 ?? undefined,
	city: address.city,
	postal_code: address.postalCode ?? "",
	province: address.province ?? undefined,
	country_code: address.countryCode,
	phone: address.phone ?? undefined,
	is_default_shipping: address.isDefaultShipping,
	is_default_billing: address.isDefaultBilling,
});

const toApiAddress = (data: AddressFormData) => ({
	firstName: data.first_name,
	lastName: data.last_name,
	company: data.company || null,
	address1: data.address_1,
	address2: data.address_2 || null,
	city: data.city,
	postalCode: data.postal_code || null,
	province: data.province || null,
	countryCode: (data.country_code || "ci").toLowerCase(),
	phone: data.phone || null,
	isDefaultShipping: false,
	isDefaultBilling: false,
});

export default function AddressesPage() {
	const t = useTranslations("Account.addresses");
	const queryClient = useQueryClient();

	const { data: remoteAddresses } = useQuery({
		queryKey: ["customer-addresses"],
		queryFn: fetchAddresses,
		retry: false,
	});

	const addresses = (remoteAddresses ?? []).map(toLocalAddress);

	const refreshAddresses = () =>
		queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });

	const [showFormModal, setShowFormModal] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
		null,
	);
	const [isDeleting, setIsDeleting] = useState(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const showSuccess = (msg: string) => {
		setSuccessMessage(msg);
		setTimeout(() => setSuccessMessage(null), 3000);
	};

	// ── Add / Edit ────────────────────────────────────────────────────────────

	const handleOpenAdd = () => {
		setEditingAddress(null);
		setShowFormModal(true);
	};

	const handleOpenEdit = (address: Address) => {
		setEditingAddress(address);
		setShowFormModal(true);
	};

	const handleSave = async (data: AddressFormData) => {
		setIsSaving(true);

		try {
			if (editingAddress) {
				await updateAddress(editingAddress.id, toApiAddress(data));
				showSuccess(t("addressUpdated"));
			} else {
				await createAddress(toApiAddress(data));
				showSuccess(t("addressAdded"));
			}

			await refreshAddresses();
			setShowFormModal(false);
		} catch (error) {
			// La modale reste ouverte : la saisie n'est pas perdue et peut être
			// corrigée à partir du message de l'API.
			showSuccess(
				error instanceof Error ? error.message : t("saveError"),
			);
		} finally {
			setIsSaving(false);
		}
	};

	// ── Delete ────────────────────────────────────────────────────────────────

	const handleOpenDelete = (id: string) => {
		setDeletingAddressId(id);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (!deletingAddressId) return;
		setIsDeleting(true);

		try {
			await deleteAddress(deletingAddressId);
			await refreshAddresses();
			showSuccess(t("addressDeleted"));
		} catch (error) {
			showSuccess(
				error instanceof Error ? error.message : t("deleteError"),
			);
		} finally {
			setShowDeleteModal(false);
			setDeletingAddressId(null);
			setIsDeleting(false);
		}
	};

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-8 justify-between sm:flex-row sm:items-center">
				<div>
					<h2 className="text-4xl! font-bold tracking-wider text-gray-900">
						{t("pageTitle")}
					</h2>
					<p className="mt-1 text-gray-500">
						{t("pageSubtitle")}
					</p>
				</div>
				<Button
					onClick={handleOpenAdd}
					className="flex gap-2 items-center self-start px-8 text-white bg-black rounded-sm max-md:py-4 hover:bg-gray-800 w-fit"
				>
					<PlusIcon className="size-10" />
					{t("addAddress")}
				</Button>
			</div>

			{/* Success Toast */}
			{successMessage && (
				<div className="flex gap-2 items-center px-4 py-3 text-sm font-medium text-green-800 bg-green-50 rounded-xl border border-green-200 animate-in fade-in">
					<svg
						className="w-5 h-5 text-green-600 shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
					{successMessage}
				</div>
			)}

			{/* Addresses Grid */}
			{addresses.length > 0 ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{addresses.map((address) => (
						<AddressCard
							key={address.id}
							address={address}
							onEdit={handleOpenEdit}
							onDelete={handleOpenDelete}
							isDeleting={isDeleting && deletingAddressId === address.id}
						/>
					))}

					{/* Add New Card */}
					<button
						onClick={handleOpenAdd}
						className="flex flex-col gap-3 justify-center items-center p-8 rounded-xl border-2 border-gray-200 border-dashed transition-all duration-200 cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 group min-h-[200px]"
					>
						<div className="flex justify-center items-center w-12 h-12 bg-gray-100 rounded-full transition-colors group-hover:bg-gray-200">
							<PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
						</div>
						<span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
							{t("addAddress")}
						</span>
					</button>
				</div>
			) : (
				<div className="flex flex-col justify-center items-center p-12 text-center bg-white rounded-2xl border border-gray-200 border-dashed">
					<div className="flex justify-center items-center mb-4 w-16 h-16 bg-gray-50 rounded-full">
						<MapPinIcon className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900">
						{t("noAddressTitle")}
					</h3>
					<p className="mx-auto mt-2 mb-8 max-w-sm text-gray-500">
						{t("noAddressDescription")}
					</p>
					<Button
						onClick={handleOpenAdd}
						className="flex gap-2 items-center text-white bg-black rounded-full hover:bg-gray-800"
					>
						<PlusIcon className="w-4 h-4" />
						{t("addAddress")}
					</Button>
				</div>
			)}

			{/* Quick tip */}
			{addresses.length > 0 && (
				<div className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
					<div className="flex justify-center items-center w-8 h-8 bg-gray-200 rounded-full shrink-0">
						<span className="text-xs font-bold text-gray-600">?</span>
					</div>
					<div className="text-sm text-gray-600">
						<p className="font-medium text-gray-900">{t("tip")}</p>
						<p>{t("tipDescription")}</p>
					</div>
				</div>
			)}

			{/* Modals */}
			<AddressFormModal
				open={showFormModal}
				onOpenChange={setShowFormModal}
				editingAddress={editingAddress}
				onSave={handleSave}
				isSaving={isSaving}
			/>

			<DeleteConfirmModal
				open={showDeleteModal}
				onOpenChange={setShowDeleteModal}
				onConfirm={handleConfirmDelete}
				isDeleting={isDeleting}
			/>
		</div>
	);
}
