// Hooks/UseValidateTk.ts
import { useState, useEffect, useRef } from 'react';
import { InfoCodeExchange, validateToken1 } from '../Data/GetDatosClientes';

interface TokenValidationResult {
  isValid: boolean | null;
  isOVP: boolean | null;
  id: string | null;
  ready: boolean;            // ← NUEVO
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const useValidateToken = (): TokenValidationResult => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isOVP, setIsOVP] = useState<boolean | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const ran = useRef(false); // evita doble ejecución en dev

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
        } catch {
          return { ok: false, data: null };
        }
      };

      // 1) Intenta validar sesión actual
      let v = await validate();

      // 2) Si no hay sesión y hay code, canjea SOLO una vez (guardado global)
      if (!v.ok && code) {
        const key = `exchanged:${code}`;
        const already = typeof window !== 'undefined' && localStorage.getItem(key);

        if (!already) {
          // Marca YA para evitar doble-canje en hooks concurrentes
          try {
            localStorage.setItem(key, '1');
          } catch {}

          try {
            // canjea (no lances excepción si responde 401 al segundo intento)
            const ex = await InfoCodeExchange.InfoCode(code);
            // limpia query para no reintentar
            if (typeof window !== 'undefined') {
              const url = new URL(window.location.href);
              url.searchParams.delete('code');
              url.searchParams.delete('id');
              window.history.replaceState({}, '', url.toString());
            }
            // pequeño delay: deja que el navegador persista cookie HttpOnly
            await sleep(120);
            // revalida
            v = await validate();
          } catch {
            // aunque falle, intenta validar por si la cookie ya existía
            await sleep(120);
            v = await validate();
          }
        } else {
          // Ya marcado: probablemente otra parte lo canjeó; revalida tras pequeño delay
          await sleep(120);
          v = await validate();
        }
      }

      // 3) Actualiza estado final
      if (v.ok && v.data) {
        setIsValid(true);
        setIsOVP(v.data.canal === 'OVP'|| v.data.canal === '0');
      //setIsOVP(false);
        setId(v.data.identidad ?? null);
      } else {
        setIsValid(false);
        setIsOVP(false);
        setId(null);
      }

      setReady(true);
    };

    run();
  }, []);

  return { isValid, isOVP, id, ready };
};

export default useValidateToken;
