import type { ApiError } from "@prettyfull/contracts";

/**
 * Client HTTP du back-office.
 *
 * Trois responsabilités, et rien d'autre : porter le jeton d'accès, renouveler
 * la session quand il expire, et transformer l'enveloppe d'erreur de l'API en
 * exception typée que les formulaires savent exploiter champ par champ.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7777";

/**
 * Le jeton d'accès vit en mémoire, jamais dans `localStorage`.
 *
 * La persistance de session est assurée par le cookie de rafraîchissement
 * `httpOnly`, hors de portée de tout script : un XSS ne peut donc pas
 * exfiltrer de session. Le coût est un appel `/refresh` au chargement de
 * l'onglet, ce qui est le bon compromis pour un back-office.
 */
let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
	accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

/** Erreur d'API, porteuse du code métier et du détail par champ. */
export class ApiRequestError extends Error {
	readonly status: number;
	readonly code: string;
	readonly details?: Record<string, string[]>;

	constructor(status: number, payload: ApiError["error"]) {
		super(payload.message);
		this.name = "ApiRequestError";
		this.status = status;
		this.code = payload.code;
		this.details = payload.details;
	}

	/** Premier message d'erreur associé à un champ de formulaire. */
	fieldError(field: string): string | undefined {
		return this.details?.[field]?.[0];
	}
}

interface RequestOptions extends Omit<RequestInit, "body"> {
	body?: unknown;
	/** Interne : empêche une boucle de renouvellement infinie. */
	skipRefresh?: boolean;
}

/**
 * Renouvellement de session, dédupliqué.
 *
 * Plusieurs requêtes peuvent expirer en même temps (un tableau de bord tire
 * cinq ressources au chargement) : sans cette promesse partagée, chacune
 * déclencherait sa propre rotation de jeton et invaliderait celle des autres.
 */
let refreshInFlight: Promise<boolean> | null = null;

const refreshSession = async (): Promise<boolean> => {
	refreshInFlight ??= (async () => {
		try {
			const response = await fetch(`${BASE_URL}/api/admin/auth/refresh`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: "{}",
			});

			if (!response.ok) {
				setAccessToken(null);
				return false;
			}

			const data = (await response.json()) as { accessToken: string };
			setAccessToken(data.accessToken);
			return true;
		} catch {
			setAccessToken(null);
			return false;
		} finally {
			// Libéré dans un micro-tâche pour que les appelants concurrents
			// partagent bien la même promesse.
			queueMicrotask(() => {
				refreshInFlight = null;
			});
		}
	})();

	return refreshInFlight;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
	const { body, skipRefresh, headers, ...init } = options;

	const response = await fetch(`${BASE_URL}${path}`, {
		...init,
		credentials: "include",
		headers: {
			...(body !== undefined ? { "Content-Type": "application/json" } : {}),
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...headers,
		},
		...(body !== undefined ? { body: JSON.stringify(body) } : {}),
	});

	// 401 : le jeton a expiré. On renouvelle une fois, puis on rejoue.
	if (response.status === 401 && !skipRefresh) {
		if (await refreshSession()) {
			return request<T>(path, { ...options, skipRefresh: true });
		}
	}

	if (response.status === 204) return undefined as T;

	const contentType = response.headers.get("content-type") ?? "";

	if (!response.ok) {
		if (contentType.includes("application/json")) {
			const payload = (await response.json().catch(() => null)) as ApiError | null;
			if (payload?.error) throw new ApiRequestError(response.status, payload.error);
		}

		throw new ApiRequestError(response.status, {
			code: "HTTP_ERROR",
			message: `La requête a échoué (HTTP ${response.status}).`,
		});
	}

	if (!contentType.includes("application/json")) {
		return (await response.text()) as T;
	}

	return (await response.json()) as T;
};

/** Sérialise des filtres en chaîne de requête, en omettant les valeurs vides. */
export const toQueryString = (params: Record<string, unknown>): string => {
	const search = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}

	const query = search.toString();
	return query ? `?${query}` : "";
};

export const api = {
	get: <T>(path: string) => request<T>(path),
	post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
	patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
	put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
	delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
	refreshSession,
	baseUrl: BASE_URL,
};
