// useInsertCard.ts
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { InfoInsert1 } from '../Data/GetDatosClientes';
import type { ClienteData } from '../Interfaces/Tipos';

const useInsertCard = () => {
  const [resultado, setResultado] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insertado, setInsertado] = useState(false);

  const insertCard = async (data: ClienteData) => {
    
    
    let retries = 0;
    let token = Cookies.get('tokenid');

    while (!token && retries < 10) {
      await new Promise((res) => setTimeout(res, 100));
      token = Cookies.get('tokenid');
      retries++;
    }

    if (!token) {
      setError('Token no disponible.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setInsertado(false);

    try {
      const response = await InfoInsert1.InsertInfo(data);
      console.log("Este es el error",response);
      setResultado(response.data);
      setInsertado(true);
    } catch (err: any) {
      console.error('❌ Error al insertar tarjeta:', err);
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return {
    insertCard,
    resultado,
    loading,
    error,
    insertado,
  };
};

export default useInsertCard;
