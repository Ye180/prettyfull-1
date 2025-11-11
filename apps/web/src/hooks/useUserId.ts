import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";

const GUEST_ID_STORAGE_KEY = "guest_user_id";

/**
 * Ce hook est la source de vérité pour l'ID du panier.
 * Il retourne soit l'ID de l'utilisateur connecté,
 * soit un ID invité persistant (lu ou créé dans le localStorage).
 */
export const useUserId = () => {
	const { user } = useAuth();
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		if (user?._id) {
			// Cas 1: L'utilisateur est connecté
			setUserId(user._id);
		} else {
			// Cas 2: L'utilisateur est un invité
			let guestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);
			if (!guestId) {
				// S'il n'y a pas d'ID invité, on en crée un
				guestId = crypto.randomUUID();
				localStorage.setItem(GUEST_ID_STORAGE_KEY, guestId);
			}
			setUserId(guestId);
		}
	}, [user]); // Se met à jour si l'utilisateur se connecte

	return userId;
};