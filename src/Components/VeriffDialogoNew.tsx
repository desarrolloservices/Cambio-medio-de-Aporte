import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { InfoInsertaVeriff } from '../Data/GetDatosClientes';
import crypto from "crypto-js";

interface Props {
  onSessionCreated: (sessionId: string) => void;
  onVeriffStarted: () => void; // nueva prop
}
const VeriffComponentNew: React.FC<Props> = ({ onSessionCreated, onVeriffStarted }) => {
  const [veriffUrl, setVeriffUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  

  useEffect(() => {

    const loadVeriffSDK = async () => {
      try {
        await loadScript('https://cdn.veriff.me/sdk/js/1.5/veriff.min.js');
        await loadScript('https://cdn.veriff.me/incontext/js/v1/veriff.js');
        setIsSDKLoaded(true);
      } catch (err) {
        console.error('Error cargando el SDK de Veriff:', err);
        setError("No se pudo cargar el SDK de Veriff.");
      }
    };
    
    const existingSessionId = localStorage.getItem("veriffSessionId");
    const existingUrl = localStorage.getItem("veriffUrl");
    const status=localStorage.getItem("veriffStatus");
    
  if (existingSessionId && existingUrl ) {
    setVeriffUrl(existingUrl);
    onSessionCreated(existingSessionId);
    setLoading(false);
    loadVeriffSDK();

    if(status==="approved" || status==="rejected"){
      onVeriffStarted();

    }
  
    
    return; // 
  }
   

    const fetchVeriffUrl = async () => {
      try {
        const myData = {
          nombre: "Jose Eduardo",
          apellido: "Villalobos",
          identidad: "0601199002463",
          idgestion: 0,
          email: "jvillalobos@afpatlantida.com",
          caso: 0,
        };

        const res = await InfoInsertaVeriff.InfoConsulta(myData);
        
        if (res.data?.Url) {
          setVeriffUrl(res.data.Url);
          onSessionCreated(res.data.idSession);
           localStorage.setItem("veriffSessionId", res.data.idSession);
        localStorage.setItem("veriffUrl", res.data.Url);        
         
         
         

        } else {
          throw new Error("No se obtuvo la URL");
        }
      } catch (err) {
        console.error("Error al obtener la URL de Veriff:", err);
        setError("No se pudo obtener la URL de Veriff.");
      } finally {
        setLoading(false);
      }
    };

    loadVeriffSDK();
    fetchVeriffUrl();
  }, [onSessionCreated]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return resolve();

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Error cargando el script: ${src}`));
      document.body.appendChild(script);
    });
  };

  const startVeriff = () => {
    if (veriffUrl) {
      const root = document.getElementById("veriff-root");
      if (root) root.innerHTML = "";
         console.log(veriffUrl);
      if (window.veriffSDK) {
        window.veriffSDK.createVeriffFrame({ url: veriffUrl });
        setIsMounted(true);
        onVeriffStarted(); // <- aquí se activa el flag
      } else {
        setError("El SDK de Veriff no se cargó correctamente.");
      }
    }
  };

  

  return (
    <Box textAlign="center" mt={4}>
      {loading && <CircularProgress />}

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      { veriffUrl && (
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={startVeriff}>
            Iniciar Verificación
          </Button>
        </Box>
      )}

      {isMounted && (
        <Box mt={3}>
          <div
            id="veriff-root"
            style={{
              width: '100%',
              maxWidth: '800px',
              height: '500px',
              margin: '0 auto',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default VeriffComponentNew;
