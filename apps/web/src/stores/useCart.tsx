import { create } from "zustand";

type NavigationState = {
	currentCartId: string | null;
	setCurrentCartId: (id: string | null) => void;
};

export const useCarttore = create((set) => ({
	currentCartId: null,
	setCurrentCartId: (id: string) => set({ currentCartId: id }),
}));
