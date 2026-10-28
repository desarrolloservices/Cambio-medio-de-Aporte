import { useEffect, useState } from "react";
import { InfoCuentasAhorro1 } from "../Data/GetDatosClientes";
import type { CuentaAhorro } from "../Interfaces/Tipos";
import { notifySessionExpired } from "../Utils/sessionExpired";

const firstText = (source: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" || typeof value === "number") {
      const text = String(value).trim();
      if (text) return text;
    }
  }
  return "";
};

const normalizeCuentaAhorro = (source: unknown): CuentaAhorro | null => {
  if (!source || typeof source !== "object") return null;
  const item = source as Record<string, unknown>;
  const cuenta = firstText(item, [
    "accountId", "AccountId", "cuenta", "Cuenta", "numeroCuenta", "NumeroCuenta", "cta", "CTA",
  ]);
  if (!cuenta) return null;

  const monedaOriginal = firstText(item, ["moneda", "Moneda"]);
  const moneda = monedaOriginal.toUpperCase() === "HNL"
    ? "Lempiras"
    : monedaOriginal.toUpperCase() === "USD"
      ? "Dólares"
      : monedaOriginal;
  const descripcionOriginal = firstText(item, [
    "productDescription", "ProductDescription", "descripcion", "Descripcion", "nombre", "Nombre",
  ]);
  const descripcion = /ahorro/i.test(descripcionOriginal)
    ? "Ahorro"
    : /cheques?/i.test(descripcionOriginal)
      ? "de Cheque"
      : descripcionOriginal;
  return {
    cuenta,
    descripcion: descripcion || cuenta,
    ...(moneda ? { moneda } : {}),
  };
};

const getItems = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const source = data as Record<string, unknown>;
  return [source.data, source.cuentas, source.Cuentas, source.resultado]
    .find(Array.isArray) as unknown[] || [];
};

const isSessionExpired = (data: unknown): boolean =>
  !!data &&
  typeof data === "object" &&
  (data as Record<string, unknown>).code === "SESSION_EXPIRED";

const getMonedaMostrada = (moneda: string): string => {
  const valor = moneda.trim().toUpperCase();
  if (["HNL", "LEMPIRAS", "L", "LPS"].includes(valor)) return "Lempiras";
  if (["USD", "DOLARES", "DÓLARES", "$"].includes(valor)) return "Dólares";
  return "";
};

const useCuentasAhorro = ({
  cuenta,
  monedaCuenta,
  enabled,
}: {
  cuenta: string;
  monedaCuenta: string;
  enabled: boolean;
}) => {
  const [cuentasAhorro, setCuentasAhorro] = useState<CuentaAhorro[]>([]);
  const [loadingCuentasAhorro, setLoadingCuentasAhorro] = useState(false);
  const [errorCuentasAhorro, setErrorCuentasAhorro] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !cuenta) {
      setCuentasAhorro([]);
      setLoadingCuentasAhorro(false);
      setErrorCuentasAhorro(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setCuentasAhorro([]);
      setLoadingCuentasAhorro(true);
      setErrorCuentasAhorro(null);
      try {
        const response = await InfoCuentasAhorro1.obtieneInfo();
        if (isSessionExpired(response.data)) {
          notifySessionExpired();
          return;
        }
        const monedaEsperada = getMonedaMostrada(monedaCuenta);
        const items = getItems(response.data)
          .map(normalizeCuentaAhorro)
          .filter((item): item is CuentaAhorro => item !== null)
          .filter((item) => !monedaEsperada || item.moneda === monedaEsperada);
        if (!cancelled) setCuentasAhorro(items);
      } catch {
        if (!cancelled) {
          setCuentasAhorro([]);
          setErrorCuentasAhorro("No pudimos cargar las cuentas de ahorro.");
        }
      } finally {
        if (!cancelled) setLoadingCuentasAhorro(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [cuenta, monedaCuenta, enabled]);

  return { cuentasAhorro, loadingCuentasAhorro, errorCuentasAhorro };
};

export default useCuentasAhorro;
