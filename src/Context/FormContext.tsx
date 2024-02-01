import React, { createContext, useState } from 'react';

// Definir el tipo de los datos del formulario
export interface FormData {
    primerNombre:string,
    segundoNombre: string,
    primerApellido: string,
    segundoApellido:string,
    tipoIdentificacion: string,
    numeroIdentificacion: string,
    nacionalidad1: string,
    nacionalidad2: string,
    genero: string,
    fechaNacimiento: null,
    correoElectronico: string,
    nivelEscolaridad: string,
    profesion: string,
    ocupacion: string,
    telefonoFijo: string,
    celular: string,
    direccionResidencia: string,
    municipio: string,
    departamento: string
}

export interface FormContextProps {
    formData: FormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeStep: number;
    setActiveStep?: React.Dispatch<React.SetStateAction<number>>;
    handleNext?: () => void;
    handleBack?: () => void;
}

// Crear el Contexto
const FormContext = createContext({} as FormContextProps);

// Crear el Provider
const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
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
      });

      

      const handleInputChange = (event:any) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
        console.log(formData);
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
    <FormContext.Provider value={{ 
        formData, 
        handleInputChange,
        activeStep,
        setActiveStep,
        handleNext,
        handleBack
        }}>
    {children}
    </FormContext.Provider>
  );
};

export { FormContext, FormProvider };