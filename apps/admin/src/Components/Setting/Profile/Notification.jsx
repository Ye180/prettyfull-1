import useHostname from "@/Components/Provider/HostnameProvider";
import { Fragment, useState } from "react";

const Notification = () => {
	const originalUrl = useHostname();

	const [checks, setChecks] = useState({
		NewForYou: true,
		AccountActivity: true,
		signIn: false,
		linked: false,
	});

	// Handle checkbox toggle
	const handleToggle = (key) => {
		setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
	};
	return (
		<Fragment>
			<h4 className="font-medium text__18">Recent Devices</h4>
			<p className="mb-3 text__16 text-Mtexttextsecondary">
				We need permission from your browser to show notifications. Request
				Permission
			</p>

			<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("NewForYou")}
				>
					<span className="text__16">New for you</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.NewForYou
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.NewForYou ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("AccountActivity")}
				>
					<span className="text__16">Account activity</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.AccountActivity
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.AccountActivity ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("signIn")}
				>
					<span className="text__16">A new browser used to sign in</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.signIn
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.signIn ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("linked")}
				>
					<span className="text__16">A new device is linked</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.linked
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.linked ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Notification;
