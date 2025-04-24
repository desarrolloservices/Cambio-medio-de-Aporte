import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { InfoInsertaVeriff1 } from '../Data/GetDatosClientes';
import Cookies from 'js-cookie';
import useCliente from '../Hooks/UseCliente';

interface Props {
  onSessionCreated: (sessionId: string) => void;
  onVeriffStarted: () => void;
}

const VeriffComponentNew: React.FC<Props> = ({ onSessionCreated, onVeriffStarted }) => {
  const [veriffUrl, setVeriffUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { cliente } = useCliente();

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

    const existingSessionId = Cookies.get("veriffSessionId");
    const existingUrl = Cookies.get("veriffUrl");
    const status = Cookies.get("veriffStatus");

    if (existingSessionId && existingUrl) {
      setVeriffUrl(existingUrl);
      onSessionCreated(existingSessionId);
      setLoading(false);
      loadVeriffSDK().then(() => {
        if (status !== "approved" && status !== "rejected") {
          // El usuario no ha terminado aún, debe iniciar verificación
        } else {
          onVeriffStarted(); // ya hay estado
        }
      });
      return;
    }

    const fetchVeriffUrl = async () => {
      try {
        const myData = {
          nombre: cliente?.Nombre || "",
          apellido: "",
          identidad: "0601199002463",
          idgestion: 0,
          email: cliente?.Correo || "",
          caso: 0,
        };

        const res = await InfoInsertaVeriff1.InfoConsulta(myData);
        if (res.data?.Url) {
          setVeriffUrl(res.data.Url);
          onSessionCreated(res.data.idSession);

          Cookies.set("veriffSessionId", res.data.idSession, {
            path: "/",
            sameSite: "Strict",
            secure: false,
            expires: 1,
          });
          Cookies.set("veriffUrl", res.data.Url, {
            path: "/",
            sameSite: "Strict",
            secure: false,
            expires: 1,
          });
        } else {
          throw new Error("No se obtuvo la URL");
        }
      } catch (err) {
        console.error("Error al obtener la URL de Veriff:", err);
        setError("No se pudo obtener la URL de Veriff.");
      } finally {
        setLoading(false);
        loadVeriffSDK();
      }
    };

    fetchVeriffUrl();
  }, [cliente, onSessionCreated, onVeriffStarted]);

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
    if (veriffUrl && window.veriffSDK) {
      const root = document.getElementById("veriff-root");
      if (root) root.innerHTML = "";
      window.veriffSDK.createVeriffFrame({ url: veriffUrl });
      setIsMounted(true);
      onVeriffStarted(); // 🚀 solo aquí se marca como iniciado
    } else {
      setError("El SDK de Veriff no se cargó correctamente.");
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      {loading && <CircularProgress />}

      {error && <Typography color="error" mt={2}>{error}</Typography>}

      {veriffUrl && !isMounted && (
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={startVeriff}>
            Iniciar Verificación
          </Button>
        </Box>
      )}

      {isMounted && (
        <Box mt={3}>
          <div id="veriff-root" style={{ width: '100%', maxWidth: '800px', height: '500px', margin: '0 auto' }} />
        </Box>
      )}
    </Box>
  );
};

export default VeriffComponentNew;
