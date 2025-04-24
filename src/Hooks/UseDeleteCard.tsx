import { useState } from 'react';

import { ClienteDataUpdate } from '../Interfaces/Tipos';
import { InfoActualiza1 } from '../Data/GetDatosClientes';

const UseDeleteCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCard  = async (cardData: ClienteDataUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const payload: ClienteDataUpdate = {
        ...cardData,
        Estado: 'I', // soft delete
      };
          console.log("Esta es nueva",payload)
      await InfoActualiza1.UpdateInfo(payload);
    } catch (err) {
      setError('Error al eliminar la tarjeta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteCard,
    loading,
    error,
  };
};

export default UseDeleteCard;