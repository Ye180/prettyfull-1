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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useActionEvent } from "@/hooks/use-action-event";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { signIn } from "@/shared/lib/auth-client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";

const login = () => {
	const originalUrl = useHostname();

	const router = useRouter();

	// Redirect if already authenticated
	useAuthRedirect("/profile");

	const form = useForm();

	const { startLoading, endLoading, loading } = useActionEvent();

	const { control, handleSubmit } = form;

	const onSubmit = async (data) => {
		startLoading();
		const { error } = await signIn.email({
			email: data.email,
			password: data.password,
		});

		if (error) {
			// Handle error (e.g., show notification)
			console.error("Login error:", error);
			endLoading();
			return;
		}

		// Redirect to profile page after successful login
		endLoading();
		// router.push("/profile");
	};

	const [tooglePassword, settooglePassword] = useState(true);
	const [toogleChecklist, settoogleChecklist] = useState(false);
	return (
		<Fragment>
			<Layout
				navbar={false}
				footer={false}
				title="Shotify - Login"
				description="Shotify - Login Desc"
			>
				<section className="relative flex items-center justify-center w-full py-16 bg-Msurfacesurfacesecondary md:min-h-screen min-h-dvh">
					<Container>
						<Row className="justify-center">
							<Col md={5}>
								<div className="bg-white p-4 rounded-xl border border-Mborderborderprimary shadow-[0px_4px_6px_-2px_rgba(16,24,40,0.03)]">
									<div className="mb-10 text-center">
										<h4 className="font-bold text__32 font-BebasNeue">
											PRETTYFULL
										</h4>
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
															<Input placeholder="Email" {...field} />
														</FormControl>
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
															<Input placeholder="Mot de passe" {...field} />
														</FormControl>
													</FormItem>
												)}
											/>

											<div className="mb-6">
												<div
													className="flex items-center gap-2 cursor-pointer"
													onClick={() => settoogleChecklist(!toogleChecklist)}
												>
													<div
														className={
															"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
															(toogleChecklist
																? "border-Mmaincolorgreen bg-Mmaincolorgreen"
																: "border-[#A3A3A3]")
														}
													>
														<img
															src={originalUrl + "/images/check (3).svg"}
															className={
																toogleChecklist ? "opacity-100" : "opacity-0"
															}
															alt=""
														/>
													</div>
													<span className="text__16 text-Mtexttextsecondary">
														Rappelez-moi
													</span>
												</div>
											</div>
											<div className="text-center">
												<Button
													type="submit"
													className="flex items-center justify-center w-full py-4 font-medium text-center text-white bg-black cursor-pointer rounded-xl text__16 border-Mmbg-Mmaincolorgreen btnClass"
												>
													Connectez
												</Button>

												<div className="my-4 text-center">
													<p className="font-medium text__16 text-Mtexttextsecondary">
														Nouveau sur notre plateforme?{" "}
														<Link
															class="text-Mmaincolorgreen "
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

export default login;
