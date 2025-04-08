import { useState, useEffect } from 'react';
import { validateToken } from '../Data/GetDatosClientes';

interface TokenValidationResult {
  isValid: boolean | null;
  isOVP: boolean | null;
}

const useValidateToken = (): TokenValidationResult => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isOVP, setIsOVP] = useState<boolean | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response = await validateToken.getToken();
        const validoParam = response.data.codigoMensaje === "001";
        const ovpParam = response.data.canal === "OVP";
        setIsValid(validoParam);
        setIsOVP(ovpParam);
      } catch (err: any) {
        console.error('Error validating token:', err);
    
        setIsValid(false); // Set to false in case of an error
        setIsOVP(false)
      } finally {
        
      }
    };

    fetchData();
  }, []);

  return { isValid, isOVP };
};

export default useValidateToken;
