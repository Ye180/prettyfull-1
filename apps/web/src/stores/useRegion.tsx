import type { FakeRegion } from "@/lib/fake-data";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RegionState = {
	region: FakeRegion | null;
	setRegion: (region: FakeRegion | null) => void;
};

export const useRegionStore = create(
	persist<RegionState>(
		(set) => ({
			region: null,
			setRegion: (region: FakeRegion | null) => set({ region }),
		}),
		{
			name: "region",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
