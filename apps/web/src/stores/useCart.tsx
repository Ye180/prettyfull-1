import { create } from "zustand";

type NavigationState = {
	currentCartId: string | null;
	setCurrentCartId: (id: string | null) => void;
};

export const useCartStore = create((set) => ({
	currentCartId: null, // Assurez-vous que cet ID est défini et persisté (ex: localStorage)
	setCurrentCartId: (id: string | null) => set({ currentCartId: id }),
}));