"use client";

import type { Paginated, RoleKey, User } from "@prettyfull/contracts";
import { PERMISSIONS, ROLE_KEYS, ROLE_LABELS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ApiRequestError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/ui/table";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	Checkbox,
	Field,
	Input,
	Select,
} from "@/components/ui/primitives";
import { IconEdit, IconPlus, IconTrash } from "@/components/icons";

/** Module « Utilisateurs & rôles » (§4.8). */

interface RoleDefinition {
	key: string;
	name: string;
	description: string | null;
	isSystem: boolean;
	permissions: string[];
}

interface StaffDraft {
	id?: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	roles: RoleKey[];
	status: "active" | "inactive" | "suspended";
}

const StaffPage = () => {
	const queryClient = useQueryClient();
	const { can, user: currentUser } = useAuth();
	const { notify, notifyError } = useToast();
	const writable = can(PERMISSIONS.staff.write);

	const [draft, setDraft] = useState<StaffDraft | null>(null);
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [toDelete, setToDelete] = useState<User | null>(null);

	const { data: staff, isLoading } = useQuery({
		queryKey: ["staff"],
		queryFn: () => api.get<Paginated<User>>("/api/admin/staff?limit=50"),
	});

	const { data: roles } = useQuery({
		queryKey: ["roles"],
		queryFn: () => api.get<RoleDefinition[]>("/api/admin/roles"),
	});

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: ["staff"] });
	};

	const save = useMutation({
		mutationFn: () => {
			const base = {
				email: draft!.email.trim(),
				firstName: draft!.firstName.trim(),
				lastName: draft!.lastName.trim(),
				roles: draft!.roles,
				status: draft!.status,
			};

			// Le mot de passe n'est envoyé qu'à la création : le modifier pour
			// autrui n'est pas exposé, chacun change le sien depuis son compte.
			return draft!.id
				? api.patch<User>(`/api/admin/staff/${draft!.id}`, base)
				: api.post<User>("/api/admin/staff", { ...base, password: draft!.password });
		},
		onSuccess: () => {
			refresh();
			notify(draft?.id ? "Compte mis à jour." : "Compte créé.");
			setDraft(null);
			setErrors({});
		},
		onError: (error) => {
			if (error instanceof ApiRequestError && error.details) setErrors(error.details);
			notifyError(error, "Enregistrement impossible.");
		},
	});

	const remove = useMutation({
		mutationFn: (id: string) => api.delete(`/api/admin/staff/${id}`),
		onSuccess: () => {
			refresh();
			notify("Compte supprimé.");
			setToDelete(null);
		},
		onError: (error) => {
			// L'API refuse de supprimer le dernier super-administrateur actif.
			notifyError(error, "Suppression impossible.");
			setToDelete(null);
		},
	});

	const columns: Column<User>[] = [
		{
			key: "name",
			header: "Compte",
			cell: (member) => (
				<div className="min-w-0">
					<p className="truncate font-medium text-ink">
						{member.firstName} {member.lastName}
						{member.id === currentUser?.id && (
							<span className="ml-1.5 text-[12px] text-subtle">(vous)</span>
						)}
					</p>
					<p className="truncate text-[12px] text-subtle">{member.email}</p>
				</div>
			),
		},
		{
			key: "roles",
			header: "Rôles",
			cell: (member) => (
				<div className="flex flex-wrap gap-1">
					{member.roles.map((role) => (
						<Badge key={role} tone="info">
							{ROLE_LABELS[role] ?? role}
						</Badge>
					))}
				</div>
			),
		},
		{
			key: "status",
			header: "Statut",
			hideOnMobile: true,
			cell: (member) => (
				<Badge tone={member.status === "active" ? "success" : "neutral"}>
					{member.status === "active" ? "Actif" : "Désactivé"}
				</Badge>
			),
		},
		{
			key: "lastLogin",
			header: "Dernière connexion",
			hideOnMobile: true,
			cell: (member) => (
				<span className="text-muted tabular">
					{member.lastLoginAt ? formatDateTime(member.lastLoginAt) : "Jamais"}
				</span>
			),
		},
		{
			key: "actions",
			header: "",
			align: "right",
			width: "1%",
			cell: (member) =>
				writable ? (
					<div className="flex justify-end gap-1">
						<Button
							size="sm"
							variant="ghost"
							aria-label="Modifier"
							onClick={() =>
								setDraft({
									id: member.id,
									email: member.email,
									password: "",
									firstName: member.firstName,
									lastName: member.lastName,
									roles: member.roles,
									status: member.status,
								})
							}
						>
							<IconEdit width={15} height={15} />
						</Button>
						{member.id !== currentUser?.id && (
							<Button
								size="sm"
								variant="ghost"
								aria-label="Supprimer"
								onClick={() => setToDelete(member)}
							>
								<IconTrash width={15} height={15} />
							</Button>
						)}
					</div>
				) : null,
		},
	];

	return (
		<>
			<PageHeader
				title="Utilisateurs & rôles"
				description="Comptes du back-office et permissions associées."
				actions={
					writable && (
						<Button
							variant="primary"
							onClick={() =>
								setDraft({
									email: "",
									password: "",
									firstName: "",
									lastName: "",
									roles: ["support"],
									status: "active",
								})
							}
						>
							<IconPlus width={16} height={16} />
							Nouveau compte
						</Button>
					)
				}
			/>

			<Card className="mb-4">
				<CardHeader title="Comptes back-office" />
				<DataTable
					columns={columns}
					rows={staff?.data ?? []}
					rowKey={(member) => member.id}
					loading={isLoading}
				/>
			</Card>

			<Card>
				<CardHeader
					title="Rôles et permissions"
					description="Les rôles sont figés : ils garantissent le cloisonnement des modules."
				/>
				<div className="grid gap-4 p-4 sm:grid-cols-2">
					{(roles ?? []).map((role) => (
						<div key={role.key} className="rounded-md border border-line bg-sunken p-3">
							<p className="text-[13px] font-medium text-ink">{role.name}</p>
							{role.description && (
								<p className="mt-0.5 text-[12px] text-muted">{role.description}</p>
							)}
							<div className="mt-2 flex flex-wrap gap-1">
								{role.permissions.map((permission) => (
									<span
										key={permission}
										className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[11px] text-muted"
									>
										{permission}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</Card>

			<Dialog
				open={draft !== null}
				onClose={() => {
					setDraft(null);
					setErrors({});
				}}
				title={draft?.id ? "Modifier le compte" : "Nouveau compte back-office"}
				size="md"
				footer={
					<>
						<Button onClick={() => setDraft(null)}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => save.mutate()}
							loading={save.isPending}
							disabled={
								!draft?.email.trim() ||
								!draft.firstName.trim() ||
								draft.roles.length === 0 ||
								(!draft.id && draft.password.length < 10)
							}
						>
							Enregistrer
						</Button>
					</>
				}
			>
				{draft && (
					<div className="flex flex-col gap-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Prénom" required error={errors.firstName?.[0]}>
								<Input
									autoFocus
									value={draft.firstName}
									onChange={(event) => setDraft({ ...draft, firstName: event.target.value })}
								/>
							</Field>

							<Field label="Nom" required error={errors.lastName?.[0]}>
								<Input
									value={draft.lastName}
									onChange={(event) => setDraft({ ...draft, lastName: event.target.value })}
								/>
							</Field>
						</div>

						<Field label="Adresse e-mail" required error={errors.email?.[0]}>
							<Input
								type="email"
								value={draft.email}
								onChange={(event) => setDraft({ ...draft, email: event.target.value })}
							/>
						</Field>

						{!draft.id && (
							<Field
								label="Mot de passe"
								required
								error={errors.password?.[0]}
								hint="Au moins 10 caractères, une majuscule, une minuscule et un chiffre."
							>
								<Input
									type="password"
									autoComplete="new-password"
									value={draft.password}
									onChange={(event) => setDraft({ ...draft, password: event.target.value })}
								/>
							</Field>
						)}

						<Field label="Rôles" required error={errors.roles?.[0]}>
							<div className="flex flex-col gap-2 rounded-md border border-line bg-raised p-3">
								{ROLE_KEYS.map((role) => (
									<Checkbox
										key={role}
										label={ROLE_LABELS[role]}
										checked={draft.roles.includes(role)}
										onChange={(event) =>
											setDraft({
												...draft,
												roles: event.target.checked
													? [...draft.roles, role]
													: draft.roles.filter((item) => item !== role),
											})
										}
									/>
								))}
							</div>
						</Field>

						<Field label="Statut">
							<Select
								value={draft.status}
								onChange={(event) =>
									setDraft({ ...draft, status: event.target.value as StaffDraft["status"] })
								}
								options={[
									{ value: "active", label: "Actif" },
									{ value: "inactive", label: "Désactivé" },
									{ value: "suspended", label: "Suspendu" },
								]}
							/>
						</Field>
					</div>
				)}
			</Dialog>

			<ConfirmDialog
				open={toDelete !== null}
				onClose={() => setToDelete(null)}
				onConfirm={() => toDelete && remove.mutate(toDelete.id)}
				loading={remove.isPending}
				title="Supprimer ce compte ?"
				message={`« ${toDelete?.firstName} ${toDelete?.lastName} » perdra immédiatement l'accès au back-office et ses sessions seront révoquées.`}
				confirmLabel="Supprimer"
			/>
		</>
	);
};

export default StaffPage;
