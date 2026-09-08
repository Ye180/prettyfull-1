"use client";

import type { ProviderConfig, ShippingRate, ShippingZone } from "@prettyfull/contracts";
import { PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	Field,
	Input,
	Select,
	Spinner,
} from "@/components/ui/primitives";
import { IconCheck, IconAlert } from "@/components/icons";

/**
 * Module « Agrégateurs » (§4.6).
 *
 * L'écran est **généré depuis le registre du backend** : les champs de clés
 * viennent de `requiredCredentials`, exposé par l'API. Ajouter un prestataire
 * ne demande donc aucune modification ici — c'est ce qui rend vraie la
 * promesse « activable sans intervention technique » (§7).
 */

const ProviderCard = ({
	provider,
	kind,
	writable,
}: {
	provider: ProviderConfig;
	kind: "payment" | "shipping";
	writable: boolean;
}) => {
	const queryClient = useQueryClient();
	const { notify, notifyError } = useToast();

	const [credentials, setCredentials] = useState<Record<string, string>>({});
	const [environment, setEnvironment] = useState(provider.environment);

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: ["providers"] });
	};

	const save = useMutation({
		mutationFn: (payload: Record<string, unknown>) =>
			api.patch<ProviderConfig>(`/api/admin/integrations/${kind}/${provider.key}`, payload),
		onSuccess: () => {
			refresh();
			setCredentials({});
			notify(`${provider.name} mis à jour.`);
		},
		// L'API refuse l'activation tant qu'une clé obligatoire manque, en
		// nommant les clés absentes.
		onError: (error) => notifyError(error, "Mise à jour impossible."),
	});

	const test = useMutation({
		mutationFn: () =>
			api.post<{ ok: boolean; message: string }>(
				`/api/admin/integrations/${kind}/${provider.key}/test`,
			),
		onSuccess: (result) => notify(result.message, result.ok ? "success" : "error"),
		onError: (error) => notifyError(error, "Test impossible."),
	});

	return (
		<Card>
			<CardHeader
				title={provider.name}
				description={provider.description ?? undefined}
				action={
					<div className="flex items-center gap-2">
						{provider.isConfigured ? (
							<Badge tone="info">Configuré</Badge>
						) : (
							<Badge tone="warning">Clés manquantes</Badge>
						)}
						<Badge tone={provider.isEnabled ? "success" : "neutral"}>
							{provider.isEnabled ? "Actif" : "Inactif"}
						</Badge>
					</div>
				}
			/>

			<div className="flex flex-col gap-4 p-4">
				{provider.requiredCredentials.length > 0 ? (
					provider.requiredCredentials.map((field) => {
						const alreadySet = provider.configuredKeys.includes(field.key);

						return (
							<Field
								key={field.key}
								label={field.label}
								hint={
									alreadySet
										? "Déjà enregistrée. Laissez vide pour la conserver, saisissez une nouvelle valeur pour la remplacer."
										: undefined
								}
							>
								<div className="flex items-center gap-2">
									{alreadySet && (
										<span className="text-success" aria-label="Renseignée">
											<IconCheck width={16} height={16} />
										</span>
									)}
									<Input
										type={field.secret ? "password" : "text"}
										value={credentials[field.key] ?? ""}
										disabled={!writable}
										onChange={(event) =>
											setCredentials({ ...credentials, [field.key]: event.target.value })
										}
										placeholder={alreadySet ? "••••••••••••" : `Coller la ${field.label.toLowerCase()}`}
										autoComplete="off"
									/>
								</div>
							</Field>
						);
					})
				) : (
					<p className="text-[13px] text-muted">
						Cet agrégateur ne demande aucune clé.
					</p>
				)}

				<Field label="Environnement">
					<Select
						value={environment}
						disabled={!writable}
						onChange={(event) =>
							setEnvironment(event.target.value as ProviderConfig["environment"])
						}
						options={[
							{ value: "test", label: "Test (bac à sable)" },
							{ value: "live", label: "Production" },
						]}
					/>
				</Field>

				{provider.webhookUrl && (
					<Field
						label="URL de notification"
						hint="À déclarer dans le tableau de bord du prestataire pour qu'il confirme les paiements."
					>
						<Input readOnly value={provider.webhookUrl} className="font-mono text-[12px]" />
					</Field>
				)}

				{writable && (
					<div className="flex flex-wrap gap-2">
						<Button
							onClick={() =>
								save.mutate({
									environment,
									...(Object.keys(credentials).length > 0 ? { credentials } : {}),
								})
							}
							loading={save.isPending}
						>
							Enregistrer
						</Button>

						<Button onClick={() => test.mutate()} loading={test.isPending}>
							Tester la connexion
						</Button>

						<Button
							variant={provider.isEnabled ? "danger" : "primary"}
							onClick={() =>
								save.mutate({
									isEnabled: !provider.isEnabled,
									environment,
									...(Object.keys(credentials).length > 0 ? { credentials } : {}),
								})
							}
							loading={save.isPending}
						>
							{provider.isEnabled ? "Désactiver" : "Activer"}
						</Button>
					</div>
				)}

				{!provider.isConfigured && !provider.isEnabled && (
					<p className="flex items-start gap-1.5 text-[12px] text-warning">
						<IconAlert width={14} height={14} className="mt-0.5 shrink-0" />
						L’activation est bloquée tant que les clés obligatoires ne sont pas
						renseignées — un agrégateur incomplet produirait des paiements en échec.
					</p>
				)}
			</div>
		</Card>
	);
};

