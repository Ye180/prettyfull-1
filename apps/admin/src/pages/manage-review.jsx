import SimpleBarChart from "@/Components/Chart/SimpleBarChart";
import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import SelectOption from "@/Components/Seelect/SelectOption";
import DataManageReviewTable from "@/Components/Table/DataManageReviewTable";
import "flag-icons/css/flag-icons.min.css";
import { Fragment, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

const ManageReview = () => {
	const originalUrl = useHostname();

	const dataTable = [
		{
			id: 1,
			product: {
				img: originalUrl + "/images/pp (2).png", // Replace with actual image path
				title: "Air Jordan 1 Retro High OG 'Black & White",
				subTitle: ["UK 42", "Black & White"],
			},
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Ahmad Lipshutz",
				email: "ahmadlipshutz@gmail.com",
			},
			review: "5",
			date: "Apr 15, 2024, 10:21",
		},
		{
			id: 2,
			product: {
				img: originalUrl + "/images/pp (3).png", // Replace with actual image path
				title: "Nike Dri-FIT Micro Pique 2.0 Polo",
				subTitle: ["M ", "Black"],
			},
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Kadin Kenter",
				email: "kadinkenter@gmail.com",
			},
			review: "3",
			date: "Apr 15, 2024, 10:21",
		},
		{
			id: 3,
			product: {
				img: originalUrl + "/images/pp (4).png", // Replace with actual image path
				title: "Air Jordan 1 Retro",
				subTitle: ["UK 42 ", "Gray"],
			},
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Ryan Mango",
				email: "ryanmango@gmail.com",
			},
			review: "4",
			date: "Apr 15, 2024, 10:21",
		},
		{
			id: 4,
			product: {
				img: originalUrl + "/images/pp (5).png", // Replace with actual image path
				title: "iPhone 13 Pro Max",
				subTitle: ["256GB", "Silve", "Unlocked"],
			},
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Charlie Botosh",
				email: "charliebotosh@gmail.com",
			},
			review: "2",
			date: "Apr 15, 2024, 10:21",
		},
		{
			id: 5,
			product: {
				img: originalUrl + "/images/pp (6).png", // Replace with actual image path
				title: "2020 Apple iPad Pro 2nd Gen",
				subTitle: ["512GB ", "Space Gray"],
			},
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Phillip Culhane",
				email: "phillipculhane@gmail.com",
			},
			review: "4",
			date: "Apr 15, 2024, 10:21",
		},
		{
			id: 6,
			product: {
				img: originalUrl + "/images/pp (7).png", // Replace with actual image path
				title: "Apple 2021 iMac with M1 chip",
				subTitle: ["512GB ", "7-Core GPU", "Silver"],
			},
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Adison Schleifer",
				email: "adisonschleifer@gmail.com",
			},
			review: "4",
			date: "Apr 15, 2024, 10:21",
		},
		{
			id: 7,
			product: {
				img: originalUrl + "/images/pp (1).png", // Replace with actual image path
				title: "MacBook Pro Laptop M2 Pro chip",
				subTitle: ["512 GB ", "Space Gray"],
			},
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Giana Aminoff",
				email: "gianaaminoff@gmail.com",
			},
			review: "5",
			date: "Apr 15, 2024, 10:21",
		},
	];

	const [searchTerm, setSearchTerm] = useState("");
	const [Status, setStatus] = useState("");
	const [Category, setCategory] = useState("");
	const [Stock, setStock] = useState("");
	return (
		<Fragment>
			<Layout
				title="Manage Review"
				description="Manage Review Desc"
				dashboard={true}
			>
				<SecTop
					title="Manage Review"
					subtitle={"Track orders list across your store."}
				/>

				<section className="pt-0 pb-4">
					<Container>
						<Row className="gap-y-4">
							<Col md="6" className="flex-fill">
								<div className="w-full h-full p-3 border border-Mborderborderprimary rounded-xl ">
									<div className="relative grid gap-3 xs:grid-cols-2">
										<div className="">
											<div className="flex items-center gap-2">
												<img src={originalUrl + "/images/Star.svg"} alt="" />
												<h4 className="font-semibold text__48">4.4</h4>
											</div>

											<h5 className="my-3 text__16 text-Mtexttextinvert">
												Total{" "}
												<span className="font-semibold text-Mgray900">287</span>{" "}
												reviews
											</h5>

											<p className="text__16 text-Mtexttextsecondary">
												All reviews are from genuine customers
											</p>
										</div>

										<div className="absolute top-0 hidden w-px h-full -translate-x-1/2 bg-Mborderborderprimary left-1/2 xs:block"></div>

										<div className="grid grid-cols-1 gap-2">
											{[
												{
													percent: "80%",
													value: "140",
												},
												{
													percent: "60%",
													value: "80",
												},
												{
													percent: "45%",
													value: "21",
												},
												{
													percent: "35%",
													value: "12",
												},
												{
													percent: "20%",
													value: "9",
												},
											].map((obj, idx) => {
												return (
													<div className="flex items-center justify-between gap-2">
														<div className="flex items-center gap-1 shrink-0">
															<img
																src={originalUrl + "/images/Star.svg"}
																className="w-3.5"
																alt=""
															/>
															<p className="text__14 text-Msurfacesurfacebrand">
																{5 - idx}
															</p>
														</div>
														<div className="relative w-full h-3 overflow-hidden bg-Mborderborderprimary rounded-xs">
															<div
																className="absolute top-0 left-0 h-full overflow-hidden bg-Msurfacesurfacebrand rounded-xs"
																style={{ width: obj.percent }}
															></div>
														</div>
														<p className="font-medium shrink-0 text__14">
															{obj.value}
														</p>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</Col>
							<Col md="6" className="flex-fill">
								<div className="w-full h-full p-3 border border-Mborderborderprimary rounded-xl ">
									<div className="grid items-center h-full gap-3 xs:grid-cols-2">
										<div className="flex flex-wrap items-center h-full">
											<div className="">
												<h4 className="w-full font-medium text__18">
													Reviews statistics
												</h4>

												<div className="w-full my-4">
													<div className="flex items-center gap-2 mb-1">
														<img
															src={originalUrl + "/images/asdasd.svg"}
															alt=""
														/>
														<h4 className="font-semibold text__20 text-Malertssucces">
															88%
														</h4>
													</div>
													<p className="text__14 text-Mtexttextinvert">
														Positive review
													</p>
												</div>

												<h5 className="text__16 text-Mtexttextinvert">
													<span className="font-semibold text-Mgray900">
														20
													</span>{" "}
													New reviews
												</h5>
											</div>
										</div>

										<SimpleBarChart />
									</div>
								</div>
							</Col>
						</Row>

						<div className="flex items-center xl:flex-nowrap! flex-wrap gap-3 relative z-2 mt-8">
							<div className="flex items-center w-full gap-2 px-2">
								<img src={originalUrl + "/images/search.svg"} alt="" />
								<input
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									type="text"
									className="w-full font-medium bg-transparent border-none text__14 placeholder:text-Mtexttextinvert outline-hidden hover:focus:active:outline-hidden hover:focus:active:border-none"
									placeholder="Search Rating..."
								/>
							</div>
							<div className="grid ss:grid-cols-2 gap-3 shrink-0 xl:w-auto! w-full">
								<SelectOption title={"Rating"} value={Status}>
									<div
										className="inline-block w-full cursor-pointer"
										onClick={() => {
											setStatus("All rating");
										}}
									>
										<p className="font-medium text__16">All rating</p>
									</div>
									<div className="w-full h-px bg-Mborderborderprimary"></div>
									<div
										className="inline-block w-full cursor-pointer"
										onClick={() => {
											setStatus("Highest rating");
										}}
									>
										<p className="font-medium text__16">Highest rating</p>
									</div>
									<div className="w-full h-px bg-Mborderborderprimary"></div>
									<div
										className="inline-block w-full cursor-pointer"
										onClick={() => {
											setStatus("Lowest rating");
										}}
									>
										<p className="font-medium text__16">Lowest rating</p>
									</div>
								</SelectOption>
								<SelectOption title={"Sort"} value={Category}>
									<div
										className="inline-block w-full cursor-pointer"
										onClick={() => setCategory("Newest")}
									>
										<p className="font-medium text__16">Newest</p>
									</div>
									<div className="w-full h-px bg-Mborderborderprimary"></div>
									<div
										className="inline-block w-full cursor-pointer"
										onClick={() => setCategory("Oldest")}
									>
										<p className="font-medium text__16">Oldest</p>
									</div>
									<div className="w-full h-px bg-Mborderborderprimary"></div>
									<div
										className="inline-block w-full cursor-pointer"
										onClick={() => setCategory("A week ago")}
									>
										<p className="font-medium text__16">A week ago</p>
									</div>
								</SelectOption>
							</div>
						</div>

						<DataManageReviewTable
							Status={Status}
							Category={Category}
							Stock={Stock}
							data={dataTable}
							searchTerm={searchTerm}
							paging={true}
							info={true}
						/>
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default ManageReview;
