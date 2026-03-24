import { describe, it, expect, beforeEach } from "vitest";
import { useRegionStore } from "@/stores/region-store";

describe("region-store", () => {
  beforeEach(() => {
    useRegionStore.setState({
      regionId: null,
      countryCode: "us",
      currencyCode: "usd",
    });
  });

  it("initial regionId is null", () => {
    expect(useRegionStore.getState().regionId).toBeNull();
  });

  it('initial countryCode is "us"', () => {
    expect(useRegionStore.getState().countryCode).toBe("us");
  });

  it('initial currencyCode is "usd"', () => {
    expect(useRegionStore.getState().currencyCode).toBe("usd");
  });

  it("setRegion updates all three values", () => {
    useRegionStore.getState().setRegion("reg_eu", "de", "eur");
    const state = useRegionStore.getState();
    expect(state.regionId).toBe("reg_eu");
    expect(state.countryCode).toBe("de");
    expect(state.currencyCode).toBe("eur");
  });

  it("setRegion can be called multiple times", () => {
    const { setRegion } = useRegionStore.getState();
    setRegion("reg_eu", "de", "eur");
    setRegion("reg_uk", "gb", "gbp");
    const state = useRegionStore.getState();
    expect(state.regionId).toBe("reg_uk");
    expect(state.countryCode).toBe("gb");
    expect(state.currencyCode).toBe("gbp");
  });
});
