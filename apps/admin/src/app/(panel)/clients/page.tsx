"use client";

import type { Paginated, User } from "@prettyfull/contracts";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, toQueryString } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useDebounced, useListQuery } from "@/lib/use-list-query";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar, FilterSelect } from "@/components/ui/filters";
import { DataTable, Pagination, type Column } from "@/components/ui/table";
import { Badge, Button, Card, EmptyState } from "@/components/ui/primitives";

/** Module « Clients » (§4.5). */
const CustomersPage = () => {
	const router = useRouter();
	const list = useListQuery({ q: "", status: "" });
	const debouncedSearch = useDebounced(list.filters.q);

	const params = { ...list.params, q: debouncedSearch };

	const { data, isLoading } = useQuery({
		queryKey: ["customers", params],
		queryFn: () => api.get<Paginated<User>>(`/api/admin/customers${toQueryString(params)}`),
	});

	const columns: Column<User>[] = [
		{
			key: "name",
			header: "Cliente",
			cell: (user) => (
				<div className="min-w-0">
					<p className="truncate font-medium text-ink">
						{user.firstName} {user.lastName}
					</p>
					<p className="truncate text-[12px] text-subtle">{user.email}</p>
				</div>
			),
		},
		{
			key: "phone",
			header: "Téléphone",
			hideOnMobile: true,
			cell: (user) => <span className="text-muted">{user.phone ?? "—"}</span>,
		},
		{
			key: "status",
			header: "Statut",
			cell: (user) => (
				<Badge tone={user.status === "active" ? "success" : "neutral"}>
					{user.status === "active" ? "Active" : "Désactivée"}
				</Badge>
			),
		},
		{
			key: "lastLogin",
			header: "Dernière connexion",
			hideOnMobile: true,
			cell: (user) => (
				<span className="text-muted tabular">
					{user.lastLoginAt ? formatDate(user.lastLoginAt) : "Jamais"}
				</span>
			),
		},
		{
			key: "createdAt",
			header: "Inscription",
			align: "right",
			cell: (user) => (
				<span className="text-muted tabular">{formatDate(user.createdAt)}</span>
			),
		},
	];

	return (
		<>
			<PageHeader title="Clients" description="Comptes clients de la boutique." />

			<Card>
				<FilterBar
					search={list.filters.q}
					onSearchChange={(value) => list.setFilter("q", value)}
					searchPlaceholder="Nom, e-mail…"
					onReset={list.reset}
					showReset={list.isFiltered}
				>
					<FilterSelect
						label="Statut"
						placeholder="Tous les statuts"
						value={list.filters.status}
						onChange={(value) => list.setFilter("status", value)}
						options={[
							{ value: "active", label: "Active" },
							{ value: "inactive", label: "Désactivée" },
							{ value: "suspended", label: "Suspendue" },
						]}
					/>
				</FilterBar>

				<DataTable
					columns={columns}
					rows={data?.data ?? []}
					rowKey={(user) => user.id}
					loading={isLoading}
					onRowClick={(user) => router.push(`/clients/${user.id}`)}
					empty={
						<EmptyState
							title={list.isFiltered ? "Aucune cliente ne correspond" : "Aucune cliente"}
							description={
								list.isFiltered
									? "Modifiez ou réinitialisez les filtres."
									: "Les comptes créés depuis la boutique apparaîtront ici."
							}
							action={
								list.isFiltered ? (
									<Button size="sm" onClick={list.reset}>
										Réinitialiser
									</Button>
								) : undefined
							}
						/>
					}
				/>

				{data && <Pagination meta={data.meta} onChange={list.setPage} />}
			</Card>
		</>
	);
};

export default CustomersPage;
