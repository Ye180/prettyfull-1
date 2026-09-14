"use client";

import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import { Button, Field } from "@/components/ui/primitives";

/**
 * Import CSV du catalogue (§4.2).
 *
 * Le fichier est systématiquement passé en simulation avant l'import réel :
 * un CSV de plusieurs centaines de lignes mérite un rapport d'erreurs avant
 * d'écrire quoi que ce soit en base.
 */
interface ImportReport {
	created: number;
	updated: number;
	skipped: number;
	errors: { line: number; slug: string; message: string }[];
	dryRun: boolean;
}

export const ImportDialog = ({
	open,
	onClose,
	onImported,
}: {
	open: boolean;
	onClose: () => void;
	onImported: () => void;
}) => {
	const { notify, notifyError } = useToast();
	const [csv, setCsv] = useState("");
	const [fileName, setFileName] = useState<string | null>(null);
	const [report, setReport] = useState<ImportReport | null>(null);

	const run = useMutation({
		mutationFn: (dryRun: boolean) =>
			api.post<ImportReport>("/api/admin/products/import", { csv, dryRun }),
		onSuccess: (result) => {
			setReport(result);

			if (!result.dryRun) {
				notify(`${result.created} créé(s), ${result.updated} mis à jour.`);
				onImported();
			}
		},
		onError: (error) => notifyError(error, "Import impossible."),
	});

	const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setFileName(file.name);
		setReport(null);
		setCsv(await file.text());
	};

	const close = () => {
		setCsv("");
		setFileName(null);
		setReport(null);
		onClose();
	};

	// L'import réel n'est proposé qu'après une simulation sans erreur bloquante.
	const canImport = report?.dryRun === true && csv.length > 0;

	return (
		<Dialog
			open={open}
			onClose={close}
			title="Importer un catalogue"
			description="Fichier CSV au format de l'export. Une ligne par point de stock."
			size="md"
			footer={
				<>
					<Button onClick={close}>Annuler</Button>
					<Button
						onClick={() => run.mutate(true)}
						disabled={!csv}
						loading={run.isPending && run.variables === true}
					>
						Simuler
					</Button>
					<Button
						variant="primary"
						onClick={() => run.mutate(false)}
						disabled={!canImport}
						loading={run.isPending && run.variables === false}
					>
						Importer
					</Button>
				</>
			}
		>
			<div className="flex flex-col gap-4">
				<Field
					label="Fichier CSV"
					hint="Colonnes attendues : slug, nom, regime, statut, categorie, prix, devise, variante, taille, stock…"
				>
					<input
						type="file"
						accept=".csv,text/csv"
						onChange={(event) => void onFile(event)}
						className="w-full rounded-md border border-line bg-raised px-2.5 py-2 text-[13px] file:mr-3 file:rounded file:border-0 file:bg-accent-soft file:px-2.5 file:py-1 file:text-[13px] file:text-ink"
					/>
				</Field>

				{fileName && (
					<p className="text-[13px] text-muted">
						{fileName} - {csv.split("\n").length - 1} ligne(s)
					</p>
				)}

				{report && (
					<div className="rounded-md border border-line bg-sunken p-3">
						<p className="text-[13px] font-medium text-ink">
							{report.dryRun ? "Simulation" : "Import terminé"}
						</p>
						<ul className="mt-1.5 space-y-0.5 text-[13px] text-muted">
							<li>{report.created} produit(s) à créer</li>
							<li>{report.updated} produit(s) à mettre à jour</li>
							{report.skipped > 0 && (
								<li className="text-danger">
									{report.skipped} ligne(s) ignorée(s)
								</li>
							)}
						</ul>

						{report.errors.length > 0 && (
							<div className="mt-2.5 max-h-40 overflow-y-auto border-t border-line pt-2">
								{report.errors.map((error, index) => (
									<p key={index} className="text-[12px] text-danger">
										Ligne {error.line} ({error.slug}) : {error.message}
									</p>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</Dialog>
	);
};
