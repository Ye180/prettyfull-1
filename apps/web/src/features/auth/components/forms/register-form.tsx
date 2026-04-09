"use client";

import { EyesClosed, EyesOpen } from "@/components/icons/eyes-icon";
import { sdk } from "@/lib/api/sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { FetchError } from "@medusajs/js-sdk";
import { Button, Input } from "@prettyfull/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Flex from "../../../../../../../packages/ui/src/layouts/helpers/flex";
import {
	registerSchema,
	type RegisterFormData,
} from "../../schemas/register.schema";

export function RegisterForm() {
	const router = useRouter();

	// Redirect if already authenticated
	// useAuthRedirect("/account");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = async (data: RegisterFormData) => {
		if (!data.email || !data.password) {
			return;
		}
		setLoading(true);

		try {
			await sdk.auth.register("customer", "emailpass", {
				email: data.email,
				password: data.password,
			});
		} catch (error) {
			const fetchError = error as FetchError;

			if (
				fetchError.statusText !== "Unauthorized" ||
				fetchError.message !== "Identity with email already exists"
			) {
				alert(`An error occurred while creating account: ${fetchError}`);
				return;
			}
		}

		// create customer
		try {
			const { customer } = await sdk.store.customer.create({
				first_name: data.firstName,
				last_name: data.lastName,
				email: data.email,
			});

			setLoading(false);
			// TODO redirect to login page
		} catch (error) {
			console.error(error);
			alert("Error: " + error);
			return;
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
					<Button type="submit" fullWidth>
						Create Account
					</Button>
					<p className="font-medium text-grey">
						Already have an account?{" "}
						<Link href="/login" className="text-black underline">
							Login
						</Link>
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
