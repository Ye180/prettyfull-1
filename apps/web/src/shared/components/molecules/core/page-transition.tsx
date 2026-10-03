"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";

/**
 * Fondu léger entre les pages, via un `template.tsx` (remonté à chaque
 * navigation, contrairement à `layout.tsx`) - le header/nav qui vivent dans
 * le layout parent restent montés, seul ce contenu transitionne.
 *
 * `initial` reste à sa valeur par défaut (true) volontairement : c'est ce qui
 * adoucit aussi le tout premier chargement, pas seulement les navigations
 * suivantes.
 */
export const PageTransition = ({ children }: PropsWithChildren) => {
	const pathname = usePathname();
	const reducedMotion = useReducedMotion();

	if (reducedMotion) {
		return <>{children}</>;
	}

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -8 }}
				transition={{ duration: 0.22, ease: "easeOut" }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};

export default PageTransition;
