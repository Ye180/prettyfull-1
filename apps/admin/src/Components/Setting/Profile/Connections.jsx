import useHostname from "@/Components/Provider/HostnameProvider";
import { Fragment, useState } from "react";

const Connections = () => {
	const originalUrl = useHostname();

	const [checks, setChecks] = useState({
		google: true,
		mailchimp: true,
		asana: true,
	});

	// Handle checkbox toggle
	const handleToggle = (key) => {
		setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
	};
	return (
		<Fragment>
			<h4 className="font-medium text__18">Connected Accounts</h4>
			<p className="mb-3 text__16 text-Mtexttextsecondary">
				Display content from your connected accounts on your site
			</p>

			<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3 mb-4">
				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("google")}
				>
					<div className="flex items-center gap-3">
						<img src={originalUrl + "/images/devicon_google.svg"} alt="" />
						<div className="">
							<h5 className="font-semibold text__16">Google</h5>
							<p className="text__14 text-Mtexttextsecondary">
								Calendar and contacts
							</p>
						</div>
					</div>

					<label class="switch">
						<input type="checkbox" checked={checks.google ? true : false} />
						<span class="slider round"></span>
					</label>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("mailchimp")}
				>
					<div className="flex items-center gap-3">
						<img src={originalUrl + "/images/bxl_mailchimp.svg"} alt="" />
						<div className="">
							<h5 className="font-semibold text__16">Mailchimp</h5>
							<p className="text__14 text-Mtexttextsecondary">
								Email marketing service
							</p>
						</div>
					</div>

					<label class="switch">
						<input type="checkbox" checked={checks.mailchimp ? true : false} />
						<span class="slider round"></span>
					</label>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("asana")}
				>
					<div className="flex items-center gap-3">
						<img src={originalUrl + "/images/logos_asana-icon.svg"} alt="" />
						<div className="">
							<h5 className="font-semibold text__16">Asana</h5>
							<p className="text__14 text-Mtexttextsecondary">Communication</p>
						</div>
					</div>

					<label class="switch">
						<input type="checkbox" checked={checks.asana ? true : false} />
						<span class="slider round"></span>
					</label>
				</div>
			</div>

			<h4 className="font-medium text__18">Social Accounts</h4>
			<p className="mb-3 text__16 text-Mtexttextsecondary">
				DispDisplay content from social accounts on your site
			</p>

			<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
				<div className="flex items-center justify-between gap-2 cursor-pointer">
					<div className="flex items-center gap-3">
						<img
							src={originalUrl + "/images/ic_baseline-facebook.svg"}
							alt=""
						/>
						<div className="">
							<h5 className="font-semibold text__16">Facebook</h5>
							<p className="text__14 text-Mtexttextsecondary">Not connected</p>
						</div>
					</div>

					<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-Mneutralbgsecondary">
						<img src={originalUrl + "/images/link.svg"} alt="" />
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div className="flex items-center justify-between gap-2 cursor-pointer">
					<div className="flex items-center gap-3">
						<img src={originalUrl + "/images/simple-icons_x.svg"} alt="" />
						<div className="">
							<h5 className="font-semibold text__16">Twitter</h5>
							<p className="text__14 text-Mtexttextsecondary">@product.name</p>
						</div>
					</div>

					<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-Mneutralbgsecondary">
						<img src={originalUrl + "/images/remove.svg"} alt="" />
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div className="flex items-center justify-between gap-2 cursor-pointer">
					<div className="flex items-center gap-3">
						<img
							src={originalUrl + "/images/mage_instagram-circle.svg"}
							alt=""
						/>
						<div className="">
							<h5 className="font-semibold text__16">Instagram</h5>
							<p className="text__14 text-Mtexttextsecondary">@product.name</p>
						</div>
					</div>

					<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-Mneutralbgsecondary">
						<img src={originalUrl + "/images/remove.svg"} alt="" />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Connections;
