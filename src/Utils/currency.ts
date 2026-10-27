export type SupportedCurrency = "LEMPIRAS" | "DOLARES";

const cleanCurrency = (value?: unknown): string =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const normalizeCurrency = (
  value?: unknown,
  fallback?: unknown
): SupportedCurrency | "" => {
  const currency = cleanCurrency(value);

  if (["LEMPIRA", "LEMPIRAS", "L", "LPS", "HNL"].includes(currency)) {
    return "LEMPIRAS";
  }

  if (["DOLAR", "DOLARES", "$", "US$", "USD"].includes(currency)) {
    return "DOLARES";
  }

  if (fallback !== undefined && fallback !== value) {
    return normalizeCurrency(fallback);
  }

  return "";
};

export const getCurrencyPrefix = (value?: unknown): string => {
  const currency = normalizeCurrency(value);
  if (currency === "LEMPIRAS") return "L ";
  if (currency === "DOLARES") return "$ ";
  return "";
};

export const getCurrencyMinimum = (value?: unknown): number | null => {
  const currency = normalizeCurrency(value);
  if (currency === "LEMPIRAS") return 250;
  if (currency === "DOLARES") return 20;
  return null;
};

export const getCurrencyMinimumMessage = (value?: unknown): string => {
  const currency = normalizeCurrency(value);
  return currency === "LEMPIRAS"
    ? "El monto mínimo para Lempiras es L 250"
    : "El monto mínimo para Dólares es $ 20";
};

export const resolveAccountCurrency = (
  accountCurrency?: unknown,
  debitCurrency?: unknown,
  cciCurrency?: unknown
): SupportedCurrency | "" =>
  normalizeCurrency(accountCurrency) ||
  normalizeCurrency(debitCurrency, cciCurrency);
