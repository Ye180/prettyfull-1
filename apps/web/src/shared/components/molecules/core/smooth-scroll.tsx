"use client";

import { ReactLenis } from "lenis/react";
import { PropsWithChildren, useEffect, useState } from "react";

/**
 * Lenis pilote le scroll via rAF ; sous `prefers-reduced-motion`, on laisse
 * le scroll natif du navigateur plutôt que de forcer un easing.
 */
const useReducedMotion = () => {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(query.matches);
		const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
		query.addEventListener("change", handler);
		return () => query.removeEventListener("change", handler);
	}, []);

	return reduced;
};

const SmoothScroll = ({ children }: PropsWithChildren) => {
	const reducedMotion = useReducedMotion();

	if (reducedMotion) {
		return <>{children}</>;
	}

	return (
		<ReactLenis root options={{ autoRaf: true }}>
			{children}
		</ReactLenis>
	);
};

export default SmoothScroll;
