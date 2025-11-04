import Link from "next/link";
import { Fragment, useState } from "react";
import { Container } from "react-bootstrap";
import useHostname from "../Provider/HostnameProvider";

const Navbar = () => {
	const originalUrl = useHostname();

	const [ToogleMenuResponsive, setToogleMenuResponsive] = useState(false);

	const [ActiveMenu, setActiveMenu] = useState("");

	const HandleChaneMenu = (e) => {
		if (ActiveMenu == e) {
			setActiveMenu("");
		} else {
			setActiveMenu(e);
		}
	};
	return (
		<Fragment>
			<div className="fixed w-full z-99 top-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center">
				<div className="inline-block">
					<div className="flex items-center justify-between sm:justify-start w-[200px] md:w-auto p-1 rounded-full bg-MNeutral-900 gap-3 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
						<Link href="/" className="inline-block">
							<img src={originalUrl + "/images/Logo.svg"} alt="" />
						</Link>
						<div
							className="hidden sm:flex items-center gap-2 relative cursor-pointer"
							onClick={() => HandleChaneMenu("Resources")}
						>
							<p
								className={
									"text__14 text-white transition-all duration-200 " +
									(ActiveMenu == "Resources" ? "opacity-50" : "")
								}
							>
								Resources
							</p>
							<img
								src={originalUrl + "/images/Arrow Down.svg"}
								className={
									"transition-all duration-300 " +
									(ActiveMenu == "Resources" ? "-rotate-180" : "rotate-0")
								}
								alt=""
							/>
						</div>
						<Link
							href={"/what-we-do"}
							className="hidden sm:inline-block relative"
						>
							<p className="text__14 text-white">What we do</p>
						</Link>
						<Link href={"/about"} className="hidden sm:inline-block relative">
							<p className="text__14 text-white">About us</p>
						</Link>
						<Link href={"/contact"} className="hidden sm:inline-block relative">
							<p className="text__14 text-white">Contact</p>
						</Link>
						<div className="flex items-center gap-3">
							<Link
								href="/auth/sign-in"
								className="hidden sm:inline-block font-medium text__14 px-4 py-2 bg-white text-Mbaseblack rounded-full "
							>
								Sign In
							</Link>

							<div className="md:hidden">
								<div
									onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)}
									className={
										" relative p-1 barIcon w-8 h-8 cursor-pointer ml-auto rounded-full border border-[rgba(0,0,0,0.12)]! " +
										(ToogleMenuResponsive ? "active" : "")
									}
								>
									<div className={"bg-white"}></div>
									<div className={"bg-white"}></div>
									<div className={"bg-white"}></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					className={
						"mt-3 md:mt-4 w-full transition-all duration-300 md:hidden " +
						(ToogleMenuResponsive
							? "opacity-100"
							: "opacity-0 pointer-events-none max-h-0 overflow-hidden")
					}
				>
					<Container>
						<div className="w-full xl:w-[960px] mx-auto p-6 rounded-3xl bg-white max-h-[calc(100vh-100px)] overflow-auto">
							<div className="grid grid-rows-1 gap-y-3">
								<div className={""}>
									<div
										className="flex justify-between items-center gap-2 relative cursor-pointer"
										onClick={() => HandleChaneMenu("Resources")}
									>
										<p className="text__24 font-medium ">Resources</p>
										<img
											src={originalUrl + "/images/Arrow Down.svg"}
											className={
												"transition-all duration-300 w-[30px] " +
												(ActiveMenu == "Resources" ? "-rotate-180" : "rotate-0")
											}
											alt=""
										/>
									</div>
									<div
										className={
											"transition-all duration-300 overflow-hidden grid grid-rows-1 gap-y-3 " +
											(ActiveMenu == "Resources"
												? "max-h-screen pt-3"
												: "max-h-0")
										}
									>
										<Link
											href="/blog"
											className="flex items-center w-full gap-3"
										>
											<div className="w-[52px] h-[52px] shrink-0 rounded-[10px] border border-black! flex items-center justify-center">
												<img
													src={originalUrl + "/images/Newspaper.svg"}
													alt=""
												/>
											</div>
											<div className="">
												<h5 className="font-medium text__16 mb-1">Blog</h5>
												<p className="text__12 text-MNeutral-700">
													Insights & stories from the field
												</p>
											</div>
										</Link>
										<Link
											href="/podcast"
											className="flex items-center w-full gap-3"
										>
											<div className="w-[52px] h-[52px] shrink-0 rounded-[10px] border border-black! flex items-center justify-center">
												<img
													src={originalUrl + "/images/Microphone.svg"}
													alt=""
												/>
											</div>
											<div className="">
												<h5 className="font-medium text__16 mb-1">Podcast</h5>
												<p className="text__12 text-MNeutral-700">
													Inspiring conversations, real stories, and expert
													insights
												</p>
											</div>
										</Link>
									</div>
								</div>

								<Link
									href="/what-we-do"
									className="text__24 font-medium inline-block w-full"
								>
									What we do
								</Link>
								<Link
									href="/about"
									className="text__24 font-medium inline-block w-full"
								>
									About us
								</Link>
								<Link
									href="/auth/sign-in"
									className="text__24 font-medium inline-block w-full"
								>
									Contact
								</Link>
								<div className="">
									<Link
										href="/contact"
										className="inline-block font-medium text__14 px-4 py-2 bg-MBase-black text-white rounded-full "
									>
										Sign In
									</Link>
								</div>
							</div>
						</div>
					</Container>
				</div>
				<div
					className={
						"mt-4 w-full transition-all duration-300 md:block hidden " +
						(ActiveMenu != ""
							? "opacity-100"
							: "opacity-0 pointer-events-none max-h-0 overflow-hidden")
					}
				>
					<Container>
						<div className="w-full md:w-[520px] mx-auto p-3 rounded-3xl bg-white border !border-MNeutral-200">
							<div className="grid grid-cols-2 gap-2">
								<Link href="/blog" className="flex items-center w-full gap-3">
									<div className="w-[52px] h-[52px] shrink-0 rounded-[10px] border border-black! flex items-center justify-center">
										<img src={originalUrl + "/images/Newspaper.svg"} alt="" />
									</div>
									<div className="">
										<h5 className="font-medium text__16 mb-1">Blog</h5>
										<p className="text__12 text-MNeutral-700">
											Insights & stories from the field
										</p>
									</div>
								</Link>
								<Link
									href="/podcast"
									className="flex items-center w-full gap-3"
								>
									<div className="w-[52px] h-[52px] shrink-0 rounded-[10px] border border-black! flex items-center justify-center">
										<img src={originalUrl + "/images/Microphone.svg"} alt="" />
									</div>
									<div className="">
										<h5 className="font-medium text__16 mb-1">Podcast</h5>
										<p className="text__12 text-MNeutral-700">
											Inspiring conversations, real stories, and expert insights
										</p>
									</div>
								</Link>
							</div>
						</div>
					</Container>
				</div>
			</div>
		</Fragment>
	);
};

export default Navbar;
