import { InfoCodeExchange } from "../Data/GetDatosClientes";
import { getApiErrorDetails } from './sessionExpired';

let codeExchangePromise: Promise<void> | null = null;
let codeExchangeCompleted = false;

export const exchangeCodeOnce = async (code: string): Promise<void> => {
  if (codeExchangeCompleted) {
    console.info('[code-exchange] canje omitido: ya fue completado en esta sesión.');
    return;
  }

  if (!codeExchangePromise) {
    console.info('[code-exchange] iniciando canje', {
      endpoint: process.env.REACT_APP_API_TK,
      codeReceived: Boolean(code),
      hasApiKey: Boolean(process.env.REACT_APP_API_SECRET_KEY),
      hasSessionCookie: document.cookie.includes('tokenid='),
    });

    codeExchangePromise = InfoCodeExchange.InfoCode(code)
      .then((response) => {
        codeExchangeCompleted = true;
        console.info('[code-exchange] canje exitoso', {
          status: response.status,
          hasSessionCookie: document.cookie.includes('tokenid='),
        });
      })
      .catch((error: unknown) => {
        const { status, code: errorCode } = getApiErrorDetails(error);
        console.error('[code-exchange] canje fallido', {
          status,
          code: errorCode,
          endpoint: process.env.REACT_APP_API_TK,
          hasSessionCookie: document.cookie.includes('tokenid='),
        });
        throw error;
      })
      .finally(() => {
        if (!codeExchangeCompleted) codeExchangePromise = null;
      });
  }

  await codeExchangePromise;
};
