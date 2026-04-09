"use client";

import { useEffect } from "react";

/**
 * Hook pour garantir que le cart_id persiste dans localStorage
 * pendant toute la navigation de l'utilisateur, même lors des redirections
 * vers login/checkout
 */
export function useCartPersistence() {
	useEffect(() => {
		// Vérifier que le cart_id existe au montage du composant
		const cartId = localStorage.getItem("cart_id");

		if (!cartId) {
			console.warn(
				"[useCartPersistence] Aucun cart_id trouvé dans localStorage",
			);
		} else {
			console.log("[useCartPersistence] cart_id présent:", cartId);
		}

		// Optionnel : Écouter les changements de localStorage
		// pour détecter si le cart_id est supprimé par erreur
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "cart_id" && !e.newValue && e.oldValue) {
				console.error(
					"[useCartPersistence] cart_id a été supprimé ! Tentative de restauration...",
				);
				// Restaurer le cart_id si possible
				if (e.oldValue) {
					localStorage.setItem("cart_id", e.oldValue);
				}
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);
}
