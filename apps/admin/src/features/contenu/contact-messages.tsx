"use client";

import type { ContactMessage, Paginated } from "@prettyfull/contracts";
import { PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, toQueryString } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	EmptyState,
	Spinner,
} from "@/components/ui/primitives";
import { Pagination } from "@/components/ui/table";
import { useListQuery } from "@/lib/use-list-query";
import { FilterSelect } from "@/components/ui/filters";

/**
 * Messages du formulaire de contact du storefront.
 *
 * Placés dans le module « Contenu » plutôt que dans un module dédié : ils
 * relèvent du même travail éditorial, et un dixième onglet pour une liste
 * simple alourdirait la navigation sans rien apporter.
 */

const STATUS_LABELS: Record<ContactMessage["status"], string> = {
	new: "Nouveau",
	read: "Lu",
	archived: "Archivé",
};

const STATUS_TONE = {
	new: "info",
	read: "neutral",
	archived: "neutral",
} as const;

export const ContactMessages = () => {
	const queryClient = useQueryClient();
	const { can } = useAuth();
	const { notify, notifyError } = useToast();
	const writable = can(PERMISSIONS.content.write);

	const list = useListQuery({ status: "" }, 10);
	const [opened, setOpened] = useState<ContactMessage | null>(null);

	const { data, isLoading } = useQuery({
		queryKey: ["contact-messages", list.params],
		queryFn: () =>
			api.get<Paginated<ContactMessage>>(
				`/api/admin/contact-messages${toQueryString(list.params)}`,
			),
	});

	const setStatus = useMutation({
		mutationFn: ({
			id,
			status,
		}: {
			id: string;
			status: ContactMessage["status"];
		}) =>
			api.patch<ContactMessage>(`/api/admin/contact-messages/${id}`, {
				status,
			}),
		onSuccess: (updated) => {
			void queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
			setOpened((current) => (current?.id === updated.id ? updated : current));
			notify(`Message marqué « ${STATUS_LABELS[updated.status]} ».`);
		},
		onError: (error) => notifyError(error, "Mise à jour impossible."),
	});

	/** Ouvrir un message non lu le marque lu : c'est le geste qui le prouve. */
	const open = (message: ContactMessage) => {
		setOpened(message);
		if (writable && message.status === "new") {
			setStatus.mutate({ id: message.id, status: "read" });
		}
	};

	const unread = (data?.data ?? []).filter((m) => m.status === "new").length;

	return (
		<>
			<Card>
				<CardHeader
					title="Messages reçus"
					description="Envoyés depuis le formulaire de contact de la boutique."
					action={
						<div className="flex items-center gap-2">
							{unread > 0 && <Badge tone="info">{unread} non lu(s)</Badge>}
							<FilterSelect
								label="Statut"
								placeholder="Tous"
								value={list.filters.status}
								onChange={(value) => list.setFilter("status", value)}
								options={[
									{ value: "new", label: "Nouveaux" },
									{ value: "read", label: "Lus" },
									{ value: "archived", label: "Archivés" },
								]}
							/>
						</div>
					}
				/>

				{isLoading ? (
					<Spinner />
				) : (data?.data ?? []).length === 0 ? (
					<EmptyState
						title="Aucun message"
						description="Les messages envoyés depuis la page Contact apparaîtront ici."
					/>
				) : (
					<ul className="divide-y divide-[var(--border)]">
						{(data?.data ?? []).map((message) => (
							<li key={message.id}>
								<button
									type="button"
									onClick={() => open(message)}
									className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-sunken"
								>
									<span className="min-w-0 flex-1">
										<span className="flex items-center gap-2">
											<span
												className={`truncate text-[13px] text-ink ${
													message.status === "new"
														? "font-semibold"
														: "font-medium"
												}`}
											>
												{message.name}
											</span>
											<span className="truncate text-[12px] text-subtle">
												{message.email}
											</span>
										</span>
										<span className="mt-0.5 block truncate text-[12px] text-muted">
											{message.subject ? `${message.subject} - ` : ""}
											{message.message}
										</span>
									</span>

									<Badge tone={STATUS_TONE[message.status]}>
										{STATUS_LABELS[message.status]}
									</Badge>

									<span className="shrink-0 whitespace-nowrap text-[12px] text-subtle tabular">
										{formatDateTime(message.createdAt)}
									</span>
								</button>
							</li>
						))}
					</ul>
				)}

				{data && <Pagination meta={data.meta} onChange={list.setPage} />}
			</Card>

			<Dialog
				open={opened !== null}
				onClose={() => setOpened(null)}
				title={opened?.subject || "Message"}
				description={
					opened
						? `${opened.name} · ${formatDateTime(opened.createdAt)}`
						: undefined
				}
				size="md"
				footer={
					opened && (
						<>
							{/* Répondre passe par le client de messagerie : ajouter un
							    envoi depuis le panel demanderait un prestataire d'e-mail
							    que le projet n'a pas encore. */}
							<a
								href={`mailto:${opened.email}?subject=${encodeURIComponent(
									`Re : ${opened.subject ?? "votre message"}`,
								)}`}
								className="inline-flex h-9 items-center rounded-md border border-line-strong bg-raised px-3.5 text-[14px] font-medium text-ink transition-colors hover:bg-accent-soft"
							>
								Répondre par e-mail
							</a>

							{writable && opened.status !== "archived" && (
								<Button
									onClick={() =>
										setStatus.mutate({ id: opened.id, status: "archived" })
									}
									loading={setStatus.isPending}
								>
									Archiver
								</Button>
							)}

							<Button variant="primary" onClick={() => setOpened(null)}>
								Fermer
							</Button>
						</>
					)
				}
			>
				{opened && (
					<div className="flex flex-col gap-4">
						<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px]">
							<dt className="text-subtle">E-mail</dt>
							<dd>
								<a
									href={`mailto:${opened.email}`}
									className="text-ink underline"
								>
									{opened.email}
								</a>
							</dd>

							{opened.phone && (
								<>
									<dt className="text-subtle">Téléphone</dt>
									<dd className="text-ink">{opened.phone}</dd>
								</>
							)}
						</dl>

						{/* `whitespace-pre-wrap` préserve les retours à la ligne saisis
						    par la cliente ; les afficher d'un bloc rendrait un message
						    structuré illisible. */}
						<p className="whitespace-pre-wrap rounded-md border border-line bg-sunken p-3 text-[13px] leading-relaxed text-ink">
							{opened.message}
						</p>
					</div>
				)}
			</Dialog>
		</>
	);
};
