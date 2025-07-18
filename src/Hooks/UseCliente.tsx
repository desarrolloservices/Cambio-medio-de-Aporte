import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { InfoCliente1 } from '../Data/GetDatosClientes';
import type { informacionCliente } from '../Interfaces/Tipos';

const useCliente = () => {
  const [cliente, setCliente] = useState<informacionCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clienteValido, setClienteValido] = useState(false);
  

  useEffect(() => {
    const obtenerInfoCliente = async () => {
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

      try {
        const response = await InfoCliente1.obtieneInfo();
        const data = response.data;

      

        const clienteExtraido: informacionCliente = {
          Nombre: data[0].nombre.trim(),
          Correo: data[0].email.trim(),
          Edad: data[0].edad,
        };

        setCliente(clienteExtraido);
      
      } catch (err) {

        setError('Error al cargar los datos del cliente.');
      } finally {
        setLoading(false);
      }
    };

    obtenerInfoCliente();
  }, []);

  return {
    cliente,
    loading,
    error,
    clienteValido,
  };
};

export default useCliente;