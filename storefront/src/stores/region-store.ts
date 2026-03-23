"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RegionState {
  regionId: string | null;
  countryCode: string;
  currencyCode: string;
  setRegion: (regionId: string, countryCode: string, currencyCode: string) => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      regionId: null,
      countryCode: "us",
      currencyCode: "usd",
      setRegion: (regionId, countryCode, currencyCode) =>
        set({ regionId, countryCode, currencyCode }),
    }),
    {
      name: "webstore-region",
    }
  )
);
