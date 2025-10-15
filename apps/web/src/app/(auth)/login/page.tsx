"use client";

import { LoginDto } from "@/features/auth/types/login.dto";
import { useLogin } from "@/hooks/useAuth";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AppleIcon } from "@/components/icons/apple-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Button, Input, Logo } from "@prettyfull/ui";

import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import Flex from "../../../../../../packages/ui/src/layouts/helpers/flex";

export default function LoginPage() {
	const { mutate: login, isPending, isError } = useLogin();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginDto>();

	const onSubmit = (data: LoginDto) => {
		login(data);
	};

	return (
		<Flex className="h-full w-full [&>*]:w-full ">
			<Container maxWidth="70rem" className="space-y-28">
				<Logo className="mt-20 " />
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
									{...register("email", { required: "Email is required" })}
									// errorMessage={errors.email?.message}
								/>
								<Input
									type="password"
									label="Password"
									{...register("password", {
										required: "Password is required",
									})}
									// errorMessage={errors.password?.message}
								/>
							</div>
						</main>

						<Flex
							as="footer"
							settings={{ isColumn: true, align: "center", spacing: "gap-10" }}
							className="mt-[5.2rem]"
						>
							{isError && (
								<p className="text-center text-red-500">
									The email or password you entered is incorrect. Please try
									again.
								</p>
							)}
							<Button type="submit" fullWidth disabled={isPending}>
								{isPending ? "Logging in..." : "Login"}
							</Button>
							<p className="font-medium text-grey">
								Don’t have an account?{" "}
								<Link href="/create-account" className="text-black underline">
									Create Account
								</Link>
							</p>
						</Flex>
					</form>
				</Flex>
			</Container>
		</Flex>
	);
}