type ZoneWithRates = ShippingZone & { rates: ShippingRate[] };

const IntegrationsPage = () => {
	const { can } = useAuth();
	const writable = can(PERMISSIONS.integrations.write);

	const { data: payment, isLoading: loadingPayment } = useQuery({
		queryKey: ["providers", "payment"],
		queryFn: () => api.get<ProviderConfig[]>("/api/admin/integrations/payment"),
	});

	const { data: shipping } = useQuery({
		queryKey: ["providers", "shipping"],
		queryFn: () => api.get<ProviderConfig[]>("/api/admin/integrations/shipping"),
	});

	const { data: zones } = useQuery({
		queryKey: ["shipping-zones"],
		queryFn: () => api.get<ZoneWithRates[]>("/api/admin/shipping/zones"),
	});

	return (
		<>
			<PageHeader
				title="Agrégateurs"
				description="Moyens de paiement et transporteurs. Les clés sont chiffrées et ne sont jamais réaffichées."
			/>

			<section className="mb-6">
				<h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-subtle">
					Paiement
				</h2>
				{loadingPayment ? (
					<Spinner />
				) : (
					<div className="grid gap-4 xl:grid-cols-2">
						{(payment ?? []).map((provider) => (
							<ProviderCard
								key={provider.key}
								provider={provider}
								kind="payment"
								writable={writable}
							/>
						))}
					</div>
				)}
			</section>

			<section className="mb-6">
				<h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-subtle">
					Livraison
				</h2>
				<div className="grid gap-4 xl:grid-cols-2">
					{(shipping ?? []).map((provider) => (
						<ProviderCard
							key={provider.key}
							provider={provider}
							kind="shipping"
							writable={writable}
						/>
					))}
				</div>
			</section>

			<section>
				<h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-subtle">
					Zones et tarifs de livraison
				</h2>

				<div className="grid gap-4 xl:grid-cols-2">
					{(zones ?? []).map((zone) => (
						<Card key={zone.id}>
							<CardHeader
								title={zone.name}
								description={zone.countryCodes.map((code) => code.toUpperCase()).join(", ")}
								action={
									<Badge tone={zone.isActive ? "success" : "neutral"}>
										{zone.isActive ? "Active" : "Inactive"}
									</Badge>
								}
							/>
							<ul className="divide-y divide-[var(--border)]">
								{zone.rates.length === 0 ? (
									<li className="px-4 py-3 text-[13px] text-muted">Aucun tarif défini.</li>
								) : (
									zone.rates.map((rate) => (
										<li
											key={rate.id}
											className="flex items-center gap-3 px-4 py-2.5 text-[13px]"
										>
											<span className="min-w-0 flex-1">
												<span className="block truncate text-ink">{rate.name}</span>
												<span className="block text-[12px] text-subtle">
													{rate.kind === "flat"
														? "Montant fixe"
														: rate.kind === "weight"
															? `Par poids (${rate.minWeightGrams ?? 0}–${rate.maxWeightGrams ?? "∞"} g)`
															: "Calculé par le transporteur"}
													{rate.freeAboveTotal !== null &&
														` · offert dès ${formatMoney(rate.freeAboveTotal, rate.currency)}`}
												</span>
											</span>
											<span className="shrink-0 font-medium text-ink tabular">
												{formatMoney(rate.amount, rate.currency)}
											</span>
										</li>
									))
								)}
							</ul>
						</Card>
					))}
				</div>
			</section>
		</>
	);
};

export default IntegrationsPage;
