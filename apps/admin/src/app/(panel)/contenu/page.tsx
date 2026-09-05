"use client";

import type { Banner, Paginated, StaticPage } from "@prettyfull/contracts";
import { BANNER_PLACEMENTS, PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { BANNER_PLACEMENT_LABELS, CONTENT_STATUS_LABELS, formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	Field,
	Input,
	Select,
	Spinner,
	Textarea,
	contentStatusTone,
} from "@/components/ui/primitives";
import { IconEdit, IconPlus, IconTrash } from "@/components/icons";
import { slugify } from "@/features/catalogue/product-fields";

/** Module « Contenu » : bannières et pages statiques (§4.7). */

interface BannerDraft {
	id?: string;
	title: string;
	subtitle: string;
	imageUrl: string;
	linkUrl: string;
	ctaLabel: string;
	placement: (typeof BANNER_PLACEMENTS)[number];
	status: "draft" | "published" | "archived";
	position: string;
}

interface PageDraft {
	id?: string;
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	status: "draft" | "published" | "archived";
}

const ContentPage = () => {
	const queryClient = useQueryClient();
	const { can } = useAuth();
	const { notify, notifyError } = useToast();
	const writable = can(PERMISSIONS.content.write);

	const [bannerDraft, setBannerDraft] = useState<BannerDraft | null>(null);
	const [pageDraft, setPageDraft] = useState<PageDraft | null>(null);
	const [toDelete, setToDelete] = useState<{ kind: "banner" | "page"; id: string; label: string } | null>(null);

	const { data: banners, isLoading: loadingBanners } = useQuery({
		queryKey: ["banners"],
		queryFn: () => api.get<Paginated<Banner>>("/api/admin/banners?limit=50"),
	});

	const { data: pages } = useQuery({
		queryKey: ["pages"],
		queryFn: () => api.get<Paginated<StaticPage>>("/api/admin/pages?limit=50"),
	});

	const refresh = (key: string) => {
		void queryClient.invalidateQueries({ queryKey: [key] });
	};

	const saveBanner = useMutation({
		mutationFn: () => {
			const payload = {
				title: bannerDraft!.title.trim() || null,
				subtitle: bannerDraft!.subtitle.trim() || null,
				imageUrl: bannerDraft!.imageUrl.trim(),
				linkUrl: bannerDraft!.linkUrl.trim() || null,
				ctaLabel: bannerDraft!.ctaLabel.trim() || null,
				placement: bannerDraft!.placement,
				status: bannerDraft!.status,
				position: Number(bannerDraft!.position) || 0,
			};

			return bannerDraft!.id
				? api.patch(`/api/admin/banners/${bannerDraft!.id}`, payload)
				: api.post("/api/admin/banners", payload);
		},
		onSuccess: () => {
			refresh("banners");
			notify(bannerDraft?.id ? "Bannière mise à jour." : "Bannière créée.");
			setBannerDraft(null);
		},
		onError: (error) => notifyError(error, "Enregistrement impossible."),
	});

	const savePage = useMutation({
		mutationFn: () => {
			const payload = {
				slug: pageDraft!.slug.trim(),
				title: pageDraft!.title.trim(),
				excerpt: pageDraft!.excerpt.trim() || null,
				content: pageDraft!.content,
				status: pageDraft!.status,
			};

			return pageDraft!.id
				? api.patch(`/api/admin/pages/${pageDraft!.id}`, payload)
				: api.post("/api/admin/pages", payload);
		},
		onSuccess: () => {
			refresh("pages");
			notify(pageDraft?.id ? "Page mise à jour." : "Page créée.");
			setPageDraft(null);
		},
		onError: (error) => notifyError(error, "Enregistrement impossible."),
	});

	const remove = useMutation({
		mutationFn: () =>
			api.delete(
				toDelete!.kind === "banner"
					? `/api/admin/banners/${toDelete!.id}`
					: `/api/admin/pages/${toDelete!.id}`,
			),
		onSuccess: () => {
			refresh(toDelete!.kind === "banner" ? "banners" : "pages");
			notify("Élément supprimé.");
			setToDelete(null);
		},
		onError: (error) => {
			notifyError(error, "Suppression impossible.");
			setToDelete(null);
		},
	});

	return (
		<>
			<PageHeader
				title="Contenu"
				description="Bannières de la page d'accueil et pages statiques de la boutique."
			/>

			<Card className="mb-4">
				<CardHeader
					title="Bannières"
					description="Une bannière n'est servie que publiée et dans sa fenêtre de diffusion."
					action={
						writable && (
							<Button
								size="sm"
								variant="primary"
								onClick={() =>
									setBannerDraft({
										title: "",
										subtitle: "",
										imageUrl: "",
										linkUrl: "",
										ctaLabel: "",
										placement: "home_hero",
										status: "draft",
										position: "0",
									})
								}
							>
								<IconPlus width={14} height={14} />
								Bannière
							</Button>
						)
					}
				/>

				{loadingBanners ? (
					<Spinner />
				) : (banners?.data ?? []).length === 0 ? (
					<p className="px-4 py-8 text-center text-[13px] text-muted">
						Aucune bannière. La page d’accueil affichera ses visuels par défaut.
					</p>
				) : (
					<ul className="divide-y divide-[var(--border)]">
						{(banners?.data ?? []).map((banner) => (
							<li key={banner.id} className="flex items-center gap-3 px-4 py-3">
								<div className="h-10 w-16 shrink-0 overflow-hidden rounded border border-line bg-sunken">
									{/* eslint-disable-next-line @next/next/no-img-element -- visuels du storefront */}
									<img
										src={mediaUrl(banner.imageUrl) ?? ""}
										alt=""
										className="size-full object-cover"
									/>
								</div>

								<div className="min-w-0 flex-1">
									<p className="truncate text-[13px] font-medium text-ink">
										{banner.title ?? "(sans titre)"}
									</p>
									<p className="truncate text-[12px] text-subtle">
										{BANNER_PLACEMENT_LABELS[banner.placement] ?? banner.placement}
									</p>
								</div>

								<Badge tone={contentStatusTone(banner.status)}>
									{CONTENT_STATUS_LABELS[banner.status]}
								</Badge>

								{writable && (
									<>
										<Button
											size="sm"
											variant="ghost"
											aria-label="Modifier"
											onClick={() =>
												setBannerDraft({
													id: banner.id,
													title: banner.title ?? "",
													subtitle: banner.subtitle ?? "",
													imageUrl: banner.imageUrl,
													linkUrl: banner.linkUrl ?? "",
													ctaLabel: banner.ctaLabel ?? "",
													placement: banner.placement,
													status: banner.status,
													position: String(banner.position),
												})
											}
										>
											<IconEdit width={15} height={15} />
										</Button>
										<Button
											size="sm"
											variant="ghost"
											aria-label="Supprimer"
											onClick={() =>
												setToDelete({
													kind: "banner",
													id: banner.id,
													label: banner.title ?? "cette bannière",
												})
											}
										>
											<IconTrash width={15} height={15} />
										</Button>
									</>
								)}
							</li>
						))}
					</ul>
				)}
			</Card>

			<Card>
				<CardHeader
					title="Pages statiques"
					description="CGV, à propos, livraison, retours. Contenu en Markdown."
					action={
						writable && (
							<Button
								size="sm"
								variant="primary"
								onClick={() =>
									setPageDraft({
										slug: "",
										title: "",
										excerpt: "",
										content: "",
										status: "draft",
									})
								}
							>
								<IconPlus width={14} height={14} />
								Page
							</Button>
						)
					}
				/>

				<ul className="divide-y divide-[var(--border)]">
					{(pages?.data ?? []).map((page) => (
						<li key={page.id} className="flex items-center gap-3 px-4 py-3">
							<div className="min-w-0 flex-1">
								<p className="truncate text-[13px] font-medium text-ink">{page.title}</p>
								<p className="truncate text-[12px] text-subtle">
									/{page.slug} · modifiée le {formatDate(page.updatedAt)}
								</p>
							</div>

							<Badge tone={contentStatusTone(page.status)}>
								{CONTENT_STATUS_LABELS[page.status]}
							</Badge>

							{writable && (
								<>
									<Button
										size="sm"
										variant="ghost"
										aria-label="Modifier"
										onClick={() =>
											setPageDraft({
												id: page.id,
												slug: page.slug,
												title: page.title,
												excerpt: page.excerpt ?? "",
												content: page.content,
												status: page.status,
											})
										}
									>
										<IconEdit width={15} height={15} />
									</Button>
									<Button
										size="sm"
										variant="ghost"
										aria-label="Supprimer"
										onClick={() =>
											setToDelete({ kind: "page", id: page.id, label: page.title })
										}
									>
										<IconTrash width={15} height={15} />
									</Button>
								</>
							)}
						</li>
					))}
				</ul>
			</Card>

			<Dialog
				open={bannerDraft !== null}
				onClose={() => setBannerDraft(null)}
				title={bannerDraft?.id ? "Modifier la bannière" : "Nouvelle bannière"}
				size="md"
				footer={
					<>
						<Button onClick={() => setBannerDraft(null)}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => saveBanner.mutate()}
							loading={saveBanner.isPending}
							disabled={!bannerDraft?.imageUrl.trim()}
						>
							Enregistrer
						</Button>
					</>
				}
			>
				{bannerDraft && (
					<div className="flex flex-col gap-4">
						<Field label="Image" required hint="Chemin public du storefront ou URL complète.">
							<Input
								autoFocus
								value={bannerDraft.imageUrl}
								onChange={(event) =>
									setBannerDraft({ ...bannerDraft, imageUrl: event.target.value })
								}
								placeholder="/banner/banner1.jpg"
							/>
						</Field>

						<Field label="Titre">
							<Input
								value={bannerDraft.title}
								onChange={(event) =>
									setBannerDraft({ ...bannerDraft, title: event.target.value })
								}
							/>
						</Field>

						<Field label="Sous-titre">
							<Input
								value={bannerDraft.subtitle}
								onChange={(event) =>
									setBannerDraft({ ...bannerDraft, subtitle: event.target.value })
								}
							/>
						</Field>

						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Lien">
								<Input
									value={bannerDraft.linkUrl}
									onChange={(event) =>
										setBannerDraft({ ...bannerDraft, linkUrl: event.target.value })
									}
									placeholder="/collections/nouveautes"
								/>
							</Field>

							<Field label="Libellé du bouton">
								<Input
									value={bannerDraft.ctaLabel}
									onChange={(event) =>
										setBannerDraft({ ...bannerDraft, ctaLabel: event.target.value })
									}
									placeholder="Découvrir"
								/>
							</Field>

							<Field label="Emplacement">
								<Select
									value={bannerDraft.placement}
									onChange={(event) =>
										setBannerDraft({
											...bannerDraft,
											placement: event.target.value as BannerDraft["placement"],
										})
									}
									options={BANNER_PLACEMENTS.map((value) => ({
										value,
										label: BANNER_PLACEMENT_LABELS[value] ?? value,
									}))}
								/>
							</Field>

							<Field label="Statut">
								<Select
									value={bannerDraft.status}
									onChange={(event) =>
										setBannerDraft({
											...bannerDraft,
											status: event.target.value as BannerDraft["status"],
										})
									}
									options={[
										{ value: "draft", label: "Brouillon" },
										{ value: "published", label: "Publiée" },
										{ value: "archived", label: "Archivée" },
									]}
								/>
							</Field>
						</div>
					</div>
				)}
			</Dialog>

			<Dialog
				open={pageDraft !== null}
				onClose={() => setPageDraft(null)}
				title={pageDraft?.id ? "Modifier la page" : "Nouvelle page"}
				size="lg"
				footer={
					<>
						<Button onClick={() => setPageDraft(null)}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => savePage.mutate()}
							loading={savePage.isPending}
							disabled={!pageDraft?.title.trim() || !pageDraft.slug.trim()}
						>
							Enregistrer
						</Button>
					</>
				}
			>
				{pageDraft && (
					<div className="flex flex-col gap-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Titre" required>
								<Input
									autoFocus
									value={pageDraft.title}
									onChange={(event) => {
										const title = event.target.value;
										setPageDraft({
											...pageDraft,
											title,
											slug: pageDraft.id ? pageDraft.slug : slugify(title),
										});
									}}
								/>
							</Field>

							<Field label="Slug" required>
								<Input
									value={pageDraft.slug}
									onChange={(event) =>
										setPageDraft({ ...pageDraft, slug: slugify(event.target.value) })
									}
								/>
							</Field>
						</div>

						<Field label="Résumé">
							<Input
								value={pageDraft.excerpt}
								onChange={(event) =>
									setPageDraft({ ...pageDraft, excerpt: event.target.value })
								}
							/>
						</Field>

						<Field label="Contenu" hint="Markdown : ## pour un titre, - pour une liste.">
							<Textarea
								rows={14}
								className="font-mono text-[13px]"
								value={pageDraft.content}
								onChange={(event) =>
									setPageDraft({ ...pageDraft, content: event.target.value })
								}
							/>
						</Field>

						<Field label="Statut">
							<Select
								value={pageDraft.status}
								onChange={(event) =>
									setPageDraft({
										...pageDraft,
										status: event.target.value as PageDraft["status"],
									})
								}
								options={[
									{ value: "draft", label: "Brouillon" },
									{ value: "published", label: "Publiée" },
									{ value: "archived", label: "Archivée" },
								]}
							/>
						</Field>
					</div>
				)}
			</Dialog>

			<ConfirmDialog
				open={toDelete !== null}
				onClose={() => setToDelete(null)}
				onConfirm={() => remove.mutate()}
				loading={remove.isPending}
				title="Supprimer cet élément ?"
				message={`« ${toDelete?.label} » sera définitivement supprimé. Cette action est irréversible.`}
				confirmLabel="Supprimer"
			/>
		</>
	);
};

export default ContentPage;
