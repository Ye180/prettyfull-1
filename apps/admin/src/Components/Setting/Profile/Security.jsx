import ModalTwoFactor from "@/Components/Modal/ModalTwoFactor";
import useHostname from "@/Components/Provider/HostnameProvider";
import { Fragment, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

const Security = () => {
	const originalUrl = useHostname();

	const [toogleOldPassword, settoogleOldPassword] = useState(true);
	const [tooglePassword, settooglePassword] = useState(true);
	const [toogleConfirmPassword, settoogleConfirmPassword] = useState(true);

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<Fragment>
			<ModalTwoFactor
				title={""}
				onHideClick={handleClose}
				show={show}
				onHide={handleClose}
				centered
				size="md"
			/>

			<div className="grid grid-cols-1 gap-4">
				<div className="grid grid-cols-1 gap-3">
					<h5 className="text__18 font-medium">Change Password</h5>
					<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
						<Row className="gap-y-3">
							<Col className="col-12">
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										Old Password
									</Form.Label>
									<div className="relative">
										<Form.Control
											type={toogleOldPassword ? "password" : "text"}
											placeholder="Enter your password"
											className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
										/>
										<img
											onClick={() => settoogleOldPassword(!toogleOldPassword)}
											src={originalUrl + "/images/eye-slash.svg"}
											className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
											alt=""
										/>
									</div>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										New Password
									</Form.Label>
									<div className="relative">
										<Form.Control
											type={tooglePassword ? "password" : "text"}
											placeholder="Enter your password"
											className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
										/>
										<img
											onClick={() => settooglePassword(!tooglePassword)}
											src={originalUrl + "/images/eye-slash.svg"}
											className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
											alt=""
										/>
									</div>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										Confirm New Password
									</Form.Label>
									<div className="relative">
										<Form.Control
											type={toogleConfirmPassword ? "password" : "text"}
											placeholder="Enter your password"
											className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
										/>
										<img
											onClick={() =>
												settoogleConfirmPassword(!toogleConfirmPassword)
											}
											src={originalUrl + "/images/eye-slash.svg"}
											className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
											alt=""
										/>
									</div>
								</Form.Group>
							</Col>
							<Col md={12}>
								<h5 className="text__18 font-medium mb-1">
									Password Requirements:
								</h5>
								<ul className="list-disc pl-5 text-Mtexttextsecondary text__16">
									<li>Minimum 8 characters long - the more, the better</li>
									<li>At least one lowercase character</li>
									<li>At least one number, symbol, or whitespace characte</li>
								</ul>
							</Col>
						</Row>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-3">
					<h5 className="text__18 font-medium">Two-steps Verification</h5>
					<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
						<div className="">
							<h5 className="font-medium text_-16 mb-2">
								Two factor authentication is not enabled yet.
							</h5>
							<p className="text__16 text-Mtexttextsecondary mb-4">
								Two-factor authentication adds an additional layer of security
								to your account by requiring more than just a password to log
								in. <span className="underline">Learn more.</span>
							</p>
							<div
								onClick={handleShow}
								className="cursor-pointer font-medium text__14 px-4 py-2 rounded-lg bg-Mmaincolorgreen text-white inline-block"
							>
								Enable two-factor authentication
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Security;
