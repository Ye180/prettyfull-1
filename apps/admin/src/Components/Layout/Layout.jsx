import { Logo } from "@/features/shared/components/molecules/logo";
import { LINK_ROUTES } from "@/shared/constantes/constantes-link";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Container } from "react-bootstrap";
import { ReactSVG } from "react-svg";
import ModalLogout from "../Modal/ModalLogout";
import useHostname from "../Provider/HostnameProvider";

const MenuProfile = ({
	toogleMenuProfile,
	originalUrl,
	handleShow,
	addClass,
	settoogleMenuProfile,
}) => {
	// Function to handle the click event for the Log Out option
	return (
		<div className={addClass}>
			<div
				className={
					"absolute w-full ss:w-[350px] px-4 pt-2 ss:pt-6! pb-4 bg-white left-0 ss:left-auto ss:right-[15px]  rounded-md shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] transition-all duration-300 flex flex-wrap gap-3 " +
					(toogleMenuProfile
						? "top-[60px] opacity-100"
						: " top-40 opacity-0 pointer-events-none")
				}
			>
				<div className="w-full h-px bg-Mborderborderprimary"></div>
				<Link
					href="/setting/profile"
					onClick={() => settoogleMenuProfile(!toogleMenuProfile)}
					className="inline-block w-full"
				>
					<div className="flex items-center gap-2">
						<div className={"text-Mgray800"}>
							<ReactSVG src={originalUrl + "/images/pc (3).svg"} />
						</div>
						<p className="font-medium text__16">Profile</p>
					</div>
				</Link>
				<div className="w-full h-px bg-Mborderborderprimary"></div>
				<Link
					href="/setting"
					onClick={() => settoogleMenuProfile(!toogleMenuProfile)}
					className="inline-block w-full"
				>
					<div className="flex items-center gap-2">
						<div className={"text-Mgray800"}>
							<ReactSVG src={originalUrl + "/images/pc (5).svg"} />
						</div>
						<p className="font-medium text__16">Setting</p>
					</div>
				</Link>
				<div className="w-full h-px bg-Mborderborderprimary"></div>
				<Link href="/homepage">Gestion Accueil</Link>
				<div className="w-full h-px bg-Mborderborderprimary"></div>

				<Link
					href={{
						pathname: "/setting/profile",
						query: { url: "Billing & Plans" }, // Keep query empty to avoid showing it in the URL
					}}
					onClick={() => settoogleMenuProfile(!toogleMenuProfile)}
					className="inline-block w-full"
				>
					<div className="flex items-center gap-2">
						<div className={"text-Mgray800"}>
							<ReactSVG src={originalUrl + "/images/pc (4).svg"} />
						</div>
						<p className="font-medium text__16">Billing</p>
					</div>
				</Link>
				<div className="w-full h-px bg-Mborderborderprimary"></div>
				<a
					href="#!"
					onClick={() => settoogleMenuProfile(!toogleMenuProfile)}
					className="inline-block w-full"
				>
					<div className="flex items-center gap-2">
						<div className={"text-Mgray800"}>
							<ReactSVG src={originalUrl + "/images/pc (1).svg"} />
						</div>
						<p className="font-medium text__16">FAQ</p>
					</div>
				</a>
				<div className="w-full h-px bg-Mborderborderprimary"></div>
				<div
					onClick={handleShow}
					className="inline-block w-full cursor-pointer"
				>
					<div className="flex items-center gap-2">
						<div className={"text-Mgray800"}>
							<ReactSVG src={originalUrl + "/images/pc (2).svg"} />
						</div>
						<p className="font-medium text__16">Log Out</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const Layout = ({
	children,
	title = "Shotify",
	description = "Shotify Desc",
	navbar = true,
	footer = true,
	dashboard = false,
}) => {
	const originalUrl = useHostname();

	const router = useRouter();
	const isActive = (path) => router.pathname.startsWith(path);
	const [toogleMenuProfile, settoogleMenuProfile] = useState(false);
	const [toogleSideMenu, settoogleSideMenu] = useState(false);
	const [toogleSearch, settoogleSearch] = useState(false);

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<Fragment>
			<Head>
				<title>{title}</title>
				<meta name="title" content={title} />
				<meta name="description" content={description} />

				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
					rel="stylesheet"
				/>

				<link
					rel="stylesheet"
					href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css"
					integrity="sha384-nqKJ5nHQQgPTNwI0kPcbbP5MVPFozG6gZWybZ+Wgt0+QlMJnM1D8l12wXRXx8yFJ"
					crossOrigin="anonymous"
				/>
			</Head>

			<ModalLogout
				title={""}
				onHideClick={handleClose}
				show={show}
				onHide={handleClose}
				centered
				size="md"
			/>

			<div className="w-full min-h-screen overflow-hidden bg-MNeutral-50">
				{dashboard ? (
					<Fragment>
						<div className="w-full overflow-hidden min-h-dvh md:min-h-screen text-decoration-none">
							<div
								className={
									"w-[248px] h-dvh md:h-screen bg-Msurfacesurfacesecondary border-r border-Mborderborderprimary fixed z-99 top-0 px-3 py-6  transition-all duration-300 " +
									(toogleSideMenu ? "left-0" : "-left-[400px] lg:left-0")
								}
							>
								<div className="flex flex-wrap h-full gap-y-4">
									<div className="w-full space-y-4">
										<Logo />

										<div className="grid grid-cols-1 gap-2 pt-10">
											{LINK_ROUTES.map((link, index) => (
												<Link
													key={index}
													href={link.path}
													className={
														"  flex flex-row space-x-2 items-center py-3 text-black text-decoration-none " +
														(isActive(link.path) &&
														router.pathname === link.path
															? "bg-white border-l border-black text-black font-bold"
															: "text-Mtexttextsecondary")
													}
												>
													{link.icon && <link.icon className="" />}
													<p className=" h-fit m-0!">{link.name}</p>
												</Link>
											))}
										</div>
									</div>

									<div className="self-end w-full">
										<div className="grid grid-cols-1 gap-2">
											<Link
												href="/setting"
												className={
													"pl-3 pr-4 py-2 flex items-center gap-3 " +
													(isActive("/setting")
														? "bg-white border-l border-Mmaincolorgreen text-Mtexttextprimary"
														: "text-Mtexttextprimary")
												}
											>
												<div className={"text-Msurfacesurfaceinvert"}>
													<ReactSVG src={originalUrl + "/images/GearSix.svg"} />
												</div>
												<p className="font-medium text__16 ">Parametre</p>
											</Link>
											<div
												onClick={handleShow}
												className={
													"cursor-pointer  pl-3 pr-4 py-2 flex items-center gap-3 text-Mtexttextprimary"
												}
											>
												<div className={"text-Msurfacesurfaceinvert"}>
													<ReactSVG src={originalUrl + "/images/SignOut.svg"} />
												</div>
												<p className="font-medium text__16">Deconexion</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div
								onClick={() => settoogleSideMenu(!toogleSideMenu)}
								className={
									"cursor-pointer lg:hidden transition-all duration-300 fixed z-90 top-0 w-full h-full bg-[rgba(23,23,23,0.2)] " +
									(toogleSideMenu ? "left-0" : "-left-[100vw]")
								}
							></div>

							<div className="w-full lg:w-[calc(100%-248px)] lg:ml-[248px] min-h-dvh md:min-h-screen transition-all duration-300">
								<div className="fixed w-full lg:w-[calc(100%-248px)] h-[70px] z-80 right-0 top-0 bg-white lg:bg-Msurfacesurfacesecondary border-b border-Mborderborderprimary flex items-center transition-all duration-300">
									<div className="relative w-full">
										<Container className="relative">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3 lg:px-2">
													<img
														src={originalUrl + "/images/List.svg"}
														className="cursor-pointer lg:hidden"
														onClick={() => settoogleSideMenu(!toogleSideMenu)}
														alt=""
													/>
													<div className="flex items-center gap-2">
														<img
															onClick={() => settoogleSearch(!toogleSearch)}
															src={originalUrl + "/images/search.svg"}
															alt=""
														/>
														<input
															type="text"
															className={
																"font-medium text__14 placeholder:text-Mtexttextinvert bg-transparent border-none outline-hidden hover:focus:active:outline-hidden hover:focus:active:border-none transition-all duration-300 " +
																(toogleSearch
																	? "w-[120px] ss:w-[200px] lg:w-[275px]"
																	: "w-0 lg:w-[275px]")
															}
															placeholder="Search product, customer, etc..."
														/>
													</div>
												</div>

												<div className="flex items-center gap-3 py-4!">
													<div className="flex items-center justify-center w-12 h-12 border rounded-full border-Mborderborderprimary">
														<img
															src={originalUrl + "/images/notification.svg"}
															alt=""
														/>
													</div>

													<div
														className="flex items-center gap-3 cursor-pointer"
														onClick={() =>
															settoogleMenuProfile(!toogleMenuProfile)
														}
													>
														<div className="flex items-center gap-2 py-4 ">
															<img
																src={originalUrl + "/images/avatar.png"}
																className="object-cover w-12 h-12 rounded-full"
																alt=""
															/>
															<div className="hidden lg:block">
																<h5 className="font-semibold text__18">Awa</h5>
																<p className="text__14 text-Mtexttextsecondary">
																	Admin
																</p>
															</div>
														</div>
														<img
															src={originalUrl + "/images/DotsThree.svg"}
															className="hidden lg:block"
															alt=""
														/>
													</div>
												</div>
											</div>

											<MenuProfile
												settoogleMenuProfile={settoogleMenuProfile}
												addClass={"ss:block hidden"}
												toogleMenuProfile={toogleMenuProfile}
												originalUrl={originalUrl}
												handleShow={handleShow}
											/>
										</Container>

										<MenuProfile
											settoogleMenuProfile={settoogleMenuProfile}
											addClass={"ss:hidden"}
											toogleMenuProfile={toogleMenuProfile}
											originalUrl={originalUrl}
											handleShow={handleShow}
										/>
									</div>
								</div>

								<div className=" mt-[70px]">{children}</div>
							</div>
						</div>

						{/* <div className="fixed w-full h-full left-0 top-0 z-60 bg-[rgba(23,23,23,0.2)]"></div> */}
					</Fragment>
				) : (
					children
				)}
			</div>

			<script
				src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"
				crossorigin
			></script>

			<script
				src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"
				crossorigin
			></script>

			<script
				src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js"
				crossorigin
			></script>
		</Fragment>
	);
};

export default Layout;
