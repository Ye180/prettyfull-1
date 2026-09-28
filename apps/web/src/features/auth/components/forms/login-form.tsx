"use client";

import { StoreApiError } from "@/lib/store-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, toast } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("Auth.login");
	const router = useRouter();

	// Nom du paramètre posé par `proxy.ts` quand il bounce une route protégée
	// (`/account`, `/wishlist`, `/checkout`) vers `/login`.
	const [callbackUrl] = useQueryState("redirect");

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
				error instanceof StoreApiError ? error.message : t("error"),
			);
		}
	};

	return (
		<Flex settings={{ justify: "center", isColumn: true }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<main className="space-y-8">
					<div className="mb-8">
						<h3 className="text-[2.6rem]!">{t("title")}</h3>
						<p className="text-neutral-500">{t("subtitle")}</p>
					</div>
					<div className="space-y-6">
						<Input
							label={t("email")}
							{...register("email")}
							errorMessage={errors.email?.message}
							className="rounded-xl border-gray-200 focus:border-amber-600 transition-colors"
						/>
						<Input
							type="password"
							label={t("password")}
							{...register("password")}
							errorMessage={errors.password?.message}
							className="rounded-xl border-gray-200 focus:border-amber-600 transition-colors"
						/>
					</div>
					<Button
						type="submit"
						isLoading={loginMutation.isPending}
						fullWidth
						className="bg-amber-600 hover:bg-amber-700"
					>
						{t("submit")}
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
					className="mt-10"
				>
					<p className="font-medium text-grey">
						{t("noAccount")}{" "}
						{onSwitchMode ? (
							<button
								type="button"
								onClick={onSwitchMode}
								className="font-semibold text-amber-600 underline cursor-pointer"
							>
								{t("register")}
							</button>
						) : (
							<Link
								href="/create-account"
								className="font-semibold text-amber-600 underline"
							>
								{t("register")}
							</Link>
						)}
					</p>
				</Flex>
			</form>
		</Flex>
	);
}
