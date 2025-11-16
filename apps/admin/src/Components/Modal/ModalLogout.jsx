import Link from "next/link";
import { Fragment } from "react";
import { Container, Modal } from "react-bootstrap";
import useHostname from "../Provider/HostnameProvider";

const ModalLogout = ({ onHideClick, title, ...props }) => {
	const originalUrl = useHostname();
	return (
		<Fragment>
			{/* Modal */}
			<Modal {...props}>
				<Modal.Body>
					<div className="border-b border-Mborderborderprimary p-3">
						<Container>
							<div className="flex items-center justify-between">
								<h4 className="font-semibold text__20">{title}</h4>
								<img
									className="cursor-pointer"
									onClick={onHideClick}
									src={originalUrl + "/images/asdas.svg"}
									alt=""
								/>
							</div>
						</Container>
					</div>
					<div className="p-4">
						<img
							src={originalUrl + "/images/Frame 1.svg"}
							className="mx-auto mb-4"
							alt=""
						/>

						<div className="text-center mb-4">
							<h2 className="font-semibold text__24 mb-1">
								Are you sure log out?
							</h2>
							<p className="text__16 text-Mtexttextsecondary">
								You’re about to log out of this acoount.
							</p>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div
								onClick={onHideClick}
								className="inline-block text-center px-3 py-2 rounded-lg bg-Msurfacesurfacesecondary text-black"
							>
								<p className="font-medium text__14">Cancel</p>
							</div>
							<Link
								href="/auth/login"
								className="cursor-pointer inline-block text-center px-3 py-2 rounded-lg bg-black text-white"
							>
								<p className="font-medium text__14">Sign Out</p>
							</Link>
						</div>
					</div>
				</Modal.Body>
			</Modal>
			{/* Modal */}
		</Fragment>
	);
};

export default ModalLogout;
