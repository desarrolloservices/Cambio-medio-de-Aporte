import { useState, useEffect } from 'react';
import { validateToken1 } from '../Data/GetDatosClientes';
import Cookies from 'js-cookie';

interface TokenValidationResult {
  isValid: boolean | null;
  isOVP: boolean | null;
  id: string | null;
}

const useValidateToken = (): TokenValidationResult => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isOVP, setIsOVP] = useState<boolean | null>(null);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const waitForToken = async () => {
      let retries = 0;
      let token: string | undefined = Cookies.get("tokenid");

      
      while (!token && retries < 10) {
        await new Promise((res) => setTimeout(res, 100));
        retries++;
        token = Cookies.get("tokenid");
      }

      if (!token) {
     
        setIsValid(false);
        setIsOVP(true);
        return;
      }

      
      try {
        const response = await validateToken1.getToken();
        const validoParam = response.data.codigoMensaje === "001";
        const ovpParam = response.data.canal === "OVP";
        const idParam = response.data.identidad || null;

        if (validoParam) {
          setIsValid(validoParam);
        setIsOVP(ovpParam);
        setId(idParam);
        }
           
       
      } catch (err) {
        
        setIsValid(false);
        setIsOVP(false);
        setId(null);
      }
    };

    waitForToken();
  }, []);

  return { isValid, isOVP,id };
};

export default useValidateToken;
