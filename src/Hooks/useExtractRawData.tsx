import { useEffect, useState } from "react";
import { InfoConsulta1 } from "../Data/GetDatosClientes";
import { RawData } from "../Interfaces/Tipos";

interface useExtractRawDataProps {
  cuenta: string;
  trigger?: any; // para forzar recarga si cambia este valor
}

const useExtractRawData = ({ cuenta, trigger }: useExtractRawDataProps) => {
  const [rawData, setRawData] = useState<RawData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      setErrorData(null);
      try {
        const response = await InfoConsulta1.InfoConsulta(cuenta);

        if (Array.isArray(response.data)) {
          const extractedData: RawData[] = response.data.reduce(
            (acc: RawData[], item: any) => {
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
                  Banco:item.Emisor,
                  Monto:item.Aporte

                });
              }
              return acc;
            },
            []
          );

          setRawData(extractedData);
        } else {
          setRawData([]);
        }
      } catch (error) {
        setRawData([]);
        setErrorData('Error al consultar los datos.');
      } finally {
        setLoadingData(false);
      }
    };

    if (cuenta) {
      fetchData();
    }
  }, [cuenta, trigger]); // se ejecuta también cuando trigger cambie

  return { rawData, loadingData, errorData };
};

export default useExtractRawData;
