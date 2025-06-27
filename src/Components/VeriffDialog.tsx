import React, { useEffect, useRef, useState } from 'react';
import logo from "../Assets/logo.png";

const VeriffComponent: React.FC = () => {
  const veriffRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const veriffRoot = document.getElementById('veriff-root');
    if (veriffRoot) veriffRoot.innerHTML = ''; // Limpia antes de montar

    const loadVeriffSDK = async () => {
      try {
        if (!window.Veriff) {
          await loadScript('https://cdn.veriff.me/sdk/js/1.5/veriff.min.js');
          await loadScript('https://cdn.veriff.me/incontext/js/v1/veriff.js');
        }

        setTimeout(() => {
          if (window.Veriff && veriffRef.current) {
            const veriff = window.Veriff({
              host: 'https://stationapi.veriff.com',
              apiKey: '4d078b9d-14f3-4009-9b03-868ef1f2c69c',
              parentId: 'veriff-root',
              onSession: (err: any, response: any) => {
                if (err) {
              
                  return;
                }
               
                window.veriffSDK?.createVeriffFrame({ url: response.verification.url });
              },
            });

            veriff.setParams({
              person: { givenName: ' ', lastName: ' ' },
              vendorData: ' ',
            });

            veriff.mount({
              submitBtnText: 'Validar Documento',
              loadingText: 'Espere por favor...',
            });

            setIsLoaded(true);
            setTimeout(() => {
              customizeVeriffUI();
            }, 10);
          }
        }, 100);
      } catch (error) {
     
      }
    };

    loadVeriffSDK();
  }, []); // Se ejecuta una vez al montar el componente

  // Función para cargar scripts dinámicamente
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Error cargando el script: ${src}`));
      document.body.appendChild(script);
    });
  };

  // Función para modificar el botón y ocultar la descripción
  const customizeVeriffUI = () => {
    setTimeout(() => {
      const boton = document.querySelector("#veriff-submit-btn") as HTMLElement;
      if (boton) {
   
        boton.classList.remove("veriff-submit", "are-filled");
  
        // Estilos personalizados
        boton.style.backgroundColor = "#D32F2F"; // Rojo personalizado
        boton.style.color = "white"; // Texto en blanco
        boton.style.border = "2px solid #D32F2F"; // Borde rojo
        boton.style.borderRadius = "12px"; // Bordes redondeados
        boton.style.fontSize = "16px"; // Ajustar tamaño de fuente
        boton.style.padding = "10px 20px"; // Aumentar padding
        boton.style.cursor = "pointer"; // Cursor tipo botón
        boton.style.transition = "all 0.3s ease-in-out"; // Animación suave
  
        // Agregar efecto de hover
        boton.onmouseover = () => {
          boton.style.boxShadow = "0px 4px 10px rgba(211, 47, 47, 0.4)"; // Sombra roja
        };
        boton.onmouseleave = () => {
          boton.style.boxShadow = "none"; // Eliminar sombra al salir
        };
      }
  
      const desc = document.querySelector(".veriff-description") as HTMLElement;
      if (desc) {
        desc.style.display = "none"; // Ocultar descripción
      }
    }, 100);
  };
  

  return (
    
      <div
        ref={veriffRef}
        id="veriff-root"
        style={{
         
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth:'100%'
         
        }}
      />
    
  );
};

export default VeriffComponent;
