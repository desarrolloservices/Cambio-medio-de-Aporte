// ValidateSession.tsx  –  PING cada 10 s hasta approved / rejected
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
    if (!sessionId) return;

    
    const fetchStatus = async () => {
      try {
        const res = await validateSession1.obtieneSession(sessionId);
        const vStatus: string | null = res.data.verification?.status ?? null;

        

        setStatus(vStatus);        

        if (vStatus === 'approved') {
          clearInterval(id);
          onApproved();
          Cookies.set('veriffStatus', 'approved', { path: '/', sameSite: 'Strict', expires: 1 });
        } else if (vStatus === 'rejected') {
          clearInterval(id);
          onRejected();
          Cookies.set('veriffStatus', 'rejected', { path: '/', sameSite: 'Strict', expires: 1 });
        }
      } catch (err) {
        
      }
    };

    
    fetchStatus();                             
    const id = setInterval(fetchStatus, 4_000); 

    
    return () => clearInterval(id);
  }, [sessionId, onApproved, onRejected]);

 
  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      {status === 'approved' && (
        <p style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Identidad verificada correctamente
        </p>
      )}

      {status === 'rejected' && (
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <ErrorOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Verificación rechazada. Por favor, intente de nuevo.
        </p>
      )}

      {status === null && <p></p>}
    </div>
  );
};

export default VeriffStatusChecker;
