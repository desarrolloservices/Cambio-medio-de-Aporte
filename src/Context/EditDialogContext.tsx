import React, { createContext, useContext, useState } from "react";

interface EditDialogContextType {
  open: boolean;
  rowData: any;
  openDialog: (data: any) => void;
  closeDialog: () => void;
}

const EditDialogContext = createContext<EditDialogContextType | undefined>(undefined);

export const EditDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState<any>(null);

  const openDialog = (data: any) => {
    
    setRowData(data);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setRowData(null);
  };

  return (
    <EditDialogContext.Provider value={{ open, rowData, openDialog, closeDialog }}>
      {children}
    </EditDialogContext.Provider>
  );
};

export const useEditDialog = () => {
  const context = useContext(EditDialogContext);
  if (!context) {
    throw new Error("useEditDialog debe usarse dentro de un EditDialogProvider");
  }
  return context;
};
