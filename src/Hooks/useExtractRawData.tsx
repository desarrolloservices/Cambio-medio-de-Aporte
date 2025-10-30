// Hooks/useExtractRawData.ts
import { useEffect, useState } from "react";
import { InfoConsulta1 } from "../Data/GetDatosClientes";
import { RawData } from "../Interfaces/Tipos";

interface useExtractRawDataProps {
  cuenta: string;
  trigger?: any;
  enabled?: boolean;   // ← NUEVO
}

const useExtractRawData = ({ cuenta, trigger, enabled = false }: useExtractRawDataProps) => {
  const [rawData, setRawData] = useState<RawData[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorData, setErrorData] = useState<string | null>(null);

  useEffect(() => {
    // Guardias: no dispares si no hay sesión o no hay cuenta
    if (!enabled || !cuenta) {
      setRawData([]);
      setLoadingData(false);
      setErrorData(null);
      return;
    }

    let cancel = false;

    const fetchData = async () => {
      setLoadingData(true);
      setErrorData(null);
      try {
        const response = await InfoConsulta1.InfoConsulta(cuenta);
        if (cancel) return;

        if (Array.isArray(response.data)) {
          const extractedData: RawData[] = response.data.reduce((acc: RawData[], item: any) => {
            if (item.Estatus.Value !== 'I') {
              acc.push({
                Tarjeta: item.Tarjeta,
                Aporte: item.Aporte,
                DiaDebito: item.DiaDebito,
                FechaVencimiento: item.FechaVencimiento,
                TipoDebito: item.TipoDebito.Value,
                Estatus: item.Estatus.Value,
                ID: item.ID,
                Contrato: item.Contrato,
                Banco: item.Emisor,
                Monto: item.Aporte,
                MonedaDebito: item.MonedaCCI?.Value ?? 'LEMPIRAS',
              });
            }
            return acc;
          }, []);
          setRawData(extractedData);
        } else {
          setRawData([]);
        }
      } catch (error) {
        if (!cancel) {
          setRawData([]);
          setErrorData('Error al consultar los datos.');
        }
      } finally {
        if (!cancel) setLoadingData(false);
      }
    };

    fetchData();
    return () => { cancel = true; };
  }, [enabled, cuenta, trigger]);   // ← incluye enabled

  return { rawData, loadingData, errorData };
};

export default useExtractRawData;
