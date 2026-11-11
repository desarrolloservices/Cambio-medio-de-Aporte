const CANAL_STORAGE_KEY = "formapago.canal";

const normalizeCanal = (value: unknown): string => {
  const canal = String(value ?? "").trim();
  // El servicio de token puede identificar los enlaces como "0".
  return canal === "0" ? "Link" : canal || "Link";
};

export const saveCanalActual = (canal: unknown): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(CANAL_STORAGE_KEY, normalizeCanal(canal));
};

export const getCanalActual = (): string => {
  if (typeof window === "undefined") return "Link";
  return normalizeCanal(window.sessionStorage.getItem(CANAL_STORAGE_KEY));
};
