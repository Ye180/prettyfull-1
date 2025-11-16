import { createContext, useContext, useEffect, useState } from "react";

const HostnameContext = createContext();

export const HostnameProvider = ({ children }) => {
	const [hostname, setHostname] = useState("");

	useEffect(() => {
		// use a safe runtime check for browser environment
		if (typeof window !== "undefined") {
			setHostname(window.location.origin);
		}
	}, []);

	return (
		<HostnameContext.Provider value={hostname}>
			{children}
		</HostnameContext.Provider>
	);
};

export const useHostname = () => {
	return useContext(HostnameContext);
};

export default useHostname;
