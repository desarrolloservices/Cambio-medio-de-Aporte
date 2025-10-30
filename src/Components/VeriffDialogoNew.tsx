import React, { useState } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { InfoInsertaVeriff1 } from '../Data/GetDatosClientes';
import Cookies from 'js-cookie';
import useCliente from '../Hooks/UseCliente';

interface Props {
  onSessionCreated: (sessionId: string) => void;
  onVeriffStarted: () => void;
  id: string | null;
}

const VeriffComponentNew: React.FC<Props> = ({ onSessionCreated, onVeriffStarted, id }) => {
  const [veriffUrl, setVeriffUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { cliente } = useCliente();

  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Error cargando el script: ${src}`));
      document.body.appendChild(script);
    });

  const startVeriff = async () => {
    try {
      setError(null);
      setLoading(true);

      // 1) Reusar sesión previa si existe
      let sessionId = Cookies.get('veriffSessionId') || '';
      let url = Cookies.get('veriffUrl') || '';

      // 2) Si no hay sesión previa, crea una ahora en tu backend
      if (!sessionId || !url) {
        const myData = {
          nombre:   cliente?.Nombre || '',
          apellido: '',
          identidad: id ?? '',
          idgestion: 0,
          email:    cliente?.Correo || '',
          caso:     0,
        };

        const res = await InfoInsertaVeriff1.InfoConsulta(myData);
        if (!res.data?.Url || !res.data?.idSession) {
          throw new Error('No se obtuvo la URL o la sesión de Veriff');
        }
        sessionId = res.data.idSession;
        url       = res.data.Url;

        Cookies.set('veriffSessionId', sessionId, { path: '/', sameSite: 'Strict', secure: false, expires: 1 });
        Cookies.set('veriffUrl', url,             { path: '/', sameSite: 'Strict', secure: false, expires: 1 });
      }

      setVeriffUrl(url);
      onSessionCreated(sessionId);

      // 3) Cargar SOLO el SDK InContext (CHG: quitar veriff.min.js)
      await loadScript('https://cdn.veriff.me/incontext/js/v1/veriff.js');

      // 4) Montar iFrame y avisar al padre que empiece el polling
      const root = document.getElementById('veriff-root');
      if (root) root.innerHTML = '';

      // CHG: validar que el SDK esté disponible antes de usarlo
      const veriff = (window as any).veriffSDK;
      if (!veriff?.createVeriffFrame) {
        throw new Error('InContext SDK no disponible (window.veriffSDK)');
      }

      veriff.createVeriffFrame({
        url,
        // opcional: escuchar eventos del iframe
        onEvent: (_msg: string) => {
          // Puedes reaccionar a FINISHED/CANCELED si quieres
        },
      });

      setIsMounted(true);
      onVeriffStarted();
    } catch (e) {
      console.error(e);
      setError('No se pudo iniciar la verificación. Intenta de nuevo.');
    } finally {
      setLoading(false);
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

      {!isMounted && (
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={startVeriff} disabled={loading}>
            Iniciar Verificación
          </Button>
        </Box>
      )}

      {isMounted && (
        <Box mt={3}>
          <div
            id="veriff-root"
            style={{ width: '100%', maxWidth: '800px', height: '500px', margin: '0 auto' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default VeriffComponentNew;
