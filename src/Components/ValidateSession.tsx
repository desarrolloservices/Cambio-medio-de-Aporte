import { useEffect, useRef, useState } from 'react';
import { validateSession1 } from '../Data/GetDatosClientes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Cookies from 'js-cookie';

interface Props {
  sessionId: string;
  active: boolean;          // controla el inicio del polling
  onApproved: () => void;
  onRejected: () => void;
}

// CHG: todo en lowercase (evita problemas con APPROVED/Approved/etc)
const FINAL_STATUSES = new Set(['approved', 'declined', 'rejected', 'expired', 'error']);

const VeriffStatusChecker = ({ sessionId, active, onApproved, onRejected }: Props) => {
  const [status, setStatus] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!sessionId || !active) return;

    const fetchStatus = async () => {
      try {
        const res = await validateSession1.obtieneSession(sessionId);
        // CHG: normalizar a lowercase
        const raw = res.data?.veriffStatus ?? null;
        const vStatus: string | null = typeof raw === 'string' ? raw.toLowerCase() : null;
        setStatus(vStatus);

        if (vStatus === 'approved') {
          if (timerRef.current) clearInterval(timerRef.current);
          Cookies.set('veriffStatus', 'approved', { path: '/', sameSite: 'Strict', expires: 1 });
          onApproved();
        } else if (vStatus && FINAL_STATUSES.has(vStatus)) {
          if (timerRef.current) clearInterval(timerRef.current);
          Cookies.set('veriffStatus', 'rejected', { path: '/', sameSite: 'Strict', expires: 1 });
          onRejected();
        }
        // si está pendiente, seguimos intentando
      } catch (err) {
        // error transitorio -> seguir polling
        // console.error('validateSession error:', err);
      }
    };

    fetchStatus(); // primer intento
    timerRef.current = setInterval(fetchStatus, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [sessionId, active, onApproved, onRejected]);

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      {status === 'approved' && (
        <p style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Identidad verificada correctamente
        </p>
      )}

      {status && status !== 'approved' && FINAL_STATUSES.has(status) && (
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <ErrorOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Verificación {status === 'declined' ? 'declinada' : 'rechazada/expirada'}. Por favor, intente de nuevo.
        </p>
      )}
    </div>
  );
};

export default VeriffStatusChecker;
