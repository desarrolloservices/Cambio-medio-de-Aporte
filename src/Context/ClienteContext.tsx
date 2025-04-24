// context/ClienteContext.tsx
import React, { createContext, useContext } from 'react';
import useCliente from '../Hooks/UseCliente';
import type { informacionCliente } from '../Interfaces/Tipos';

interface ClienteContextType {
  cliente: informacionCliente | null;
  loading: boolean;
  error: string | null;
}

const ClienteContext = createContext<ClienteContextType>({
  cliente: null,
  loading: true,
  error: null,
});

export const ClienteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cliente, loading, error } = useCliente();

  return (
    <ClienteContext.Provider value={{ cliente, loading, error }}>
      {children}
    </ClienteContext.Provider>
  );
};

export const useClienteContext = () => useContext(ClienteContext);
export {};