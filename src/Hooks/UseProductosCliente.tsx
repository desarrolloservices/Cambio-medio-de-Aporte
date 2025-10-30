// Hooks/UseProductosCliente.ts
import { useEffect, useState } from "react";
import { InfoProductos1 } from "../Data/GetDatosClientes";
import type { cuenta } from "../Interfaces/Tipos";
import axios from "axios";

type Options = { enabled?: boolean };

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
          const aplica = (p?.aplica_seguro ?? "") === "S";
          const modalidad = tipo.split("|").pop()?.trim();
          if ((tipo.substring(0, 3) === "CON" || tipo.substring(0, 3) === "Pen") && estado !== "L") {
            const monedaP = (p?.moneda ?? "") === "LPS" ? "LEMPIRAS" : "DOLARES";
            productosLoad.push({
              cuenta: p?.descripcion ?? "",
              tiene_seguro: aplica,
              prima: p?.prima_seguro ?? 0,
              forma_pago: p?.forma_pago ?? "",
              moneda: monedaP,
              aporte: p?.aporte ?? 0,
              contrato: p?.contrato ?? "",
              modalidad: modalidad ?? "",
            });
          }
        }
        if (!cancelled) setListCuentas(productosLoad);
      } catch (e) {
        if (cancelled) return;
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          setError("Sesión no válida (401). Intente abrir nuevamente el enlace.");
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
