import type { SVGProps } from "react";

/**
 * Jeu d'icônes du panel.
 *
 * Écrites à la main plutôt qu'importées d'une bibliothèque : le back-office
 * n'en utilise qu'une vingtaine, et les embarquer en SVG inline évite une
 * dépendance et le chargement d'un catalogue entier pour quelques traits.
 *
 * Toutes partagent la même grille 24×24 et un trait de 1,75 - c'est ce qui
 * les fait lire comme un ensemble cohérent.
 */
type IconProps = SVGProps<SVGSVGElement>;

const Icon = ({ children, ...props }: IconProps) => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.75"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		{...props}
	>
		{children}
	</svg>
);

export const IconDashboard = (p: IconProps) => (
	<Icon {...p}>
		<rect x="3" y="3" width="7" height="9" rx="1.5" />
		<rect x="14" y="3" width="7" height="5" rx="1.5" />
		<rect x="14" y="12" width="7" height="9" rx="1.5" />
		<rect x="3" y="16" width="7" height="5" rx="1.5" />
	</Icon>
);

export const IconCatalog = (p: IconProps) => (
	<Icon {...p}>
		<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
		<path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
	</Icon>
);

export const IconStock = (p: IconProps) => (
	<Icon {...p}>
		<path d="M3 8h18M3 8v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8l2-4h14l2 4" />
		<path d="M10 12h4" />
	</Icon>
);

export const IconOrders = (p: IconProps) => (
	<Icon {...p}>
		<path d="M6 2h12l1.5 4.5H4.5z" />
		<path d="M4.5 6.5h15V20a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" />
		<path d="M9.5 10.5a2.5 2.5 0 0 0 5 0" />
	</Icon>
);

export const IconCustomers = (p: IconProps) => (
	<Icon {...p}>
		<circle cx="9" cy="8" r="3.25" />
		<path d="M2.75 20a6.25 6.25 0 0 1 12.5 0" />
		<path d="M16 5.5a3.25 3.25 0 0 1 0 6M17.5 14.75A5.5 5.5 0 0 1 21.25 20" />
	</Icon>
);

export const IconPlug = (p: IconProps) => (
	<Icon {...p}>
		<path d="M9 2v6M15 2v6" />
		<path d="M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6z" />
		<path d="M12 17v5" />
	</Icon>
);

export const IconContent = (p: IconProps) => (
	<Icon {...p}>
		<rect x="3" y="4" width="18" height="16" rx="2" />
		<path d="M3 9h18M8 13h8M8 16.5h5" />
	</Icon>
);

export const IconPromo = (p: IconProps) => (
	<Icon {...p}>
		<path d="M20 12.5 12.5 20a1.5 1.5 0 0 1-2.12 0l-6.38-6.38a1.5 1.5 0 0 1 0-2.12L11.5 4h6A2.5 2.5 0 0 1 20 6.5z" />
		<circle cx="15.5" cy="8.5" r="1.5" />
	</Icon>
);

export const IconShield = (p: IconProps) => (
	<Icon {...p}>
		<path d="M12 2.75 4.5 6v6c0 4.5 3.2 7.9 7.5 9.25 4.3-1.35 7.5-4.75 7.5-9.25V6z" />
		<path d="m9 12 2 2 4-4" />
	</Icon>
);

export const IconSettings = (p: IconProps) => (
	<Icon {...p}>
		<circle cx="12" cy="12" r="3" />
		<path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-1 1.47V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.6 15a1.6 1.6 0 0 0-1.47-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.33-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 9 4.72 1.6 1.6 0 0 0 10 3.25V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.28 9v.05a1.6 1.6 0 0 0 1.47 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
	</Icon>
);

export const IconPlus = (p: IconProps) => (
	<Icon {...p}>
		<path d="M12 5v14M5 12h14" />
	</Icon>
);

export const IconSearch = (p: IconProps) => (
	<Icon {...p}>
		<circle cx="11" cy="11" r="7" />
		<path d="m20 20-3.5-3.5" />
	</Icon>
);

export const IconChevronDown = (p: IconProps) => (
	<Icon {...p}>
		<path d="m6 9 6 6 6-6" />
	</Icon>
);

export const IconChevronRight = (p: IconProps) => (
	<Icon {...p}>
		<path d="m9 6 6 6-6 6" />
	</Icon>
);

export const IconChevronLeft = (p: IconProps) => (
	<Icon {...p}>
		<path d="m15 6-6 6 6 6" />
	</Icon>
);

export const IconArrowLeft = (p: IconProps) => (
	<Icon {...p}>
		<path d="M19 12H5M11 6l-6 6 6 6" />
	</Icon>
);

export const IconTrash = (p: IconProps) => (
	<Icon {...p}>
		<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
		<path d="M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M10 11v6M14 11v6" />
	</Icon>
);

export const IconEdit = (p: IconProps) => (
	<Icon {...p}>
		<path d="M12 20h9" />
		<path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
	</Icon>
);

export const IconCopy = (p: IconProps) => (
	<Icon {...p}>
		<rect x="9" y="9" width="12" height="12" rx="2" />
		<path d="M5 15V5a2 2 0 0 1 2-2h10" />
	</Icon>
);

export const IconCheck = (p: IconProps) => (
	<Icon {...p}>
		<path d="m5 13 4 4L19 7" />
	</Icon>
);

export const IconX = (p: IconProps) => (
	<Icon {...p}>
		<path d="M6 6l12 12M18 6 6 18" />
	</Icon>
);

export const IconAlert = (p: IconProps) => (
	<Icon {...p}>
		<path d="M12 3.5 22 20H2z" />
		<path d="M12 9.5v4.5M12 17.2v.01" />
	</Icon>
);

export const IconDownload = (p: IconProps) => (
	<Icon {...p}>
		<path d="M12 3v12M7.5 11 12 15.5 16.5 11" />
		<path d="M4 19.5h16" />
	</Icon>
);

export const IconUpload = (p: IconProps) => (
	<Icon {...p}>
		<path d="M12 16V4M7.5 8.5 12 4l4.5 4.5" />
		<path d="M4 19.5h16" />
	</Icon>
);

export const IconLogout = (p: IconProps) => (
	<Icon {...p}>
		<path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
		<path d="M10 17l-5-5 5-5M5 12h11" />
	</Icon>
);

export const IconExternal = (p: IconProps) => (
	<Icon {...p}>
		<path d="M14 4h6v6M20 4l-9 9" />
		<path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
	</Icon>
);

export const IconSpinner = (p: IconProps) => (
	<Icon {...p} className={`animate-spin ${p.className ?? ""}`}>
		<path d="M12 3a9 9 0 1 0 9 9" />
	</Icon>
);

export const IconMenu = (p: IconProps) => (
	<Icon {...p}>
		<path d="M4 7h16M4 12h16M4 17h16" />
	</Icon>
);

export const IconFilter = (p: IconProps) => (
	<Icon {...p}>
		<path d="M3 5h18l-7 8v6l-4 2v-8z" />
	</Icon>
);
