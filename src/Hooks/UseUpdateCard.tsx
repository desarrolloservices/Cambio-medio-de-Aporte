import { useState } from 'react';
import { ClienteDataUpdate } from '../Interfaces/Tipos';
import { InfoActualiza1 } from '../Data/GetDatosClientes';

const UseUpdateCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCard = async (cardData: ClienteDataUpdate) => {
    
    setLoading(true);
    setError(null);
    try {
      const payload: ClienteDataUpdate = {
        ...cardData,
     
      };
         
      
      await InfoActualiza1.UpdateInfo(payload);
    } catch (err) {
      setError('Error al actualizar la tarjeta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCard,
    loading,
    error,
  };
};

export default UseUpdateCard;
