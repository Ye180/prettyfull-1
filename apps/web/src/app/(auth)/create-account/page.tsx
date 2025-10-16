// web/src/app/(auth)/create-account/page.tsx
"use client";

import { RegisterDto } from "@/features/auth/types/register.dto";
import { useRegister } from "@/hooks/useAuth";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AppleIcon } from "@/components/icons/apple-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Button, Input, Logo } from "@prettyfull/ui";

import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import Flex from "../../../../../../packages/ui/src/layouts/helpers/flex";

export default function RegisterPage() {
	const { mutate: registerUser, isPending, isError } = useRegister();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterDto>();

	const onSubmit = (data: RegisterDto) => {
		registerUser(data);
	};

	return (
		<Flex className="h-full w-full [&>*]:w-full ">
			<Container maxWidth="70rem" className="space-y-28">
				<Logo className="mt-20 " />
				<Flex settings={{ justify: "center", isColumn: true }}>
					<header>
						<div className="space-y-8">
							<h3>Create an account</h3>
							<Flex>
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
							<div className="grid grid-cols-2 gap-8">
								<Input
									label="First Name"
									{...register("firstName", {
										required: "First name is required",
									})}
									// errorMessage={errors.firstName?.message}
								/>
								<Input
									label="Last Name"
									{...register("lastName", {
										required: "Last name is required",
									})}
									// errorMessage={errors.lastName?.message}
								/>
								<div className="col-span-2">
									<Input
										label="Email"
										type="email"
										{...register("email", { required: "Email is required" })}
										// errorMessage={errors.email?.message}
									/>
								</div>
								<div className="col-span-2">
									<Input
										label="Password"
										type="password"
										{...register("password", {
											required: "Password is required",
										})}
										// errorMessage={errors.password?.message}
									/>
								</div>
							</div>
						</main>

						<Flex
							as="footer"
							settings={{ isColumn: true, align: "center", spacing: "gap-10" }}
							className="mt-[5.2rem]"
						>
							{isError && (
								<p className="text-center text-red-500">
									An error occurred while creating your account. Please try
									again.
								</p>
							)}

							<Button type="submit" fullWidth disabled={isPending}>
								{isPending ? "Creating Account..." : "Create Account"}
							</Button>
							<p className="font-medium text-grey">
								Already have an account?{" "}
								<Link href="/login" className="text-black underline">
									Login
								</Link>
							</p>
						</Flex>
					</form>
				</Flex>
			</Container>
		</Flex>
	);
}
