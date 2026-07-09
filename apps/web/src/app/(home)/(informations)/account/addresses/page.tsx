"use client";

import { sdk } from "@/lib/api/sdk";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input,
	Skeleton,
} from "@prettyfull/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
	const isDefault = address.is_default_shipping || address.is_default_billing;

	return (
		<div className="relative p-6 bg-white rounded-xl border border-gray-200 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
			{isDefault && (
				<div className="flex gap-1.5 items-center mb-4">
					<StarIcon className="w-4 h-4 text-amber-500" />
					<span className="text-xs font-semibold tracking-wider text-amber-600 uppercase">
						Par défaut
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
					<p className="pt-2 text-gray-400">Tél: {address.phone}</p>
				)}
			</div>

			<div className="flex gap-3 items-center pt-5 mt-5 border-t border-gray-100">
				<button
					onClick={() => onEdit(address)}
					className="flex gap-1.5 items-center px-4 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg transition-all hover:bg-gray-100 hover:text-black text-[1.3rem] cursor-pointer"
				>
					<PencilIcon className="w-3.5 h-3.5" />
					Modifier
				</button>
				<button
					onClick={() => onDelete(address.id)}
					disabled={isDeleting}
					className="flex gap-1.5 items-center px-4 py-2 text-xs font-medium text-red-600 rounded-lg transition-all hover:bg-red-50 disabled:opacity-50 text-[1.3rem] cursor-pointer"
				>
					<TrashIcon className="w-3.5 h-3.5" />
					{isDeleting ? "Suppression..." : "Supprimer"}
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
		if (!form.first_name.trim()) newErrors.first_name = "Requis";
		if (!form.last_name.trim()) newErrors.last_name = "Requis";
		if (!form.address_1.trim()) newErrors.address_1 = "Requis";
		if (!form.city.trim()) newErrors.city = "Requis";
		if (!form.postal_code.trim()) newErrors.postal_code = "Requis";
		if (!form.country_code.trim()) newErrors.country_code = "Requis";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		await onSave(form);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto py-10">
				<DialogHeader>
					<DialogTitle className="text-[2.4rem]! lg:text-[3.4rem]! font-bold tracking-wide">
						{editingAddress ? "Modifier l'adresse" : "Nouvelle adresse"}
					</DialogTitle>
					<DialogDescription className="text-gray-500">
						{editingAddress
							? "Modifiez les informations de votre adresse."
							: "Ajoutez une nouvelle adresse de livraison."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="mt-6 space-y-5">
					<div className="grid grid-cols-2 gap-4">
						<Input
							label="Prénom"
							placeholder="Jean"
							className="px-4 h-20 label:text-[1rem]"
							value={form.first_name}
							onChange={handleChange("first_name")}
							errorMessage={errors.first_name}
						/>
						<Input
							label="Nom"
							placeholder="Dupont"
							className="px-4 h-20"
							value={form.last_name}
							onChange={handleChange("last_name")}
							errorMessage={errors.last_name}
						/>
					</div>

					<Input
						label="Entreprise"
						placeholder="Optionnel"
						className="px-4 h-20"
						value={form.company}
						onChange={handleChange("company")}
					/>

					<Input
						label="Adresse"
						placeholder="123 Rue de la Paix"
						className="px-4 h-20"
						value={form.address_1}
						onChange={handleChange("address_1")}
						errorMessage={errors.address_1}
					/>

					<Input
						label="Complément d'adresse"
						placeholder="Appartement, étage... (optionnel)"
						className="px-4 h-20"
						value={form.address_2}
						onChange={handleChange("address_2")}
					/>

					<div className="grid grid-cols-2 gap-4">
						<Input
							label="Ville"
							placeholder="Paris"
							className="px-4 h-20"
							value={form.city}
							onChange={handleChange("city")}
							errorMessage={errors.city}
						/>
						<Input
							label="Code postal"
							placeholder="75001"
							className="px-4 h-20"
							value={form.postal_code}
							onChange={handleChange("postal_code")}
							errorMessage={errors.postal_code}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<Input
							label="Région / Province"
							placeholder="Île-de-France (optionnel)"
							className="px-4 h-20"
							value={form.province}
							onChange={handleChange("province")}
						/>
						<Input
							label="Code pays"
							placeholder="fr"
							className="px-4 h-20"
							value={form.country_code}
							onChange={handleChange("country_code")}
							errorMessage={errors.country_code}
						/>
					</div>

					<Input
						label="Téléphone"
						placeholder="+33 6 12 34 56 78 (optionnel)"
						className="px-4 h-20"
						value={form.phone}
						onChange={handleChange("phone")}
					/>

					<div className="flex gap-3 justify-end pt-4 max-md:gap-6 max-md:flex-col-reverse">
						<Button
							type="button"
							variant="outline"
							className="rounded-full border-gray-300"
							onClick={() => onOpenChange(false)}
						>
							Annuler
						</Button>
						<Button
							type="submit"
							className="text-white bg-black rounded-full hover:bg-gray-800"
							disabled={isSaving}
						>
							{isSaving
								? "Enregistrement..."
								: editingAddress
									? "Mettre à jour"
									: "Ajouter l'adresse"}
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
}) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent className="sm:max-w-[420px]">
			<DialogHeader className="space-y-4">
				<DialogTitle className="text-[2.7rem]! font-bold tracking-wide">
					Supprimer l&apos;adresse
				</DialogTitle>
				<DialogDescription className="text-gray-500">
					Êtes-vous sûr de vouloir supprimer cette adresse ? Cette action est
					irréversible.
				</DialogDescription>
			</DialogHeader>
			<div className="flex gap-3 justify-end pt-4">
				<Button
					variant="outline"
					className="rounded-full border-gray-300"
					onClick={() => onOpenChange(false)}
				>
					Annuler
				</Button>
				<Button
					className="font-semibold text-white bg-red-600 rounded-full"
					onClick={onConfirm}
					disabled={isDeleting}
				>
					{isDeleting ? "Suppression..." : "Supprimer"}
				</Button>
			</div>
		</DialogContent>
	</Dialog>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AddressesPage() {
	const router = useRouter();
	const [isAuthChecking, setIsAuthChecking] = useState(true);
	const [customer, setCustomer] = useState<any>(null);

	const [showFormModal, setShowFormModal] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
		null,
	);
	const [isDeleting, setIsDeleting] = useState(false);

	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const fetchCustomer = useCallback(async () => {
		try {
			const { customer } = await sdk.store.customer.retrieve();
			setCustomer(customer);
		} catch {
			router.push("/login");
		} finally {
			setIsAuthChecking(false);
		}
	}, [router]);

	useEffect(() => {
		fetchCustomer();
	}, [fetchCustomer]);

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
				await sdk.store.customer.updateAddress(editingAddress.id, {
					first_name: data.first_name,
					last_name: data.last_name,
					company: data.company || undefined,
					address_1: data.address_1,
					address_2: data.address_2 || undefined,
					city: data.city,
					postal_code: data.postal_code,
					province: data.province || undefined,
					country_code: data.country_code,
					phone: data.phone || undefined,
				});
				showSuccess("Adresse mise à jour !");
			} else {
				await sdk.store.customer.createAddress({
					first_name: data.first_name,
					last_name: data.last_name,
					company: data.company || undefined,
					address_1: data.address_1,
					address_2: data.address_2 || undefined,
					city: data.city,
					postal_code: data.postal_code,
					province: data.province || undefined,
					country_code: data.country_code,
					phone: data.phone || undefined,
				});
				showSuccess("Adresse ajoutée !");
			}
			setShowFormModal(false);
			await fetchCustomer();
		} catch (err) {
			console.error("Failed to save address:", err);
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
			await sdk.store.customer.deleteAddress(deletingAddressId);
			setShowDeleteModal(false);
			setDeletingAddressId(null);
			showSuccess("Adresse supprimée !");
			await fetchCustomer();
		} catch (err) {
			console.error("Failed to delete address:", err);
		} finally {
			setIsDeleting(false);
		}
	};

	// ── Loading ───────────────────────────────────────────────────────────────

	if (isAuthChecking) {
		return (
			<div className="space-y-8">
				<Skeleton className="w-60 h-10" />
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="w-full h-48 rounded-xl" />
					))}
				</div>
			</div>
		);
	}

	if (!customer) return null;

	const addresses: Address[] = customer.addresses ?? [];

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-8 justify-between sm:flex-row sm:items-center">
				<div>
					<h2 className="text-4xl! font-bold tracking-wider text-gray-900">
						My Addresses
					</h2>
					<p className="mt-1 text-gray-500">
						Manage your delivery and billing addresses.
					</p>
				</div>
				<Button
					onClick={handleOpenAdd}
					className="flex gap-2 items-center self-start px-8 text-white bg-black rounded-full max-md:py-4 hover:bg-gray-800 w-fit"
				>
					<PlusIcon className="size-10" />
					Add an address
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
							Add an address
						</span>
					</button>
				</div>
			) : (
				<div className="flex flex-col justify-center items-center p-12 text-center bg-white rounded-2xl border border-gray-200 border-dashed">
					<div className="flex justify-center items-center mb-4 w-16 h-16 bg-gray-50 rounded-full">
						<MapPinIcon className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900">
						No address registered
					</h3>
					<p className="mx-auto mt-2 mb-8 max-w-sm text-gray-500">
						Add your first address to make your future orders easier.
					</p>
					<Button
						onClick={handleOpenAdd}
						className="flex gap-2 items-center text-white bg-black rounded-full hover:bg-gray-800"
					>
						<PlusIcon className="w-4 h-4" />
						Add an address
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
						<p className="font-medium text-gray-900">Tip</p>
						<p>
							Your first address is automatically used as the default address
							during checkout. You can change the address when finalizing your
							order.
						</p>
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
