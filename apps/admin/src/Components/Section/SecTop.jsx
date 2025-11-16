import { Fragment } from "react";
import { Container } from "react-bootstrap";
import useHostname from "../Provider/HostnameProvider";

const SecTop = ({
	title = "Dashboard",
	subtitle = "Monitor your store's progress to increase your sales.",
	children,
}) => {
	const originalUrl = useHostname();
	return (
		<Fragment>
			<section className="py-4">
				<Container>
					<div className="flex flex-wrap items-center justify-between ss:flex-nowrap gap-y-3">
						<div className="w-full ss:w-auto">
							<h2 className="mb-1  font-bold! text__32">{title}</h2>
							<p className="text__16 text-Mtexttextsecondary">{subtitle}</p>
						</div>
						{children}
					</div>
				</Container>
			</section>
		</Fragment>
	);
};

export default SecTop;
