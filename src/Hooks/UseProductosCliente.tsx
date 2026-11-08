// Hooks/UseProductosCliente.ts
import { useEffect, useState } from "react";
import { InfoProductos1 } from "../Data/GetDatosClientes";
import type { cuenta } from "../Interfaces/Tipos";
import axios from "axios";
import { normalizeCurrency } from "../Utils/currency";

type Options = { enabled?: boolean };

const toNumberOrZero = (value: unknown): number => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const useProductos = ({ enabled = false }: Options = {}) => {
  const [listCuentas, setListCuentas] = useState<cuenta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;                 // ⬅️ espera a que haya sesión válida
    let cancelled = false;

    const run = async () => {
      setLoading(true);
        setError(null);
        try {
          const resp = await InfoProductos1.obtieneInfo(); // withCredentials: true
          const datos = Array.isArray(resp.data) ? resp.data : [];

        const productosLoad: cuenta[] = [];
        for (const p of datos) {
          const tipo: string = p?.tipo ?? "";
          const estado: string = p?.estado ?? "";
          const valorSeguro = p?.aplica_seguro;
          const aplica =
            valorSeguro === true ||
            ["S", "TRUE"].includes(String(valorSeguro ?? "").trim().toUpperCase());
          const tipoSeguro = Number(p?.tipo_seguro ?? 2);
          const primaSeguro = toNumberOrZero(
            p?.prima_seguro ?? p?.prima ?? p?.Prima ?? p?.primaSeguro
          );
          const sumaAsegurada = toNumberOrZero(
            p?.suma_asegurada ?? p?.sumaAsegurada ?? p?.SumaAsegurada
          );
          const modalidad = tipo.split("|").pop()?.trim();
          if ((tipo.substring(0, 3) === "CON" || tipo.substring(0, 3) === "Pen") && estado !== "L") {
            const monedaP = normalizeCurrency(p?.moneda);
            productosLoad.push({
              cuenta: p?.descripcion ?? "",
              tiene_seguro: aplica,
              tipo_seguro: Number.isFinite(tipoSeguro) ? tipoSeguro : 2,
              prima: primaSeguro,
              suma_asegurada: sumaAsegurada,
              forma_pago: p?.forma_pago ?? "",
              moneda: monedaP,
              aporte: toNumberOrZero(
                p?.aporte ?? p?.mon_aporte_ini ?? p?.MON_APORTE_INI
              ),
              contrato: p?.contrato ?? "",
              modalidad: modalidad ?? "",
            });
          }
        }
        if (!cancelled) setListCuentas(productosLoad);
      } catch (e) {
        if (cancelled) return;
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          setError("El enlace ya fue utilizado.");
        } else {
          setError("Ocurrió un error al cargar productos.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [enabled]);

  return { listCuentas, loading, error };
};

export default useProductos;
