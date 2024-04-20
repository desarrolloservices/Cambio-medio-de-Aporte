import React, {useContext, useState} from 'react';
import axios from 'axios';
import { FormContext } from '../Context/FormContext';


const useTwilio = () => {
  
  const {formData} = useContext(FormContext);
  const [enviandoCode, setEnviandoCode] = useState(false);
  const [validandoCode, setValidandoCode] = useState(false);
  const [codeEnviado, setCodeEnviado] = useState(false);
  const baseURL = process.env.REACT_APP_BASESEND || '';
  const vcURL =process.env.REACT_APP_BASEVERIF || '';
  const [confirmado, setConfirmado] = useState(false);
  const [confirmadoError, setConfirmadoError] = useState(false);
  const auth = btoa(`${process.env.REACT_APP_SID}:${process.env.REACT_APP_TOK}`);


  const enviarCode = async (celular: string) => {

    const bodyFormData = new FormData();
    bodyFormData.append('To', celular);
    bodyFormData.append('Channel', 'sms');

      try {

        setEnviandoCode(true);
        const respuesta= await
        axios
          .post(baseURL, bodyFormData, {
            headers: {
              'Content-Type':'multipart/form-data',
              Authorization: `Basic ${auth}`
              
            },
          })
  
          .then(response => {
           console.log(`${response.status} ${response.statusText}`)
            console.log(response.data);
            
            setCodeEnviado(true);
            setEnviandoCode(false);
          });
          
          return respuesta;
        //if (!post) return "No post!"
      } catch (error) {
        setEnviandoCode(false);
        console.log(`Este es el error ${error}`);
       
        return[];
      }

    

    



  };

  const validarCode = async (celular: string, code: string) => {


    const bodyFormDataVC = new FormData();
    bodyFormDataVC.append('To', celular);
    bodyFormDataVC.append('Code', code);



      try {
        console.log(`Entro a validar ${celular} con ${code}`);
        console.log('Enviando el Código');
  
        setValidandoCode(true);
        console.log('Puso True');
        axios
          .post(vcURL, bodyFormDataVC, {
            headers: {
              'Content-Type':'multipart/form-data',
              Authorization: `Basic ${auth}`,
            },
          })
  
          .then(response => {
            setValidandoCode(false);
            console.log(response.data);
            if (response.data.valid) {
              setConfirmado(true);
              console.log("Pues Si");
             
              setConfirmadoError(false);
             
            } else {
              setValidandoCode(false);
              console.log("Pues NO");
              setConfirmadoError(true);
            }
          });
        //if (!post) return "No post!"
      } catch (error) {
        setValidandoCode(false);
      if ((error as any).response && (error as any).response.status === 404) {
          console.log('Error 404: Recurso no encontrado');
          
          // Aquí puedes manejar el error 404 de la manera que prefieras
          setConfirmado(false);
          setValidandoCode(false);
          setConfirmadoError(true);
        } else {
          setValidandoCode(false);  
          console.log(`Este es el error ${(error as any).message}`);
        }
        console.log('Hubo un error');
      }

    

   
  };
  return {
    enviarCode,
    enviandoCode,
    confirmado,
    validarCode,
    confirmadoError,
    codeEnviado,
    setValidandoCode,
    validandoCode
  };
};

export default useTwilio;
