"use client";

import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Logo } from "@/features/shared/components/molecules/logo";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { loginSchema } from "@/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Login = () => {
	const originalUrl = useHostname();
	const router = useRouter();
	// const { showToast } = useToast();
	const { login, isLoading } = useAuth();

	// Redirect if already authenticated
	useAuthRedirect("/");

	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = form;

	const onSubmit = async (data) => {
		const result = await login(data);

		if (result.success) {
			toast("Connexion réussie ! Redirection...", "success");
			setTimeout(() => {
				router.push("/");
			}, 1000);
		} else {
			toast(result.error || "Échec de la connexion", "error");
		}
	};
	return (
		<Fragment>
			<Layout
				navbar={false}
				footer={false}
				title="Prettyfull - Login"
				description="Prettyfull - Login Desc"
			>
				<section className="relative flex items-center justify-center w-full py-16 bg-Msurfacesurfacesecondary md:min-h-screen min-h-dvh">
					<Container>
						<Row className="justify-center">
							<Col md={5}>
								<div className="bg-white p-4 rounded-xl border border-Mborderborderprimary shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
									<div className="flex flex-col items-center justify-center w-full mb-10 text-center ">
										<Logo />
										<p className="text__16 text-Mtexttextsecondary">
											Veuillez vous connecter à votre compte pour continuer
										</p>
									</div>
									<Form {...form}>
										<form
											onSubmit={handleSubmit(onSubmit)}
											className="space-y-6"
										>
											<FormField
												control={control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Email</FormLabel>
														<FormControl>
															<Input
																placeholder="exemple@email.com"
																{...field}
																disabled={isLoading}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={control}
												name="password"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Mot de passe</FormLabel>
														<FormControl>
															<div className="relative">
																<Input
																	type={showPassword ? "text" : "password"}
																	placeholder="••••••••"
																	{...field}
																	disabled={isLoading}
																/>
																<button
																	type="button"
																	onClick={() => setShowPassword(!showPassword)}
																	className="absolute -translate-y-1/2 right-3 top-1/2"
																	disabled={isLoading}
																>
																	<img
																		src={originalUrl + "/images/eye-slash.svg"}
																		alt="Toggle password visibility"
																		className="w-5 h-5"
																	/>
																</button>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={control}
												name="rememberMe"
												render={({ field }) => (
													<FormItem>
														<div className="flex items-center gap-2">
															<FormControl>
																<div
																	className={
																		"flex items-center justify-center w-6 h-6 rounded-sm border border-solid cursor-pointer " +
																		(field.value
																			? "border-Mmaincolorgreen bg-Mmaincolorgreen"
																			: "border-[#A3A3A3]")
																	}
																	onClick={() => field.onChange(!field.value)}
																>
																	<img
																		src={originalUrl + "/images/check (3).svg"}
																		className={
																			field.value ? "opacity-100" : "opacity-0"
																		}
																		alt=""
																	/>
																</div>
															</FormControl>
															<FormLabel
																className="mt-0! cursor-pointer"
																onClick={() => field.onChange(!field.value)}
															>
																<span className="text__16 text-Mtexttextsecondary">
																	Rappelez-moi
																</span>
															</FormLabel>
														</div>
													</FormItem>
												)}
											/>

											<div className="text-center">
												<Button
													type="submit"
													disabled={isLoading}
													className="flex items-center justify-center w-full py-4 font-medium text-center text-white bg-black cursor-pointer rounded-xl text__16 border-Mmbg-Mmaincolorgreen btnClass disabled:opacity-50 disabled:cursor-not-allowed"
												>
													{isLoading ? (
														<>
															<svg
																className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
																xmlns="http://www.w3.org/2000/svg"
																fill="none"
																viewBox="0 0 24 24"
															>
																<circle
																	className="opacity-25"
																	cx="12"
																	cy="12"
																	r="10"
																	stroke="currentColor"
																	strokeWidth="4"
																></circle>
																<path
																	className="opacity-75"
																	fill="currentColor"
																	d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																></path>
															</svg>
															Connexion...
														</>
													) : (
														"Connectez"
													)}
												</Button>

												<div className="my-4 text-center">
													<p className="font-medium text__16 text-Mtexttextsecondary">
														Nouveau sur notre plateforme?{" "}
														<Link
															className="text-Mmaincolorgreen"
															href="/auth/register"
														>
															Créer un compte
														</Link>
													</p>
												</div>
											</div>
										</form>
									</Form>
								</div>
							</Col>
						</Row>
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Login;
