// Hooks/UseValidateTk.ts
import { useState, useEffect, useRef } from 'react';
import { validateToken1 } from '../Data/GetDatosClientes';
import { exchangeCodeOnce } from '../Utils/codeExchange';
import { saveCanalActual } from '../Utils/canal';
import {
  getApiErrorDetails,
  SESSION_EXPIRED_CODE,
  SESSION_EXPIRED_EVENT,
} from '../Utils/sessionExpired';

interface TokenValidationResult {
  isValid: boolean | null;
  isLink: boolean | null;
  id: string | null;
  ready: boolean;            // ← NUEVO
  sessionExpired: boolean;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const useValidateToken = (): TokenValidationResult => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLink, setIsLink] = useState<boolean | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const ran = useRef(false); // evita doble ejecución en dev

  useEffect(() => {
    const handleSessionExpired = () => {
      setSessionExpired(true);
      setIsValid(false);
      setIsLink(false);
      setId(null);
      setReady(true);
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, []);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      // 0) Lee code de la URL
      let code = '';
      if (typeof window !== 'undefined') {
        const qs = new URLSearchParams(window.location.search);
        code = qs.get('code') || qs.get('id') || '';
      }

      // Helper de validación (consulta /api/token)
      const validate = async () => {
        try {
          const r = await validateToken1.getToken();
          const ok = r.status === 200 && r.data?.codigoMensaje === '001';
          return { ok, data: r.data };
        } catch (error) {
          const { status, code } = getApiErrorDetails(error);
          return { ok: false, data: null, status, code };
        }
      };

      // 1) Intenta validar sesión actual
      let v = await validate();

      // 2) Si no hay sesión y hay code, canjea SOLO una vez (guardado global)
      if (!v.ok && code) {
        try {
          await exchangeCodeOnce(code);

          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            url.searchParams.delete('id');
            window.history.replaceState({}, '', url.toString());
          }

          await sleep(120);
          v = await validate();
        } catch {
          // Aunque falle, revalida por si el servidor alcanzó a crear la cookie.
          await sleep(120);
          v = await validate();
        }
      }

      // 3) Actualiza estado final
      if (v.ok && v.data) {
        saveCanalActual(v.data.canal);
        setSessionExpired(false);
        setIsValid(true);
        setIsLink(v.data.canal === 'Link' || v.data.canal === '0');
        setId(v.data.identidad ?? null);
      } else {
        setSessionExpired(
          v.status === 401 && v.code === SESSION_EXPIRED_CODE
        );
        setIsValid(false);
        setIsLink(false);
        setId(null);
      }

      setReady(true);
    };

    run();
  }, []);

  return { isValid, isLink, id, ready, sessionExpired };
};

export default useValidateToken;
