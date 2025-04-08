import { useState, useEffect } from 'react';
import { InfoConsulta } from '../Data/GetDatosClientes';
import { RawData } from '../Interfaces/Tipos';

interface useExtractRawDataProps {
    cuenta: string;
  }
  
  const useExtractRawData = ({cuenta}:useExtractRawDataProps) => {
    const [rawData, setRawData] = useState<RawData[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [errorData, setErrorData] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoadingData(true);
        setErrorData(null);
        try {
          const response = await InfoConsulta.InfoConsulta(cuenta);

          if (Array.isArray(response.data)) {
            const extractedData: RawData[] = response.data.reduce((acc: RawData[], item: any) => {

              console.log("La respuesta es:"+item.Estatus.Value);
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
                  });
                }
                return acc;
              }, []);
           
            setRawData(extractedData);

            
           
          } else {
          
            setRawData([]);
          }
        } catch (error) {
       
          setRawData([]);
        } finally {
       
          setLoadingData(false);
        }
    
      };
  
      if (cuenta) { // Check if cuenta is available
        fetchData();
      }
    }, [cuenta]); // Dependency array to run when cuenta changes
  
    return { rawData, loadingData, errorData };
  };
  
  export default useExtractRawData;