import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import Account from "@/Components/Setting/Profile/Account";
import Billing from "@/Components/Setting/Profile/Billing";
import Connections from "@/Components/Setting/Profile/Connections";
import Notification from "@/Components/Setting/Profile/Notification";
import Security from "@/Components/Setting/Profile/Security";
import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ReactSVG } from "react-svg";

export async function getServerSideProps(context) {
	const { url } = context.query; // Ambil parameter dari query
	let data = url == null ? "" : url;
	// Kembalikan data sebagai props
	return {
		props: {
			data,
		},
	};
}

const Profile = ({ data }) => {
	const originalUrl = useHostname();

	const [SelectMenu, setSelectMenu] = useState(data ? data : "Account");

	useEffect(() => {
		setSelectMenu(data ? data : "Account");
	}, [data]);

	return (
		<Fragment>
			<Layout title="Setting" description="Setting Desc" dashboard={true}>
				<SecTop
					title="Profile Setting"
					subtitle={"Track orders list across your store."}
				/>

				<section className="pt-0 pb-4">
					<Container>
						<Row className="gap-y-4">
							<Col md={5} xl={4}>
								<div className="w-full grid grid-cols-1 gap-1">
									{[
										{
											icon: originalUrl + "/images/icca (3).svg",
											name: "Account",
										},
										{
											icon: originalUrl + "/images/icca (2).svg",
											name: "Security",
										},
										{
											icon: originalUrl + "/images/icca (5).svg",
											name: "Billing & Plans",
										},
										{
											icon: originalUrl + "/images/icca (4).svg",
											name: "Notifications",
										},
										{
											icon: originalUrl + "/images/icca (1).svg",
											name: "Connections",
										},
									].map((obj) => {
										return (
											<Fragment>
												<div
													className={
														"px-3 py-3 flex items-center justify-between cursor-pointer rounded-xl " +
														(SelectMenu == obj.name
															? "text-Msurfacesurfacebrand bg-[#F2F8F5]"
															: "text-Mtexttextsecondary")
													}
													onClick={() => setSelectMenu(obj.name)}
												>
													<div className="flex items-center gap-2">
														<ReactSVG src={obj.icon} />
														<h5 className="font-medium text__16">{obj.name}</h5>
													</div>
													<ReactSVG
														src={originalUrl + "/images/CaretRight.svg"}
														className={
															"transition-all duration-300 " +
															(SelectMenu == obj.name
																? "opacity-100"
																: "opacity-0")
														}
													/>
												</div>
											</Fragment>
										);
									})}
								</div>
							</Col>
							<Col md={7} xl={8}>
								{SelectMenu == "Account" ? <Account /> : ""}
								{SelectMenu == "Security" ? <Security /> : ""}
								{SelectMenu == "Billing & Plans" ? <Billing /> : ""}
								{SelectMenu == "Notifications" ? <Notification /> : ""}
								{SelectMenu == "Connections" ? <Connections /> : ""}
							</Col>
						</Row>
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Profile;
