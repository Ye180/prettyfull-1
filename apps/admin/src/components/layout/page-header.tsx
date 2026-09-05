import type { ReactNode } from "react";
import Link from "next/link";
import { IconArrowLeft } from "@/components/icons";

/** En-tête de page : titre, sous-titre, actions, et retour éventuel. */
export const PageHeader = ({
	title,
	description,
	backHref,
	backLabel,
	actions,
}: {
	title: string;
	description?: string;
	backHref?: string;
	backLabel?: string;
	actions?: ReactNode;
}) => (
	<header className="mb-5">
		{backHref && (
			<Link
				href={backHref}
				className="mb-2 inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink"
			>
				<IconArrowLeft width={15} height={15} />
				{backLabel ?? "Retour"}
			</Link>
		)}

		<div className="flex flex-wrap items-start justify-between gap-3">
			<div className="min-w-0">
				<h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
				{description && <p className="mt-1 text-[13px] text-muted">{description}</p>}
			</div>
			{actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
		</div>
	</header>
);
