import {
  getCurrencyMinimum,
  getCurrencyPrefix,
  normalizeCurrency,
  resolveAccountCurrency,
} from "./currency";

describe("currency utilities", () => {
  test.each(["LPS", "HNL", "L", "LEMPIRAS", "lempiras"])(
    "normalizes %s as lempiras",
    (value) => {
      expect(normalizeCurrency(value)).toBe("LEMPIRAS");
    }
  );

  test.each(["USD", "$", "US$", "DOLARES", "DÓLARES", "dolares"])(
    "normalizes %s as dollars",
    (value) => {
      expect(normalizeCurrency(value)).toBe("DOLARES");
    }
  );

  it("uses the supplied fallback instead of assuming lempiras", () => {
    expect(normalizeCurrency(undefined, "USD")).toBe("DOLARES");
    expect(normalizeCurrency(undefined)).toBe("");
  });

  it("returns the correct prefix and minimum", () => {
    expect(getCurrencyPrefix("USD")).toBe("$ ");
    expect(getCurrencyMinimum("USD")).toBe(20);
    expect(getCurrencyPrefix("LPS")).toBe("L ");
    expect(getCurrencyMinimum("LPS")).toBe(250);
  });

  it("uses the selected account as the authoritative currency", () => {
    expect(resolveAccountCurrency("USD", undefined, undefined)).toBe("DOLARES");
    expect(resolveAccountCurrency("USD", "LEMPIRAS", undefined)).toBe("DOLARES");
    expect(resolveAccountCurrency(undefined, "DOLARES", undefined)).toBe("DOLARES");
  });
});
