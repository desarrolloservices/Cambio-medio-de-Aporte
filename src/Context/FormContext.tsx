import { SelectChangeEvent } from "@mui/material";
import React, { createContext, useState } from "react";

// Definir el tipo de los datos del formulario
export interface FormData {
  aporte: string;
  aporte_nuevo:string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  cardnumber: string;
  formaPago: string;
  diaDebito: string;
  expiryDate: string;
  prima: number;
  cuenta: string;
  sumaAsegurada: number;
  banco:string;
  cel:string;
  monto:string;
  monedaDebito:string;
}

type FlexibleInputEvent =
  | React.ChangeEvent<HTMLInputElement>
  | {
      target: {
        name: string;
        value: string;
      };
    };


export interface FormContextProps {
  formData: FormData;
  handleInputChange: (e: FlexibleInputEvent) => void;
  activeStep: number;
  setActiveStep?: React.Dispatch<React.SetStateAction<number>>;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>> | undefined;
  handleNext?: () => void;
  handleBack?: () => void;
  handleSelectChange: (e: SelectChangeEvent) => void;
  handleGeneroChange: (value: string) => void;
  handleToggle: (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Crear el Contexto
const FormContext = createContext({} as FormContextProps);

// Crear el Provider
const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    aporte: "",
    aporte_nuevo:"",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    cardnumber: "",
    formaPago: "Carné",
    diaDebito: "15",
    expiryDate: "", 
    prima: 0,
    cuenta: "",
    sumaAsegurada: 0,
    banco:"",
    cel:"",
    monto:"",
    monedaDebito:"",
  });

   

  const handleInputChange = (event: any) => {
   
    
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
   
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleGeneroChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      genero: value,
    }));
  };

  const handleToggle = (event: any) => {
   
    const { checked } = event.target;
    const { name } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  /**
   * Maneja el evento de siguiente paso.
   */
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  /**
   * Maneja el evento de paso anterior.
   */
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        handleInputChange,
        activeStep,
        setActiveStep,
        handleNext,
        handleBack,
        handleSelectChange,
        setFormData,
        handleGeneroChange,
        handleToggle,
        loading,
    setLoading,

      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const initialFormData: FormData = {
  aporte: "",
  aporte_nuevo: "",
  primerNombre: "",
  segundoNombre: "",
  primerApellido: "",
  segundoApellido: "",
  tipoIdentificacion: "",
  numeroIdentificacion: "",
  cardnumber: "",
  formaPago: "Carné",
  diaDebito: "15",
  expiryDate: "",
  prima: 0,
  cuenta: "",
  sumaAsegurada: 0,
  banco: "",
  cel: "",
  monto: "",
  monedaDebito: "",
};


export { FormContext, FormProvider };
