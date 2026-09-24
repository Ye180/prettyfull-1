"use client";

import { StoreApiError } from "@/lib/store-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, toast } from "@prettyfull/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import Flex from "../../../../../../../packages/ui/src/layouts/helpers/flex";
import { useLogin } from "../../api/login";
import { loginSchema, type LoginFormData } from "../../schemas/login.schema";

interface LoginFormProps {
	/** Called instead of the default redirect on success - used by the quick-auth modal to close itself. */
	onSuccess?: () => void;
	/** Renders "Create Account" as a button instead of a Link - used by the quick-auth modal to switch mode in place. */
	onSwitchMode?: () => void;
}

export function LoginForm({ onSuccess, onSwitchMode }: LoginFormProps = {}) {
	const router = useRouter();

	const [callbackUrl] = useQueryState("callbackUrl");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const loginMutation = useLogin();

	const onSubmit = async (data: LoginFormData) => {
		try {
			await loginMutation.mutateAsync(data);
			if (onSuccess) {
				onSuccess();
			} else {
				router.push(callbackUrl ?? "/account");
			}
		} catch (error) {
			toast.error(
				error instanceof StoreApiError
					? error.message
					: "Connexion impossible. Veuillez réessayer.",
			);
		}
	};

	return (
		<Flex settings={{ justify: "center", isColumn: true }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<main className="space-y-12">
					<div className="mb-16">
						<h3>Bon retour sur PrettyFull</h3>
						<p className="text-neutral-500">
							Connectez-vous à votre compte pour découvrir les dernières
							tendances mode
						</p>
					</div>
					<div className="space-y-8">
						<Input
							label="E-mail"
							{...register("email")}
							errorMessage={errors.email?.message}
						/>
						<Input
							type="password"
							label="Mot de passe"
							{...register("password")}
							errorMessage={errors.password?.message}
						/>
					</div>
					<Button type="submit" isLoading={loginMutation.isPending} fullWidth>
						Connexion
					</Button>
				</main>
				<header>
					<div className="">
						{/* <Flex className="max-md:flex-col">
							<Button
								variant="outline"
								icon={<AppleIcon className="size-12" />}
								fullWidth
							>
								Continue with Apple
							</Button>
							<Button
								variant="outline"
								icon={<GoogleIcon className="size-8" />}
								fullWidth
							>
								Continue with Google
							</Button>
						</Flex> */}
					</div>
				</header>

				<Flex
					as="footer"
					settings={{ isColumn: true, align: "center", spacing: "gap-10" }}
					className="mt-[5.2rem]"
				>
					<p className="font-medium text-grey">
						Vous n'avez pas de compte ?{" "}
						{onSwitchMode ? (
							<button
								type="button"
								onClick={onSwitchMode}
								className="text-black underline cursor-pointer"
							>
								Créer un compte
							</button>
						) : (
							<Link href="/create-account" className="text-black underline">
								Créer un compte
							</Link>
						)}
					</p>
				</Flex>
			</form>
		</Flex>
	);
}
