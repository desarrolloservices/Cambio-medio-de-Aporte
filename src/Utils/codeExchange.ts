import { InfoCodeExchange } from "../Data/GetDatosClientes";

let codeExchangePromise: Promise<void> | null = null;
let codeExchangeCompleted = false;

export const exchangeCodeOnce = async (code: string): Promise<void> => {
  if (codeExchangeCompleted) {
    return;
  }

  if (!codeExchangePromise) {
    codeExchangePromise = InfoCodeExchange.InfoCode(code)
      .then(() => {
        codeExchangeCompleted = true;
      })
      .finally(() => {
        if (!codeExchangeCompleted) codeExchangePromise = null;
      });
  }

  await codeExchangePromise;
};
