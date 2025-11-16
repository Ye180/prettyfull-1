import CartRevenue from "@/Components/Chart/CartRevenue";
import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import "flag-icons/css/flag-icons.min.css";
import { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";

const Index = () => {
	const originalUrl = useHostname();

	return (
		<Fragment>
			<Layout title="Prettyfull" description="Prettyfull Desc" dashboard={true}>
				<SecTop />

				<section className="pt-0 pb-4">
					<Container>
						<div className="grid grid-cols-2 gap-3 xl:grid-cols-4 ss:gap-4 ">
							<div>
								<div className="w-full p-3 border rounded-lg xs:p-4 border-Mborderborderprimary">
									<div className="flex items-center gap-2 mb-4 ss:gap-3">
										<div className="flex items-center justify-center w-[38px] ss:w-11 md:w-14 h-[38px] ss:h-11 md:h-14 rounded-full bg-Msurfacesurfacesecondary border border-Mborderborderprimary">
											<img
												src={originalUrl + "/images/icc (3).svg"}
												className="w-6 md:w-auto"
												alt=""
											/>
										</div>
										<p className="text__16 text-Mtexttextsecondary">
											Total de ventes
										</p>
									</div>
									<h4 className="mb-2 font-semibold text__24">120,452</h4>
									<div className="flex flex-wrap items-center gap-2 xs:flex-nowrap">
										<div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-[#EFFBF2]">
											<img src={originalUrl + "/images/arrow-up.svg"} alt="" />
											<p className="font-medium text__14 text-Malertssucces">
												80%
											</p>
										</div>
										<p className="w-full text__14 text-Mtexttextinvert xs:w-auto">
											vs les 7 derniers jours
										</p>
									</div>
								</div>
							</div>
							<div>
								<div className="w-full p-3 border rounded-lg xs:p-4 border-Mborderborderprimary">
									<div className="flex items-center gap-2 mb-4 ss:gap-3">
										<div className="flex items-center justify-center w-[38px] ss:w-11 md:w-14 h-[38px] ss:h-11 md:h-14 rounded-full bg-Msurfacesurfacesecondary border border-Mborderborderprimary">
											<img
												src={originalUrl + "/images/icc (2).svg"}
												className="w-6 md:w-auto"
												alt=""
											/>
										</div>
										<p className="text__16 text-Mtexttextsecondary">
											Consomateurs
										</p>
									</div>
									<h4 className="mb-2 font-semibold text__24">21,675.01</h4>
									<div className="flex flex-wrap items-center gap-2 xs:flex-nowrap">
										<div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-[#EFFBF2]">
											<img src={originalUrl + "/images/arrow-up.svg"} alt="" />
											<p className="font-medium text__14 text-Malertssucces">
												90%
											</p>
										</div>
										<p className="w-full text__14 text-Mtexttextinvert xs:w-auto">
											vs les 7 derniers jours
										</p>
									</div>
								</div>
							</div>
							<div>
								<div className="w-full p-3 border rounded-lg xs:p-4 border-Mborderborderprimary">
									<div className="flex items-center gap-2 mb-4 ss:gap-3">
										<div className="flex items-center justify-center w-[38px] ss:w-11 md:w-14 h-[38px] ss:h-11 md:h-14 rounded-full bg-Msurfacesurfacesecondary border border-Mborderborderprimary">
											<img
												src={originalUrl + "/images/icc (1).svg"}
												className="w-6 md:w-auto"
												alt=""
											/>
										</div>
										<p className="text__16 text-Mtexttextsecondary">Produits</p>
									</div>
									<h4 className="mb-2 font-semibold text__24">1.423</h4>
									<div className="flex flex-wrap items-center gap-2 xs:flex-nowrap">
										<div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-[#EFFBF2]">
											<img src={originalUrl + "/images/arrow-up.svg"} alt="" />
											<p className="font-medium text__14 text-Malertssucces">
												88%
											</p>
										</div>
										<p className="w-full text__14 text-Mtexttextinvert xs:w-auto">
											vs les 7 derniers jours
										</p>
									</div>
								</div>
							</div>
							<div>
								<div className="w-full p-3 border rounded-lg xs:p-4 border-Mborderborderprimary">
									<div className="flex items-center gap-2 mb-4 ss:gap-3">
										<div className="flex items-center justify-center w-[38px] ss:w-11 md:w-14 h-[38px] ss:h-11 md:h-6 rounded-full bg-Msurfacesurfacesecondary border border-Mborderborderprimary">
											<img
												src={originalUrl + "/images/icc (4).svg"}
												className="w-6 md:w-auto"
												alt=""
											/>
										</div>
										<p className="text__16 text-Mtexttextsecondary">Revenues</p>
									</div>
									<h4 className="mb-2 font-semibold text__24">$220,745,00</h4>
									<div className="flex flex-wrap items-center gap-2 xs:flex-nowrap">
										<div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-[#EFFBF2]">
											<img src={originalUrl + "/images/arrow-up.svg"} alt="" />
											<p className="font-medium text__14 text-Malertssucces">
												88%
											</p>
										</div>
										<p className="w-full text__14 text-Mtexttextinvert xs:w-auto">
											vs les 7 derniers jours
										</p>
									</div>
								</div>
							</div>
						</div>
					</Container>
				</section>

				<section className="pt-0 pb-4">
					<Container>
						<Row className="gap-y-4">
							<Col md={8}>
								<CartRevenue />
							</Col>
							<Col md={4} className="flex-fill">
								<div className="flex flex-col justify-between w-full h-full p-4 border rounded-lg border-Mborderborderprimary">
									<h4 className="w-full font-semibold text__20">
										Croissance de la clientèle
									</h4>

									{[
										{
											name: "United States",
											percent: "56.2%",
										},
										{
											name: "Brazil",
											percent: "40.2%",
										},
										{
											name: "Qatar",
											percent: "35.8%",
										},
										{
											name: "India",
											percent: "21.7%",
										},
										{
											name: "China",
											percent: "12.3%",
										},
										{
											name: "Australia",
											percent: "8.2%",
										},
									].map((obj) => {
										return (
											<div className="w-full">
												<div className="flex items-center gap-2 mb-2">
													<img
														src={originalUrl + "/api/flags/" + obj.name}
														alt="US Flag"
														className="relative object-cover w-6 h-6 rounded-full"
													/>
													<p className="font-medium text__14">{obj.name}</p>
												</div>
												<div className="flex items-center gap-3">
													<div className="relative w-full h-2 overflow-hidden rounded-full bg-dark-300">
														<div
															className="absolute top-0 left-0 h-full rounded-full bg-Msurfacesurfacebrand"
															style={{ width: obj.percent }}
														></div>
													</div>
													<p className="font-medium text__14">{obj.percent}</p>
												</div>
											</div>
										);
									})}
								</div>
							</Col>
						</Row>
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Index;
