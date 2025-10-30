import { useState, useEffect } from 'react';
import { InfoCliente1, InfoCodeExchange } from '../Data/GetDatosClientes';
import type { informacionCliente } from '../Interfaces/Tipos';
import axios from 'axios';

type Options = { enabled?: boolean };

const useCliente = ({ enabled = true }: Options = {}) => {
  const [cliente, setCliente] = useState<informacionCliente | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [clienteValido, setClienteValido] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setCliente(null);
      setClienteValido(false);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      let code = '';
      if (typeof window !== 'undefined') {
        const qs = new URLSearchParams(window.location.search);
        code = qs.get('code') || qs.get('id') || '';
      }

      const fetchCliente = async () => {
        try {
          const resp = await InfoCliente1.obtieneInfo();
          const d = resp.data;
          if (!Array.isArray(d) || !d[0]) throw new Error('Respuesta inesperada');

          const c: informacionCliente = {
            Nombre: d[0].nombre?.trim?.() ?? '',
            Correo: d[0].email?.trim?.() ?? '',
            Edad: d[0].edad ?? 0,
          };

          if (!cancelled) {
            setCliente(c);
            setClienteValido(true);
          }
          return true;
        } catch (e) {
          if (axios.isAxiosError(e) && e.response?.status === 401) return false;
          throw e;
        }
      };

      let ok = false;
      try {
        ok = await fetchCliente();
      } catch (e) {
        if (!cancelled) {
          setError('Error al cargar los datos del cliente.');
          setLoading(false);
        }
        return;
      }

      if (!ok && code) {
        const key = `exchanged:${code}`;
        const stored = typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;

        if (!stored) {
          try {
            const ex = await InfoCodeExchange.InfoCode(code);
            if (ex.status >= 200 && ex.status < 300) {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem(key, '1');
                const url = new URL(window.location.href);
                url.searchParams.delete('code');
                url.searchParams.delete('id');
                window.history.replaceState({}, '', url.toString());
              }
              ok = await fetchCliente();
            }
          } catch {
            // ignore exchange errors; fetch fallback handles messaging
          }
        }
      }

      if (!cancelled) {
        if (!ok) {
          setCliente(null);
          setClienteValido(false);
          setError('Sesion no valida o expirada.');
        }
        setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { cliente, loading, error, clienteValido };
};

export default useCliente;
