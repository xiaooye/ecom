import { describe, it, expect, beforeEach } from "vitest";
import { useRegionStore } from "@/stores/region-store";

describe("region-store advanced", () => {
  beforeEach(() => {
    useRegionStore.setState({
      regionId: null,
      countryCode: "us",
      currencyCode: "usd",
    });
  });

  describe("multiple rapid region changes (last wins)", () => {
    it("5 rapid changes result in the last region", () => {
      useRegionStore.getState().setRegion("reg_us", "us", "usd");
      useRegionStore.getState().setRegion("reg_eu", "de", "eur");
      useRegionStore.getState().setRegion("reg_uk", "gb", "gbp");
      useRegionStore.getState().setRegion("reg_jp", "jp", "jpy");
      useRegionStore.getState().setRegion("reg_au", "au", "aud");

      const state = useRegionStore.getState();
      expect(state.regionId).toBe("reg_au");
      expect(state.countryCode).toBe("au");
      expect(state.currencyCode).toBe("aud");
    });

    it("10 rapid changes result in the last region", () => {
      const regions = [
        { id: "reg_1", country: "us", currency: "usd" },
        { id: "reg_2", country: "de", currency: "eur" },
        { id: "reg_3", country: "gb", currency: "gbp" },
        { id: "reg_4", country: "jp", currency: "jpy" },
        { id: "reg_5", country: "au", currency: "aud" },
        { id: "reg_6", country: "ca", currency: "cad" },
        { id: "reg_7", country: "fr", currency: "eur" },
        { id: "reg_8", country: "it", currency: "eur" },
        { id: "reg_9", country: "br", currency: "brl" },
        { id: "reg_10", country: "in", currency: "inr" },
      ];

      for (const region of regions) {
        useRegionStore
          .getState()
          .setRegion(region.id, region.country, region.currency);
      }

      const state = useRegionStore.getState();
      expect(state.regionId).toBe("reg_10");
      expect(state.countryCode).toBe("in");
      expect(state.currencyCode).toBe("inr");
    });

    it("intermediate values are not visible after final set", () => {
      useRegionStore.getState().setRegion("reg_first", "us", "usd");
      useRegionStore.getState().setRegion("reg_middle", "de", "eur");
      useRegionStore.getState().setRegion("reg_last", "gb", "gbp");

      const state = useRegionStore.getState();
      expect(state.regionId).not.toBe("reg_first");
      expect(state.regionId).not.toBe("reg_middle");
      expect(state.regionId).toBe("reg_last");
    });
  });

  describe("setting same region twice is idempotent", () => {
    it("setting the same region twice results in same state", () => {
      useRegionStore.getState().setRegion("reg_eu", "de", "eur");
      const stateAfterFirst = { ...useRegionStore.getState() };

      useRegionStore.getState().setRegion("reg_eu", "de", "eur");
      const stateAfterSecond = useRegionStore.getState();

      expect(stateAfterSecond.regionId).toBe(stateAfterFirst.regionId);
      expect(stateAfterSecond.countryCode).toBe(stateAfterFirst.countryCode);
      expect(stateAfterSecond.currencyCode).toBe(stateAfterFirst.currencyCode);
    });

    it("setting the same region 5 times produces consistent state", () => {
      for (let i = 0; i < 5; i++) {
        useRegionStore.getState().setRegion("reg_stable", "fr", "eur");
      }

      const state = useRegionStore.getState();
      expect(state.regionId).toBe("reg_stable");
      expect(state.countryCode).toBe("fr");
      expect(state.currencyCode).toBe("eur");
    });
  });

  describe("all fields update atomically", () => {
    it("regionId, countryCode, currencyCode all update together", () => {
      useRegionStore.getState().setRegion("reg_atomic", "jp", "jpy");

      const state = useRegionStore.getState();
      // All three must reflect the new region, none should be from old state
      expect(state.regionId).toBe("reg_atomic");
      expect(state.countryCode).toBe("jp");
      expect(state.currencyCode).toBe("jpy");
    });

    it("no partial updates: all fields change from defaults simultaneously", () => {
      // Before the setRegion call, state is at defaults
      expect(useRegionStore.getState().regionId).toBeNull();
      expect(useRegionStore.getState().countryCode).toBe("us");
      expect(useRegionStore.getState().currencyCode).toBe("usd");

      useRegionStore.getState().setRegion("reg_new", "de", "eur");

      // After the call, all fields must be new
      const state = useRegionStore.getState();
      expect(state.regionId).toBe("reg_new");
      expect(state.countryCode).toBe("de");
      expect(state.currencyCode).toBe("eur");

      // No field should still be at its default
      expect(state.regionId).not.toBeNull();
      expect(state.countryCode).not.toBe("us");
      expect(state.currencyCode).not.toBe("usd");
    });

    it("switching from one region to another updates all fields", () => {
      useRegionStore.getState().setRegion("reg_a", "us", "usd");
      useRegionStore.getState().setRegion("reg_b", "gb", "gbp");

      const state = useRegionStore.getState();
      // All fields must be from reg_b, not a mix
      expect(state.regionId).toBe("reg_b");
      expect(state.countryCode).toBe("gb");
      expect(state.currencyCode).toBe("gbp");
    });
  });

  describe("initial state matches expected defaults after clear", () => {
    it("resetting state to defaults matches initial state", () => {
      // First modify the state
      useRegionStore.getState().setRegion("reg_modified", "jp", "jpy");

      // Reset to defaults
      useRegionStore.setState({
        regionId: null,
        countryCode: "us",
        currencyCode: "usd",
      });

      const state = useRegionStore.getState();
      expect(state.regionId).toBeNull();
      expect(state.countryCode).toBe("us");
      expect(state.currencyCode).toBe("usd");
    });

    it("state after reset is indistinguishable from initial state", () => {
      useRegionStore.getState().setRegion("reg_temp", "de", "eur");

      useRegionStore.setState({
        regionId: null,
        countryCode: "us",
        currencyCode: "usd",
      });

      // Verify it behaves exactly like initial state
      expect(useRegionStore.getState().regionId).toBeNull();
      expect(useRegionStore.getState().countryCode).toBe("us");
      expect(useRegionStore.getState().currencyCode).toBe("usd");

      // Can still set a new region after reset
      useRegionStore.getState().setRegion("reg_after_reset", "it", "eur");
      expect(useRegionStore.getState().regionId).toBe("reg_after_reset");
    });
  });
});
