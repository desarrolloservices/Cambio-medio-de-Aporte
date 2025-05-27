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
  Box,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormProvider, FormContext } from "./Context/FormContext";
import { saveTokenFromUrl } from "./Data/setCookies";
import useProductos from "./Hooks/UseProductosCliente";
import useValidateToken from "./Hooks/UseValidateTk";
import { informacionCliente } from "./Interfaces/Tipos";
import useCliente from "./Hooks/UseCliente";
import { ClienteProvider } from "./Context/ClienteContext";
import Form1 from './Components/Form1';
import { EditDialogProvider } from "./Context/EditDialogContext";
import Alerta from "./Assets/Alerta.png";

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
  const { isValid, isOVP,id } = useValidateToken();
  const [clienteInfo, setClienteInfo] = useState<informacionCliente>({
    Nombre: "",
    Correo: "",
    Edad: "",
  });

  const { cliente, loading: loadingCliente, error: errorCliente } = useCliente();
  const { setActiveStep, handleBack, handleNext, activeStep, formData, setFormData } =
    useContext(FormContext);
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

  useEffect(() => {
    if (setActiveStep) {
      setActiveStep(0);
    }
  }, []);

  const capitalizarNombre = (nombre = "") => {
    return nombre
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  };

  useEffect(() => {
    saveTokenFromUrl();
  }, []);

  if (isValid === null) {
    return (
      <Container>
        <Typography variant="h6" color="textSecondary">
          Validando sesión...
        </Typography>
      </Container>
    );
  }

  if (isValid === false) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: 2,
        }}
      >
        <img
          src={Alerta} // asegúrate que exista este archivo, o usa una URL externa si prefieres
          alt="Alerta"
          style={{ width: "100px", marginBottom: "20px" }}
        />
        <Typography variant="h4" color="error" gutterBottom>
          El link ha expirado
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Por favor, ingrese nuevamente desde el enlace proporcionado en su correo.
        </Typography>
      </Box>
    );
  }

  return (
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
            <Typography variant="h3" color={theme.palette.primary.main}>
              Modifica tu Medio de Aporte <br/>por Tarjeta de Crédito
            </Typography>
          </Grid>
          <Grid item xs={12} mb={3}>
            {cliente && (
              <Typography variant="h5" color={theme.palette.secondary.main}>
                Estimado(a): <strong>{capitalizarNombre(cliente.Nombre)}</strong>
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} mb={3}>
            <Typography variant="h6" color={theme.palette.secondary.main}>
              ¡Impulsa tu patrimonio!
Actualiza e incrementa tu aporte. Para tu comodidad, puedes establecer débitos automáticos con tu tarjeta de crédito o débito.
            </Typography>
            <br />
            {isOVP && (
              <Typography variant="h5" color={theme.palette.secondary.main}>
                <strong>Importante: Por tu seguridad para continuar debes verificar tu información. Este formulario estará disponible durante las próximas 48 horas.</strong>
              </Typography>
            )}
          </Grid>
        </Grid>
        {loading ? (
          <Typography>Cargando datos ...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <ClienteProvider>
            <EditDialogProvider>
              <Form1 listCuentas={listCuentas} id={id} />
            </EditDialogProvider>
          </ClienteProvider>
        )}
      </Container>
    </div>
  );
};

export default App;
