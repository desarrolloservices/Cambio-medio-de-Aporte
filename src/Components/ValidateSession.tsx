// ValidateSession.tsx
import { useEffect, useState } from 'react';
import { validateSession1 } from '../Data/GetDatosClientes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Cookies from 'js-cookie';

interface Props {
  sessionId: string;
  onApproved: () => void;
  onRejected: () => void;
}

const VeriffStatusChecker = ({ sessionId, onApproved, onRejected }: Props) => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const response = await validateSession1.obtieneSession(sessionId);
        const estado = response.data.status;
        console.log("📡 Estado actual Veriff:", estado);
        console.log(response.data);
        setStatus(estado);
              
        if (response.data.verification.status === 'approved') {
          clearInterval(intervalId);
          onApproved();
          Cookies.set("veriffStatus", "approved", {
            path: "/",
            sameSite: "Strict",
            secure: false,
            expires: 1,
          });
        } else if (response.data.verification.status === 'rejected') {
          clearInterval(intervalId);
          onRejected();
          Cookies.set("veriffStatus", "rejected", {
            path: "/",
            sameSite: "Strict",
            secure: false,
            expires: 1,
          });
        }
      } catch (error) {
        console.error('❌ Error al consultar estado de Veriff:', error);
      }
    };

    fetchStatus(); // Primer chequeo inmediato
    intervalId = setInterval(fetchStatus, 1000); // 💡 cada 1 segundo

    return () => clearInterval(intervalId); // limpieza
  }, [sessionId]);

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      {status === 'approved' ? (
        <p style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Identidad verificada correctamente
        </p>
      ) : status === 'rejected' ? (
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <ErrorOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Verificación rechazada. Por favor, intente de nuevo.
        </p>
      ) : (
        <p>Estado actual: {status ?? 'Validando, por favor espere...'}</p>
      )}
    </div>
  );
};

export default VeriffStatusChecker;
