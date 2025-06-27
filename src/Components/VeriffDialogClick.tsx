// VeriffComponentClick.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { InfoInsertaVeriff1 } from '../Data/GetDatosClientes';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { FormContext } from '../Context/FormContext';

const VeriffComponentClick: React.FC = () => {
  const veriffRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [veriffUrl, setVeriffUrl] = useState<string | null>(null);
  const { formData } = useContext(FormContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldMountVeriff, setShouldMountVeriff] = useState(false);

  const handleVeriffButtonClick1 = async () => {
    const myData = {
      nombre: "",
      apellido: "",
      identidad: "",
      idgestion: 0,
      email: "",
      caso: 0,
    };

   

    try {
      const sendResponse = await InfoInsertaVeriff1.InfoConsulta(myData); // use myDataForm when the data is ok
      console.log("Response insert veriff: ", sendResponse);

      if (sendResponse.data.Url) {
        setVeriffUrl(sendResponse.data.Url);
        console.log(sendResponse.data.Url);
        setOpen(true);
      } else {
        console.error("Url dont exist");
        setOpen(false); // Close the dialog if there's no URL
      }
    } catch (error) {
      console.error("Error: ", error);
      setOpen(false); // Close the dialog on error
    }
  };

  const handleClose = () => {
    setOpen(false);
    setVeriffUrl(null); // Clear the URL when closing
    setIsLoaded(false);
    setShouldMountVeriff(false); // Reset the state
  };

  useEffect(() => {
    const loadVeriffSDK = async () => {
      try {
        if (!window.Veriff) {
          await loadScript('https://cdn.veriff.me/sdk/js/1.5/veriff.min.js');
          await loadScript('https://cdn.veriff.me/incontext/js/v1/veriff.js');
        }
        console.log("veriff cargado");
      } catch (error) {
        console.error('Error cargando el SDK de Veriff:', error);
      }
    };
    loadVeriffSDK();

  }, []);

  useEffect(() => {
    if (veriffUrl && !isLoaded && open) {
       setShouldMountVeriff(true);
    }
  }, [veriffUrl, open]);

  useEffect(() => {
    if (shouldMountVeriff && veriffRef.current ) {
      console.log("veriffRef.current:", veriffRef.current)
      const veriff = window.Veriff({
    
      });
      veriff.mount({ url: veriffUrl });
      setIsLoaded(true);
      setShouldMountVeriff(false);
    }
  }, [shouldMountVeriff, veriffUrl]);

  // Función para cargar scripts dinámicamente
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Error cargando el script: ${src}`));
      document.body.appendChild(script);
    });
  };

  return (
    <>
      <Button variant="contained" onClick={handleVeriffButtonClick1}>
        Veriff
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" >
        <DialogTitle>Verificación</DialogTitle>
        <DialogContent>
          <div ref={veriffRef} id="veriff-root-click" style={{ height: "500px" }} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VeriffComponentClick;
