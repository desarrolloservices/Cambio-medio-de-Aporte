import { useEffect, useState } from 'react';
import { validateSession } from '../Data/GetDatosClientes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { on } from 'events';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  sessionId: string;
  onApproved: () => void;
  onRejected: () => void;
}

const VeriffStatusChecker = ({ sessionId, onApproved }: Props) => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const response = await validateSession.obtieneSession(sessionId);
        const estado = response.data.verification.status;
        console.log("Estado actual:", estado);
        setStatus(estado);

        if (estado === 'approved') {
          clearInterval(intervalId);
   
          onApproved(); //
          localStorage.setItem("veriffStatus", "approved");
          
        }else{
          clearInterval(intervalId);
          
          localStorage.setItem("veriffStatus", "rejected");
        

        }
      } catch (error) {
        console.error('❌ Error al consultar Veriff:', error);
        localStorage.setItem("veriffStatus", "not started");
      }
    };

    fetchStatus(); // Llamada inicial
    intervalId = setInterval(fetchStatus, 10000); // cada 10 segundos

    return () => clearInterval(intervalId); // limpieza al desmontar
  }, [sessionId, onApproved]);

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      {status === 'approved' ? (
  <p style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2rem' }}>
    <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
    Identidad verificada correctamente
  </p>
) : status === 'reject' ? (
  <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
    <ErrorOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
    Verificación rechazada. Por favor, intente de nuevo.
  </p>
) : (
  <p>Estado actual: {status ?? 'Validando por favor espere...'}</p>
)}
    </div>
  );
};


export default VeriffStatusChecker;