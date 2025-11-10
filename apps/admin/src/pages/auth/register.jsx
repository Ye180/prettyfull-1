import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const Register = () => {
	const originalUrl = useHostname();

	const [tooglePassword, settooglePassword] = useState(true);
	const [toogleChecklist, settoogleChecklist] = useState(false);
	return (
		<Fragment>
			<Layout
				navbar={false}
				footer={false}
				title="Shotify - Register"
				description="Shotify - Register Desc"
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
											Commencez par créer votre compte gratuit
										</p>
									</div>

									<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
										<Form.Group
											className="mb-3"
											controlId="exampleForm.ControlInput1"
										>
											<Form.Label className="font-normal text__14 text-[#A3A3A3]">
												Prenom
											</Form.Label>
											<Form.Control
												type="text"
												placeholder="Entrer votre prénom"
												className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
											/>
										</Form.Group>
										<Form.Group
											className="mb-3"
											controlId="exampleForm.ControlInput1"
										>
											<Form.Label className="font-normal text__14 text-[#A3A3A3]">
												Nom
											</Form.Label>
											<Form.Control
												type="text"
												placeholder="Entrer votre nom"
												className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
											/>
										</Form.Group>
									</div>

									<Form.Group
										className="mb-3"
										controlId="exampleForm.ControlInput1"
									>
										<Form.Label className="font-normal text__14 text-[#A3A3A3]">
											Email
										</Form.Label>
										<Form.Control
											type="email"
											placeholder="Entrer email"
											className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
										/>
									</Form.Group>
									<Form.Group
										className="mb-3"
										controlId="exampleForm.ControlInput1"
									>
										<Form.Label className="font-normal text__14 text-[#A3A3A3]">
											Password
										</Form.Label>
										<div className="relative">
											<Form.Control
												type={tooglePassword ? "password" : "text"}
												placeholder="Entrer votre mot de passe"
												className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
											/>
											<img
												onClick={() => settooglePassword(!tooglePassword)}
												src={originalUrl + "/images/eye-slash.svg"}
												className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-4"
												alt=""
											/>
										</div>
									</Form.Group>

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
												Je suis en accord avec{" "}
												<a href="#!" className="text-Mtexttextbrand">
													la politique de confidentialité et les conditions
												</a>
											</span>
										</div>
									</div>

									<div className="text-center">
										<Link
											href="/auth/verification"
											className="rounded-xl inline-block text-center font-medium text__16 text-white py-[15px]! bg-black border-Mmbg-Mmaincolorgreen btnClass w-full cursor-pointer"
										>
											Inscription
										</Link>

										<div className="my-4 text-center">
											<p className="font-medium text__16 text-Mtexttextsecondary">
												J'ai deja un compte ?{" "}
												<Link class="text-Mmaincolorgreen " href="/auth/login">
													Se connecter
												</Link>
											</p>
										</div>

										{/* <div className="relative my-3">
											<div className="absolute left-0 w-full h-px -translate-y-1/2 top-1/2 bg-Mborderborderprimary"></div>
											<div className="relative inline-block px-4 py-2 bg-white text__14 text-Mtexttextinvert z-2">
												Or Sign Up with
											</div>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<a
												href="#!"
												className="relative inline-block px-3 py-2.5 w-full text-center rounded-lg border border-solid border-Mborderborderprimary"
											>
												<div className="flex items-center justify-center gap-3">
													<img
														src={originalUrl + "/images/Icon - Google.svg"}
														className=""
														alt=""
													/>
													<div className="relative font-medium z-2 text__16">
														Google
													</div>
												</div>
											</a>
											<a
												href="#!"
												className="relative inline-block px-3 py-2.5 w-full text-center rounded-lg border border-solid border-Mborderborderprimary"
											>
												<div className="flex items-center justify-center gap-3">
													<img
														src={originalUrl + "/images/facebook-3-2 1.svg"}
														className=""
														alt=""
													/>
													<div className="relative font-medium z-2 text__16">
														Facebook
													</div>
												</div>
											</a>
										</div> */}
									</div>
								</div>
							</Col>
						</Row>
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Register;
