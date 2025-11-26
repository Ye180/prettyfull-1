"use client";

import { AppleIcon } from "@/components/icons/apple-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { useActionEvent } from "@/hooks/use-action-event";
import { sdk } from "@/lib/api/sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@prettyfull/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { useCartStore } from "../../../../../../../packages/store/src/use-cart-store";
import Flex from "../../../../../../../packages/ui/src/layouts/helpers/flex";
import { loginSchema, type LoginFormData } from "../../schemas/login.schema";

export function LoginForm() {
	const router = useRouter();
	// const [callbackUrl] = useQueryState(
	// 	"callbackUrl",
	// 	parseAsString.withDefault("")
	// );

	const [callbackUrl] = useQueryState("callbackUrl");

	console.log("Callback URL:", callbackUrl);

	// // Redirige si déjà authentifié (ce hook existe déjà)
	// useAuthRedirect("/account");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const { startLoading, endLoading, loading } = useActionEvent();
	const { currentCartId } = useCartStore(); // 5. Obtenir l'ID du panier invité

	const onSubmit = async (data: LoginFormData) => {
		console.log("Login data submitted:", data);
		// another identity (for example, admin user)
		// exists with the same email. So, use the auth
		// flow to login and create a customer.

		// pousser sur "/checkout " si la reponse login est favorable et qu'il y a un panier en cours

		const loginResponse = await sdk.auth
			.login("customer", "emailpass", {
				email: data.email,
				password: data.password,
			})

			.catch((e) => {
				alert(`An error occurred while creating account: ${e}`);
			});

		if (!loginResponse) {
			return;
		}
		// Si un panier invité existe, le fusionner avec le compte utilisateur
		callbackUrl ? router.push(callbackUrl) : router.push("/");

		if (typeof loginResponse !== "string") {
			alert(
				"Authentication requires more actions, which isn't supported by this flow."
			);
			return;
		}
	};

	return (
		<Flex settings={{ justify: "center", isColumn: true }}>
			<header>
				<div className="space-y-8">
					<div className="mb-20">
						<h3>Welcome Back to Snaely</h3>
						<p className="text-neutral-500">
							Log in to your account to shopping the newest fashion style
						</p>
					</div>
					<Flex className="flex-col">
						<Button
							variant="outline"
							icon={<AppleIcon className="size-12" />}
							fullWidth
						>
							Continue with Apple
						</Button>
						<Button
							variant="outline"
							icon={<GoogleIcon className="size-11" />}
							fullWidth
						>
							Continue with Google
						</Button>
					</Flex>
					<Flex
						settings={{ align: "center" }}
						className="w-full my-12 font-medium text-center"
					>
						<div className="w-1/2 border-t border-black/10" />
						or
						<div className="w-1/2 border-t border-black/10" />
					</Flex>
				</div>
			</header>

			<form onSubmit={handleSubmit(onSubmit)}>
				<main>
					<div className="space-y-8">
						<Input
							label="Email"
							{...register("email")}
							errorMessage={errors.email?.message}
						/>
						<Input
							type="password"
							label="Password"
							{...register("password")}
							errorMessage={errors.password?.message}
						/>
					</div>
				</main>

				<Flex
					as="footer"
					settings={{ isColumn: true, align: "center", spacing: "gap-10" }}
					className="mt-[5.2rem]"
				>
					<Button type="submit" isLoading={loading} fullWidth>
						Login
					</Button>
					<p className="font-medium text-grey">
						Don't have an account?{" "}
						<Link href="/create-account" className="text-black underline">
							Create Account
						</Link>
					</p>
				</Flex>
			</form>
		</Flex>
	);
}
