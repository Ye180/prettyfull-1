"use client";

import type { LoginFormData, RegisterFormData } from "@/schemas/auth-schema";
import { authClient } from "@/shared/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

/**
 * Hook centralisé pour gérer l'authentification avec Better Auth
 * Inclut: login, register, logout, session management
 */
export function useAuth() {
	const router = useRouter();
	const { data: session, isPending, error: sessionError } = authClient.useSession();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Connexion avec email et mot de passe
	 */
	const login = useCallback(
		async (data: LoginFormData) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await authClient.signIn.email({
					email: data.email,
					password: data.password,
					rememberMe: data.rememberMe,
				});

				if (result.error) {
					// Gérer les différents types d'erreurs
					const errorMessage = getAuthErrorMessage(result.error);
					setError(errorMessage);
					setIsLoading(false);
					return { success: false, error: errorMessage };
				}

				setIsLoading(false);
				return { success: true, data: result.data };
			} catch (err: any) {
				const errorMessage =
					err?.message || "Une erreur est survenue lors de la connexion";
				setError(errorMessage);
				setIsLoading(false);
				return { success: false, error: errorMessage };
			}
		},
		[]
	);

	/**
	 * Inscription avec nom, email et mot de passe
	 */
	const register = useCallback(
		async (data: RegisterFormData) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await authClient.signUp.email({
					name: data.name,
					email: data.email,
					password: data.password,
					// Ajouter les champs additionnels si configurés dans Better Auth
					// @ts-ignore
					lastName: data.lastName,
				});

				if (result.error) {
					const errorMessage = getAuthErrorMessage(result.error);
					setError(errorMessage);
					setIsLoading(false);
					return { success: false, error: errorMessage };
				}

				setIsLoading(false);
				return { success: true, data: result.data };
			} catch (err: any) {
				const errorMessage =
					err?.message || "Une erreur est survenue lors de l'inscription";
				setError(errorMessage);
				setIsLoading(false);
				return { success: false, error: errorMessage };
			}
		},
		[]
	);

	/**
	 * Déconnexion
	 */
	const logout = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			await authClient.signOut();
			router.push("/auth/login");
			setIsLoading(false);
			return { success: true };
		} catch (err: any) {
			const errorMessage =
				err?.message || "Une erreur est survenue lors de la déconnexion";
			setError(errorMessage);
			setIsLoading(false);
			return { success: false, error: errorMessage };
		}
	}, [router]);

	/**
	 * Rafraîchir la session
	 */
	const refreshSession = useCallback(async () => {
		try {
			const result = await authClient.getSession();
			return result;
		} catch (err) {
			console.error("Erreur lors du rafraîchissement de la session:", err);
			return null;
		}
	}, []);

	/**
	 * Vérifier si l'utilisateur est authentifié
	 */
	const isAuthenticated = !!session && !isPending;

	/**
	 * Récupérer l'utilisateur courant
	 */
	const user = session?.user || null;

	return {
		// État
		session,
		user,
		isAuthenticated,
		isLoading: isLoading || isPending,
		error: error || sessionError?.message || null,

		// Actions
		login,
		register,
		logout,
		refreshSession,
		setError,
	};
}

/**
 * Convertir les erreurs Better Auth en messages utilisateur
 */
function getAuthErrorMessage(error: any): string {
	// Gérer les erreurs courantes
	if (typeof error === "string") {
		return error;
	}

	const errorCode = error?.code || error?.type;
	const errorMessage = error?.message;

	// Messages d'erreur personnalisés selon le code
	const errorMessages: Record<string, string> = {
		INVALID_EMAIL_OR_PASSWORD: "Email ou mot de passe incorrect",
		USER_NOT_FOUND: "Aucun compte associé à cet email",
		EMAIL_ALREADY_EXISTS: "Un compte existe déjà avec cet email",
		WEAK_PASSWORD: "Le mot de passe est trop faible",
		INVALID_EMAIL: "Format d'email invalide",
		ACCOUNT_LOCKED: "Votre compte a été verrouillé. Contactez le support",
		TOO_MANY_REQUESTS: "Trop de tentatives. Veuillez réessayer plus tard",
	};

	return errorMessages[errorCode] || errorMessage || "Une erreur est survenue";
}
