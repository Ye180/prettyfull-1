"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ApiRequestError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Field, Input } from "@/components/ui/primitives";

/**
 * Connexion au back-office.
 *
 * Le message d'échec reste volontairement générique - l'API ne distingue pas
 * un compte inexistant d'un mot de passe erroné, pour ne pas permettre
 * d'énumérer les adresses valides.
 */
const LoginPage = () => {
	const { login, user, isLoading } = useAuth();
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	// Une session déjà valide n'a rien à faire sur l'écran de connexion.
	useEffect(() => {
		if (!isLoading && user) router.replace("/");
	}, [isLoading, user, router]);

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			await login(email, password);
			router.replace("/");
		} catch (caught) {
			setError(
				caught instanceof ApiRequestError
					? caught.message
					: "Connexion impossible. Vérifiez que l'API est démarrée.",
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="flex min-h-dvh items-center justify-center px-4">
			<div className="w-full max-w-sm">
				<div className="mb-6 flex flex-col items-center gap-2 text-center">
					<span className="flex size-10 items-center justify-center rounded-lg bg-accent font-bold text-accent-ink">
						P
					</span>
					<h1 className="text-lg font-semibold tracking-tight text-ink">
						Administration PrettyFull
					</h1>
					<p className="text-[13px] text-muted">
						Connectez-vous avec votre compte back-office.
					</p>
				</div>

				<form
					onSubmit={onSubmit}
					className="flex flex-col gap-4 rounded-lg border border-line bg-raised p-5"
				>
					<Field label="Adresse e-mail" htmlFor="email" required>
						<Input
							id="email"
							type="email"
							autoComplete="username"
							required
							autoFocus
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="vous@prettyfull.shop"
						/>
					</Field>

					<Field label="Mot de passe" htmlFor="password" required>
						<Input
							id="password"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>
					</Field>

					{error && (
						<p
							role="alert"
							className="rounded-md bg-danger-soft px-3 py-2 text-[13px] text-danger"
						>
							{error}
						</p>
					)}

					<Button type="submit" variant="primary" loading={submitting}>
						Se connecter
					</Button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
