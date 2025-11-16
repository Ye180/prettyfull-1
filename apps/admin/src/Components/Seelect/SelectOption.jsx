import { Fragment, useEffect, useState } from "react";
import useHostname from "../Provider/HostnameProvider";

const SelectOption = ({ title, value, children }) => {
	const originalUrl = useHostname();
	const [toogleMenuSelect, settoogleMenuSelect] = useState(false);

	useEffect(() => {
		settoogleMenuSelect(false);
	}, [value]);

	return (
		<Fragment>
			<div className="w-full xl:w-auto! md:min-w-[190px] h-[46px] px-3 py-2 flex items-center border border-Mborderborderprimary rounded-lg relative">
				<div
					className="flex items-center justify-between w-full gap-2 cursor-pointer"
					onClick={() => settoogleMenuSelect(!toogleMenuSelect)}
				>
					<p className="shrink-0">{value != "" ? value : title}</p>
					<img
						src={originalUrl + "/images/chevron-down.svg"}
						className={
							"transition-all duration-300 " +
							(toogleMenuSelect ? "-rotate-180" : "")
						}
						alt=""
					/>
				</div>
				<div
					className={
						"absolute left-0 top-full min-w-full p-3 bg-white  rounded-2xl shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] transition-all duration-30 flex flex-wrap gap-3 " +
						(toogleMenuSelect
							? "top-[calc(70px+5px)] opacity-100"
							: " top-40 opacity-0 pointer-events-none")
					}
				>
					{children}
				</div>
			</div>
		</Fragment>
	);
};

export default SelectOption;
