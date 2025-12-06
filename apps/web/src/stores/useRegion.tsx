import { StoreRegion } from "@medusajs/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type RegionState = {
	region: StoreRegion | null;
	setRegion: (region: StoreRegion | null) => void;
};

export const useRegionStore = create(
	persist<RegionState>(
		(set) => ({
			region: null,
			setRegion: (region: StoreRegion | null) => set({ region }),
		}),
		{
			name: "region",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
