"use client";

import { EyesClosed, EyesOpen } from "@/components/icons/eyes-icon";
import { StoreApiError } from "@/lib/store-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, toast } from "@prettyfull/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Flex from "../../../../../../../packages/ui/src/layouts/helpers/flex";
import { useRegister } from "../../api/register";
import {
	registerSchema,
	type RegisterFormData,
} from "../../schemas/register.schema";

interface RegisterFormProps {
	/** Called instead of the default redirect on success — used by the quick-auth modal to close itself. */
	onSuccess?: () => void;
	/** Renders "Login" as a button instead of a Link — used by the quick-auth modal to switch mode in place. */
	onSwitchMode?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchMode }: RegisterFormProps = {}) {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const registerMutation = useRegister();
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = async (data: RegisterFormData) => {
		try {
			await registerMutation.mutateAsync(data);
			toast.success("Compte créé, bienvenue !");
			if (onSuccess) {
				onSuccess();
			} else {
				router.push("/account");
			}
		} catch (error) {
			toast.error(
				error instanceof StoreApiError
					? error.message
					: "Inscription impossible. Veuillez réessayer.",
			);
		}
	};

	return (
		<Flex settings={{ justify: "center", isColumn: true }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<main className="space-y-12">
					<h3>Create an account</h3>
					<div className="grid grid-cols-2 gap-8">
						<Input
							label="First Name"
							{...register("firstName")}
							errorMessage={errors.firstName?.message}
							className="h-fit"
						/>
						<Input
							label="Last Name"
							{...register("lastName")}
							errorMessage={errors.lastName?.message}
							className="h-fit"
						/>
						<div className="col-span-2">
							<Input
								label="Email"
								type="email"
								{...register("email")}
								errorMessage={errors.email?.message}
							/>
						</div>
						<div className="relative col-span-2">
							<Input
								label="Password"
								type={showPassword ? "text" : "password"}
								{...register("password")}
								errorMessage={errors.password?.message}
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
						</div>
					</div>
					{/* <Flex
						settings={{ align: "center" }}
						className="my-12 w-full font-medium text-center"
					>
						<div className="w-1/2 border-t border-black/10" />
						or
						<div className="w-1/2 border-t border-black/10" />
					</Flex> */}
				</main>

				<Flex
					as="footer"
					settings={{ isColumn: true, align: "center", spacing: "gap-10" }}
					className="mt-[5.2rem]"
				>
					<Button type="submit" isLoading={registerMutation.isPending} fullWidth>
						Create Account
					</Button>
					<p className="font-medium text-grey">
						Already have an account?{" "}
						{onSwitchMode ? (
							<button
								type="button"
								onClick={onSwitchMode}
								className="text-black underline cursor-pointer"
							>
								Login
							</button>
						) : (
							<Link href="/login" className="text-black underline">
								Login
							</Link>
						)}
					</p>
				</Flex>
			</form>
			<header>
				<div className="space-y-8">
					{/* <Flex className="max-md:flex-col">
						<Button
							variant="outline"
							icon={<AppleIcon className="size-12" />}
							fullWidth
							className="whitespace-nowrap"
						>
							Continue with Apple
						</Button>
						<Button
							variant="outline"
							icon={<GoogleIcon className="size-11" />}
							fullWidth
							className="whitespace-nowrap"
						>
							Continue with Google
						</Button>
					</Flex> */}
				</div>
			</header>
		</Flex>
	);
}
