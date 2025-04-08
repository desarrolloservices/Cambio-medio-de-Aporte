import React, { useContext, useEffect, useState } from "react";

import logo from "./Assets/logo.png";
import "./App.css";
import {
  Button,
  Grid,
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormProvider, FormContext } from "./Context/FormContext"; // Asegúrate de que la ruta sea correcta
import Form1 from "./Components/Form1";
import { InfoCliente, InfoProductos, validateToken } from "./Data/GetDatosClientes";
import useProductos from "./Hooks/UseProductosCliente";
import useValidateToken from "./Hooks/UseValidateTk";
import { informacionCliente } from "./Interfaces/Tipos";








// Create a new theme using Nunito Sans
const theme = createTheme({
  typography: {
    fontFamily: "Nunito Sans, Roboto, sans-serif",
  },
  palette: {
    primary: {
      main: "#d8282f",
    },
    secondary: {
      main: "#76777B",
    },
  },
  shape: {
    borderRadius: 13,
  },
});


function App() {
  
  const { setActiveStep, handleBack, handleNext, activeStep, formData } =
    useContext(FormContext);

    

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  useEffect(() => {
    if (setActiveStep) {
      setActiveStep(0);
    }
  }, []);

   

  return (
    <FormProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppContent />
        </LocalizationProvider>
      </ThemeProvider>
    </FormProvider>
  ); 
}



const AppContent: React.FC = () => {
  const [nameClient, setNameClient] = useState("");
  const { isValid, isOVP } = useValidateToken();
  const [clienteInfo, setClienteInfo] = useState<informacionCliente>({
    Nombre: "",
    Correo: "",
    Email: "",
  });
  const { setActiveStep, handleBack, handleNext, activeStep, formData } =
    useContext(FormContext);
    const {  setFormData } = useContext(FormContext);
    const { listCuentas, loading, error } = useProductos();

    useEffect(() => {
      if (!loading && listCuentas.length > 0 && setFormData) {
        const firstCuenta = listCuentas[0];
        if (firstCuenta) {
          setFormData((prev) => ({
            ...prev,
            cuenta: firstCuenta.cuenta,
            moneda: firstCuenta.moneda,
          }));
        }
      }
    }, [loading, listCuentas, setFormData]);


  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  useEffect(() => {
    if (setActiveStep) {
      setActiveStep(0);
    }
  }, []);

  const capitalizarNombre = (nombre="") => {
    return nombre
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  };

  useEffect(() => {
    // Get the tokenid from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenid = urlParams.get("tokenid");
  
    if (tokenid) {
      // Store the tokenid in localStorage
      localStorage.setItem("tokenid", tokenid);
   
    }
  }, []);

   useEffect(() => {
    
    
      InfoCliente.obtieneInfo()
        .then((response) => {
    
          setNameClient(response.data[0].nombre);
        
        })
        .catch((error) => {
          // Handle errors (log to console)
          console.error("Error getting client data:", error);
        });
       
    
    }, []);

    
    
   
  


  return (
    <div className="App">
      <div className="App">
        <Container>
          <Grid container mt={5}>
            <Grid
              item
              xs={12}
              sx={{
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                marginBottom: "40px",
              }}
            >
              <img src={logo} alt="Logo" style={{ height: "70px" }} />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
              }}
              mt={2}
              mb={2}
            >
             
                
              <Typography variant="h3" color={theme.palette.primary.main} >
               Actualiza tu medio de aporte
              
             
              </Typography>
            </Grid>
            <Grid item xs={12} mb={3}>
              <Typography variant="h5" color={theme.palette.secondary.main}>
                Estimado(a): <strong>{capitalizarNombre(nameClient)}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} mb={3}>
              <Typography variant="h6" color={theme.palette.secondary.main}>
              ¡Haz crecer tu patrimonio! Actualiza e incrementa tu aporte y asegura un mañana próspero para ti y tu familia. Para tu comodidad, puedes afiliar tu aporte a un medio automático con tu tarjeta de crédito o débito.

 

              </Typography>
              <br />
              {isOVP && 
              <Typography variant="h5" color={theme.palette.secondary.main}>
              <strong> Importante: Por tu seguridad para continuar debes verificar tu información. Este formulario estará disponible durante las próximas 48 horas. </strong>
              </Typography>
              }
              
             
            </Grid>
          </Grid>
          {
            loading ? 
                <Typography>Cargando datos ...</Typography> :
            error ? <Typography color="error">{error}</Typography> :
           <Form1 listCuentas={listCuentas}/>
          }
    


  

 

          {}
        </Container>
      </div>
     
  

    </div>
  );
};

export default App;
