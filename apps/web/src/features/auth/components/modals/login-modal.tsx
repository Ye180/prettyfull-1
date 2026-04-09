"use client";

import { EyesClosed, EyesOpen } from "@/components/icons/eyes-icon";
import { sdk } from "@/lib/api/sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input,
} from "@prettyfull/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../../schemas/login.schema";

interface LoginModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onLoginSuccess?: () => void;
}

export function LoginModal({
	open,
	onOpenChange,
	onLoginSuccess,
}: LoginModalProps) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			const loginResponse = await sdk.auth.login("customer", "emailpass", {
				email: data.email,
				password: data.password,
			});

			if (!loginResponse) {
				alert("Erreur lors de la connexion");
				return;
			}

			if (typeof loginResponse !== "string") {
				alert(
					"L'authentification nécessite des actions supplémentaires qui ne sont pas supportées.",
				);
				return;
			}

			// Succès - fermer le modal et appeler le callback
			reset();
			onOpenChange(false);

			// Attendre un peu pour que le modal se ferme avant de rediriger
			setTimeout(() => {
				if (onLoginSuccess) {
					onLoginSuccess();
				}
			}, 100);
		} catch (e: any) {
			console.error("Erreur de connexion:", e);
			alert(`Erreur lors de la connexion: ${e.message || e}`);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-[4rem]! font-bold text-center py-6">
						Connectez-vous pour continuer
					</DialogTitle>
					<DialogDescription className="text-center text-[1.4rem] text-gray-600">
						Vous devez être connecté pour accéder au checkout
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
					{/* Email */}
					<div className="space-y-2">
						<Input
							label="Email"
							type="email"
							placeholder="votre@email.com"
							{...register("email")}
							errorMessage={errors.email?.message}
							className="text-[1.4rem]"
						/>
					</div>

					{/* Password */}
					<div className="relative space-y-2">
						<Input
							label="Mot de passe"
							type={showPassword ? "text" : "password"}
							placeholder="••••••••"
							{...register("password")}
							errorMessage={errors.password?.message}
							className="text-[1.4rem]"
						/>
						{showPassword ? (
							<span
								className="absolute right-3 opacity-40 -translate-y-2.5 top-3/5 cursor-pointer"
								onClick={() => setShowPassword(false)}
							>
								<EyesClosed />
							</span>
						) : (
							<span
								className="absolute right-3 opacity-40 -translate-y-2.5 top-3/5 cursor-pointer"
								onClick={() => setShowPassword(true)}
							>
								<EyesOpen />
							</span>
						)}
						{/* <span className="absolute right-3 top-1/2 opacity-40 -translate-y-1/2">
							<EyesClosed />
						</span> */}
					</div>

					{/* Forgot password link */}
					<div className="flex justify-end">
						<Link
							href="/forgot-password"
							className="text-[1.3rem] text-gray-600 hover:text-black transition-colors"
							onClick={() => onOpenChange(false)}
						>
							Mot de passe oublié ?
						</Link>
					</div>

					{/* Submit button */}
					<Button
						type="submit"
						className="w-full bg-black hover:bg-black/90 text-white text-[1.6rem] py-6"
						disabled={isSubmitting}
						isLoading={isSubmitting}
					>
						Se connecter
					</Button>

					{/* Divider */}
					<div className="relative my-6">
						<div className="flex absolute inset-0 items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-[1.3rem]">
							<span className="px-4 text-gray-500 bg-white">ou</span>
						</div>
					</div>

					{/* Notice pour page complète */}
					<div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-[1.3rem] text-gray-700 text-center">
							Pas encore de compte ?{" "}
							<Link
								href="/create-account"
								className="font-semibold text-black underline hover:text-gray-700"
								onClick={() => onOpenChange(false)}
							>
								Créer un compte
							</Link>
						</p>
						<p className="text-[1.2rem] text-gray-500 text-center mt-2">
							ou{" "}
							<Link
								href="/login?callbackUrl=/checkout"
								className="text-black underline hover:text-gray-700"
								onClick={() => onOpenChange(false)}
							>
								accéder à la page de connexion complète
							</Link>
						</p>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
