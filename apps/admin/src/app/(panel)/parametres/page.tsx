"use client";

import type { StoreSettings, TaxRate } from "@prettyfull/contracts";
import { CURRENCY_CODES, LOCALES, PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	Checkbox,
	Field,
	Input,
	Select,
	Spinner,
} from "@/components/ui/primitives";

/** Module « Paramètres généraux » (§4.9). */
const SettingsPage = () => {
	const queryClient = useQueryClient();
	const { can } = useAuth();
	const { notify, notifyError } = useToast();
	const writable = can(PERMISSIONS.settings.write);

	const [form, setForm] = useState<StoreSettings | null>(null);

	const { data: settings, isLoading } = useQuery({
		queryKey: ["settings"],
		queryFn: () => api.get<StoreSettings>("/api/admin/settings"),
	});

	const { data: taxes } = useQuery({
		queryKey: ["tax-rates"],
		queryFn: () => api.get<TaxRate[]>("/api/admin/tax-rates"),
	});

	// Initialisé une seule fois : les rafraîchissements ne doivent pas écraser
	// une saisie en cours.
	useEffect(() => {
		if (settings && !form) setForm(settings);
	}, [settings, form]);

	const save = useMutation({
		mutationFn: () => api.patch<StoreSettings>("/api/admin/settings", form!),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["settings"] });
			notify("Paramètres enregistrés.");
		},
		onError: (error) => notifyError(error, "Enregistrement impossible."),
	});

	if (isLoading || !form) return <Spinner label="Chargement des paramètres…" />;

	const set = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) =>
		setForm({ ...form, [key]: value });

	return (
		<>
			<PageHeader
				title="Paramètres généraux"
				description="Identité de la boutique, devises, langues et règles de stock."
				actions={
					writable && (
						<Button variant="primary" onClick={() => save.mutate()} loading={save.isPending}>
							Enregistrer
						</Button>
					)
				}
			/>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader title="Boutique" />
					<div className="flex flex-col gap-4 p-4">
						<Field label="Nom de la boutique">
							<Input
								value={form.storeName}
								disabled={!writable}
								onChange={(event) => set("storeName", event.target.value)}
							/>
						</Field>

						<Field label="E-mail de contact">
							<Input
								type="email"
								value={form.contactEmail}
								disabled={!writable}
								onChange={(event) => set("contactEmail", event.target.value)}
							/>
						</Field>

						<Field label="Téléphone d'assistance">
							<Input
								value={form.supportPhone ?? ""}
								disabled={!writable}
								onChange={(event) => set("supportPhone", event.target.value || null)}
								placeholder="+225 07 00 00 00"
							/>
						</Field>

						<Field
							label="Préfixe des numéros de commande"
							hint="Apparaît sur les factures : PF-1004."
						>
							<Input
								value={form.orderNumberPrefix}
								disabled={!writable}
								onChange={(event) => set("orderNumberPrefix", event.target.value)}
							/>
						</Field>

						<Checkbox
							label="Mode maintenance (la boutique n'accepte plus de commande)"
							checked={form.maintenanceMode}
							disabled={!writable}
							onChange={(event) => set("maintenanceMode", event.target.checked)}
						/>
					</div>
				</Card>

				<Card>
					<CardHeader title="Devises et langues" />
					<div className="flex flex-col gap-4 p-4">
						<Field label="Devise par défaut">
							<Select
								value={form.defaultCurrency}
								disabled={!writable}
								onChange={(event) =>
									set("defaultCurrency", event.target.value as StoreSettings["defaultCurrency"])
								}
								options={CURRENCY_CODES.map((code) => ({
									value: code,
									label: code.toUpperCase(),
								}))}
							/>
						</Field>

						<Field label="Devises proposées" hint="Affichées dans le sélecteur du storefront.">
							<div className="flex flex-wrap gap-4 rounded-md border border-line bg-raised p-3">
								{CURRENCY_CODES.map((code) => (
									<Checkbox
										key={code}
										label={code.toUpperCase()}
										disabled={!writable || code === form.defaultCurrency}
										checked={form.enabledCurrencies.includes(code)}
										onChange={(event) =>
											set(
												"enabledCurrencies",
												event.target.checked
													? [...form.enabledCurrencies, code]
													: form.enabledCurrencies.filter((item) => item !== code),
											)
										}
									/>
								))}
							</div>
						</Field>

						<Field label="Langue par défaut">
							<Select
								value={form.defaultLocale}
								disabled={!writable}
								onChange={(event) =>
									set("defaultLocale", event.target.value as StoreSettings["defaultLocale"])
								}
								options={LOCALES.map((locale) => ({
									value: locale,
									label: locale === "fr" ? "Français" : "English",
								}))}
							/>
						</Field>

						<Field label="Langues actives">
							<div className="flex flex-wrap gap-4 rounded-md border border-line bg-raised p-3">
								{LOCALES.map((locale) => (
									<Checkbox
										key={locale}
										label={locale === "fr" ? "Français" : "English"}
										disabled={!writable || locale === form.defaultLocale}
										checked={form.enabledLocales.includes(locale)}
										onChange={(event) =>
											set(
												"enabledLocales",
												event.target.checked
													? [...form.enabledLocales, locale]
													: form.enabledLocales.filter((item) => item !== locale),
											)
										}
									/>
								))}
							</div>
						</Field>
					</div>
				</Card>

				<Card>
					<CardHeader title="Stock" />
					<div className="flex flex-col gap-4 p-4">
						<Field
							label="Seuil d'alerte par défaut"
							hint="Appliqué aux articles qui n'en définissent pas."
						>
							<Input
								inputMode="numeric"
								value={String(form.defaultLowStockThreshold)}
								disabled={!writable}
								onChange={(event) =>
									set("defaultLowStockThreshold", Number(event.target.value) || 0)
								}
							/>
						</Field>

						<Field
							label="Durée de réservation pendant le paiement (minutes)"
							hint="Au-delà, le stock immobilisé par un paiement abandonné est libéré automatiquement."
						>
							<Input
								inputMode="numeric"
								value={String(form.stockReservationMinutes)}
								disabled={!writable}
								onChange={(event) =>
									set("stockReservationMinutes", Number(event.target.value) || 1)
								}
							/>
						</Field>
					</div>
				</Card>

				<Card>
					<CardHeader
						title="Taxes"
						description="Taux exprimés en pourcentage, inclus dans les prix affichés."
					/>
					<ul className="divide-y divide-[var(--border)]">
						{(taxes ?? []).length === 0 ? (
							<li className="px-4 py-6 text-center text-[13px] text-muted">
								Aucun taux configuré.
							</li>
						) : (
							(taxes ?? []).map((tax) => (
								<li key={tax.id} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
									<span className="min-w-0 flex-1">
										<span className="block truncate text-ink">{tax.name}</span>
										<span className="block text-[12px] text-subtle">
											{tax.countryCode ? tax.countryCode.toUpperCase() : "Tous pays"} ·{" "}
											{tax.isInclusive ? "Prix TTC" : "Prix HT"}
										</span>
									</span>

									{tax.isDefault && <Badge tone="info">Par défaut</Badge>}

									<span className="shrink-0 font-medium text-ink tabular">
										{(tax.rateBasisPoints / 100).toFixed(2)} %
									</span>
								</li>
							))
						)}
					</ul>
				</Card>
			</div>
		</>
	);
};

export default SettingsPage;
