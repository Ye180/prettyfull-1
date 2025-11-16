import { z } from "zod";

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "L'email est requis")
		.email("Format d'email invalide"),
	password: z
		.string()
		.min(1, "Le mot de passe est requis")
		.min(6, "Le mot de passe doit contenir au moins 6 caractères"),
	rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schéma de validation pour l'inscription
 */
export const registerSchema = z.object({
	name: z
		.string()
		.min(1, "Le prénom est requis")
		.min(2, "Le prénom doit contenir au moins 2 caractères")
		.max(50, "Le prénom ne peut pas dépasser 50 caractères"),
	lastName: z
		.string()
		.min(1, "Le nom est requis")
		.min(2, "Le nom doit contenir au moins 2 caractères")
		.max(50, "Le nom ne peut pas dépasser 50 caractères"),
	email: z
		.string()
		.min(1, "L'email est requis")
		.email("Format d'email invalide"),
	password: z
		.string()
		.min(1, "Le mot de passe est requis")
		.min(8, "Le mot de passe doit contenir au moins 8 caractères")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
		),
	acceptTerms: z
		.boolean()
		.refine((val) => val === true, {
			message: "Vous devez accepter les conditions d'utilisation",
		}),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Schéma de validation pour la réinitialisation de mot de passe
 */
export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, "L'email est requis")
		.email("Format d'email invalide"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Schéma de validation pour le nouveau mot de passe
 */
export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, "Le mot de passe est requis")
			.min(8, "Le mot de passe doit contenir au moins 8 caractères")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
			),
		confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
