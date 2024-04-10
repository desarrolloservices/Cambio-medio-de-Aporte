import { SelectChangeEvent } from "@mui/material";
import React, { createContext, useState } from "react";

// Definir el tipo de los datos del formulario
export interface FormData {
  aporte: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  nacionalidad1: string;
  nacionalidad2: string;
  genero: string;
  fechaNacimiento: null;
  correoElectronico: string;
  nivelEscolaridad: string;
  profesion: string;
  ocupacion: string;
  telefonoFijo: string;
  celular: string;
  direccionResidencia: string;
  municipio: string;
  departamento: string;
  fuenteIngresos: string;
  ingresosMensuales: number;
  centroTrabajo: string;
  actividadEconomica: string;
}

export interface FormContextProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeStep: number;
  setActiveStep?: React.Dispatch<React.SetStateAction<number>>;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
  handleNext?: () => void;
  handleBack?: () => void;
  handleSelectChange: (e: SelectChangeEvent) => void;
  handleGeneroChange: (value:string) => void;
}

// Crear el Contexto
const FormContext = createContext({} as FormContextProps);

// Crear el Provider
const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    aporte:0,
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    nacionalidad1: "",
    nacionalidad2: "",
    genero: "",
    fechaNacimiento: null,
    correoElectronico: "",
    nivelEscolaridad: "",
    profesion: "",
    ocupacion: "",
    telefonoFijo: "",
    celular: "",
    direccionResidencia: "",
    municipio: "",
    departamento: "",
    fuenteIngresos: "",
    ingresosMensuales: 0,
    centroTrabajo: "",
    actividadEconomica: "",
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

  const handleGeneroChange = (value:string) => {
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      genero: value,
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
        handleGeneroChange
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export { FormContext, FormProvider };
