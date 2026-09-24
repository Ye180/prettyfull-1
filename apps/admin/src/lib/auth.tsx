"use client";

import type { AuthResponse, Permission, User } from "@prettyfull/contracts";
import { useRouter } from "next/navigation";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { api, setAccessToken } from "./api";

/**
 * Session du back-office.
 *
 * Au montage, on tente un renouvellement silencieux : le jeton d'accès ne
 * survit pas au rechargement de l'onglet (il vit en mémoire), mais le cookie
 * de rafraîchissement, lui, persiste. C'est ce qui permet de rester connecté
 * sans jamais exposer de jeton au JavaScript de la page.
 */

interface AuthContextValue {
	user: User | null;
	/** `true` tant que la tentative de reprise de session n'a pas abouti. */
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	/** Vérifie une permission ; sert à masquer ce que l'API refuserait de toute façon. */
	can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	// En mode strict, React monte deux fois : sans ce garde, deux
	// renouvellements concurrents feraient tourner le jeton inutilement.
	const restored = useRef(false);

	useEffect(() => {
		if (restored.current) return;
		restored.current = true;

		void (async () => {
			try {
				const response = await api.post<AuthResponse>("/api/admin/auth/refresh", {});
				setAccessToken(response.accessToken);
				setUser(response.user);
			} catch {
				// Aucune session valide : l'utilisateur devra se connecter.
				setAccessToken(null);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		const response = await api.post<AuthResponse>("/api/admin/auth/login", {
			email,
			password,
		});

		setAccessToken(response.accessToken);
		setUser(response.user);
	}, []);

	const logout = useCallback(async () => {
		try {
			await api.post("/api/admin/auth/logout");
		} finally {
			// La session locale est effacée même si l'appel réseau échoue :
			// laisser l'écran connecté après un clic sur « Déconnexion » serait
			// pire que de perdre la révocation côté serveur.
			setAccessToken(null);
			setUser(null);
			router.replace("/login");
		}
	}, [router]);

	const can = useCallback(
		(permission: Permission) => user?.permissions.includes(permission) ?? false,
		[user],
	);

	const value = useMemo(
		() => ({ user, isLoading, login, logout, can }),
		[user, isLoading, login, logout, can],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider.");
	return context;
};

/**
 * Redirige vers la connexion si aucune session n'est active.
 *
 * Ce n'est qu'un confort de navigation : la véritable protection est côté
 * API, où chaque route vérifie le jeton et la permission.
 */
export const useRequireAuth = (): { user: User | null; isLoading: boolean } => {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !user) router.replace("/login");
	}, [isLoading, user, router]);

	return { user, isLoading };
};
