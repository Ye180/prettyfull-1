/**
 * Client HTTP du storefront vers `/api/store`.
 *
 * Séparé de `shared/lib/client.ts` (axios, jeton en `localStorage`) parce que
 * les deux politiques de session diffèrent : ici, le jeton d'accès vit en
 * mémoire et la persistance passe par un cookie `httpOnly` inaccessible au
 * JavaScript — un XSS ne peut donc pas voler la session d'une cliente.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7777";

let accessToken: string | null = null;

export const setStoreAccessToken = (token: string | null): void => {
	accessToken = token;
};

export const getStoreAccessToken = (): string | null => accessToken;

export class StoreApiError extends Error {
	readonly status: number;
	readonly code: string;
	readonly details?: Record<string, string[]>;

	constructor(
		status: number,
		payload: { code: string; message: string; details?: Record<string, string[]> },
	) {
		super(payload.message);
		this.name = "StoreApiError";
		this.status = status;
		this.code = payload.code;
		this.details = payload.details;
	}
}

let refreshInFlight: Promise<boolean> | null = null;

/** Renouvellement de session, dédoublonné entre requêtes concurrentes. */
const refreshSession = async (): Promise<boolean> => {
	refreshInFlight ??= (async () => {
		try {
			const response = await fetch(`${BASE_URL}/api/store/auth/refresh`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: "{}",
			});

			if (!response.ok) {
				accessToken = null;
				return false;
			}

			const data = (await response.json()) as { accessToken: string };
			accessToken = data.accessToken;
			return true;
		} catch {
			accessToken = null;
			return false;
		} finally {
			queueMicrotask(() => {
				refreshInFlight = null;
			});
		}
	})();

	return refreshInFlight;
};

interface RequestOptions {
	method?: string;
	body?: unknown;
	/** Interne : coupe la boucle de renouvellement. */
	skipRefresh?: boolean;
	/** Routes publiques : inutile de tenter un renouvellement sur 401. */
	anonymous?: boolean;
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
	const { method = "GET", body, skipRefresh, anonymous } = options;

	const response = await fetch(`${BASE_URL}${path}`, {
		method,
		// Indispensable : le panier invité et la session cliente sont portés
		// par des cookies.
		credentials: "include",
		headers: {
			...(body !== undefined ? { "Content-Type": "application/json" } : {}),
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
		},
		...(body !== undefined ? { body: JSON.stringify(body) } : {}),
	});

	if (response.status === 401 && !skipRefresh && !anonymous) {
		if (await refreshSession()) {
			return request<T>(path, { ...options, skipRefresh: true });
		}
	}

	if (response.status === 204) return undefined as T;

	if (!response.ok) {
		const payload = (await response.json().catch(() => null)) as
			| { error?: { code: string; message: string; details?: Record<string, string[]> } }
			| null;

		throw new StoreApiError(
			response.status,
			payload?.error ?? {
				code: "HTTP_ERROR",
				message: `La requête a échoué (HTTP ${response.status}).`,
			},
		);
	}

	return (await response.json()) as T;
};

export const storeApi = {
	get: <T>(path: string, anonymous = true) => request<T>(path, { anonymous }),
	post: <T>(path: string, body?: unknown, anonymous = false) =>
		request<T>(path, { method: "POST", body, anonymous }),
	patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
	put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body }),
	delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
	refreshSession,
	baseUrl: BASE_URL,
};

/** Sérialise des paramètres en chaîne de requête, valeurs vides omises. */
export const toQuery = (params: Record<string, unknown>): string => {
	const search = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === "") continue;
		search.set(key, String(value));
	}

	const query = search.toString();
	return query ? `?${query}` : "";
};
