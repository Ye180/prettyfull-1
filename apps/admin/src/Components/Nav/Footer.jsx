import Link from "next/link";
import { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import useHostname from "../Provider/HostnameProvider";

const Footer = () => {
	const originalUrl = useHostname();
	return (
		<Fragment>
			<section className="py-2">
				<div className="px-2">
					<div className="w-full lg:px-4 xl:px-10 py-8 lg:py-16 pb-2 rounded-3xl sm:rounded-[56px]">
						<Container>
							<Row className="justify-between mb-12 gap-y-6">
								<Col lg={5}>
									<div className="flex items-center gap-2 mb-2">
										<img src={originalUrl + "/images/logo2.svg"} alt="" />
										<h4 className="font-bold text__24">Hopuly</h4>
									</div>
									<p className="text__18">
										Your support can change lives and build brighter{" "}
										<br className="ss:block hidden" />
										futures. Join us in making a difference today.
									</p>
								</Col>
								<Col lg={5}>
									<Row className="gap-y-10">
										<Col md={4} className="col-8">
											<div className="grid grid-rows-1 gap-3">
												<Link
													href="/blog"
													className="text__16 text-Mneutral900"
												>
													Blog
												</Link>
												<Link
													href="/podcast"
													className="text__16 text-Mneutral900"
												>
													Podcast
												</Link>
											</div>
										</Col>
										<Col md={4} className="col-4">
											<div className="grid grid-rows-1 gap-3">
												<Link
													href="/about"
													className="text__16 text-Mneutral900"
												>
													About us
												</Link>
												<Link
													href="/contact"
													className="text__16 text-Mneutral900"
												>
													Contact
												</Link>
												<Link href="/faq" className="text__16 text-Mneutral900">
													FAQs
												</Link>
											</div>
										</Col>
										<Col md={4}>
											<div className="grid grid-rows-1 gap-3">
												<h5 className="text__16 text-Mneutral900">
													Social Media
												</h5>
												<div className="flex items-center gap-3">
													<Link href="#!">
														<img
															src={originalUrl + "/images/as (3).svg"}
															alt=""
														/>
													</Link>
													<Link href="#!">
														<img
															src={originalUrl + "/images/as (1).svg"}
															alt=""
														/>
													</Link>
													<Link href="#!">
														<img
															src={originalUrl + "/images/as (2).svg"}
															alt=""
														/>
													</Link>
												</div>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>

							<div className="flex items-center justify-between flex-wrap gap-y-4 ss:flex-nowrap">
								<p className="text-center text__14 text-MNeutral-500 order-2 ss:order-1!">
									© 2024 Hopuly. All rights reserved.
								</p>
								<div className="flex items-center gap-3 ss:order-2! order-1">
									<Link
										href="/terms-of-use"
										className="text-center text__14 text-MNeutral-700"
									>
										Terms of use
									</Link>
									<Link
										href="/privacy-policy"
										className="text-center text__14 text-MNeutral-700"
									>
										Privacy policy
									</Link>
								</div>
							</div>
						</Container>
					</div>
				</div>
			</section>
		</Fragment>
	);
};

export default Footer;
