"use client";

import { useActionEvent } from "@/hooks/use-action-event";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@prettyfull/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import Flex from "../../../../../../../packages/ui/src/layouts/helpers/flex";
import { loginSchema, type LoginFormData } from "../../schemas/login.schema";

export function LoginForm() {
	const router = useRouter();

	const [callbackUrl] = useQueryState("callbackUrl");

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

	const onSubmit = async (data: LoginFormData) => {
		startLoading();
		endLoading();
		callbackUrl ? router.push(callbackUrl) : router.push("/");
	};

	return (
		<Flex settings={{ justify: "center", isColumn: true }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<main className="space-y-12">
					<div className="mb-16">
						<h3>Welcome Back to Snaely</h3>
						<p className="text-neutral-500">
							Log in to your account to shopping the newest fashion style
						</p>
					</div>
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
					<Button type="submit" isLoading={loading} fullWidth>
						Login
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
