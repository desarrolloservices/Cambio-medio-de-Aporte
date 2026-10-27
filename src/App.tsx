import React, { useContext, useEffect } from "react";
import logo from "./Assets/logo.png";
import "./App.css";
import {
  Grid,
  Container,
  Typography,
  createTheme,
  ThemeProvider,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormProvider, FormContext } from "./Context/FormContext";
import useProductos from "./Hooks/UseProductosCliente";
import { saveTokenFromUrl, getPostLogoutRedirectKey } from "./Data/setCookies";
import useValidateToken from "./Hooks/UseValidateTk";
import { ClienteProvider, useClienteContext } from "./Context/ClienteContext";
import Form1 from "./Components/Form1";
import { EditDialogProvider } from "./Context/EditDialogContext";
import Alerta from "./Assets/Alerta.png";
import SessionExpiredRequest from "./Components/SessionExpiredRequest";


const theme = createTheme({
  typography: { fontFamily: "Nunito Sans, Roboto, sans-serif" },
  palette: { primary: { main: "#d8282f" }, secondary: { main: "#76777B" } },
  shape: { borderRadius: 13 },
});

const capitalizarNombre = (nombre = "") =>
  nombre
    .toLowerCase()
    .split(" ")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

const ClienteGreeting: React.FC = () => {
  const { cliente } = useClienteContext();

  if (!cliente) {
    return null;
  }

  return (
    <Typography variant="h5" color={theme.palette.secondary.main}>
      Estimado(a): <strong>{capitalizarNombre(cliente.Nombre)}</strong>
    </Typography>
  );
};

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
  const { isValid, isLink, id, ready, sessionExpired } = useValidateToken();

  const { setActiveStep, setFormData } = useContext(FormContext);

  const { listCuentas, loading, error } = useProductos({
    enabled: isValid === true,
  });
  useEffect(() => {
    saveTokenFromUrl();
  }, []);

  useEffect(() => {
    if (setActiveStep) setActiveStep(0);
  }, [setActiveStep]);

  useEffect(() => {
    if (isValid && !loading && listCuentas.length > 0 && setFormData) {
      const firstCuenta = listCuentas[0];
      setFormData(prev => ({
        ...prev,
        cuenta: firstCuenta.cuenta,
        moneda: firstCuenta.moneda,
      }));
    }
  }, [isValid, loading, listCuentas, setFormData]);

  useEffect(() => {
    if (isValid === false && typeof window !== "undefined") {
      const key = getPostLogoutRedirectKey();
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
        window.location.href = "https://www.afpatlantida.com";
      }
    }
  }, [isValid]);

  if (isValid === null) {
    return (
      <Container>
        <Typography variant="h6" color="textSecondary">
          Validando sesion...
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
          p: 2,
        }}
      >
        <img src={Alerta} alt="Alerta" style={{ width: 100, marginBottom: 20 }} />
        <Typography variant="h4" color="error" gutterBottom>
          El link ha expirado
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Por favor, ingrese nuevamente desde el enlace proporcionado en su correo.
        </Typography>
        {sessionExpired && <SessionExpiredRequest />}
      </Box>
    );
  }

  const providerEnabled = ready && isValid === true;

  return (
    <div className="App">
      <Container>
        <ClienteProvider enabled={providerEnabled}>
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
                mb: "40px",
              }}
            >
              <img src={logo} alt="Logo" style={{ height: 70 }} />
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
              ¡Impulsa tu patrimonio!
              </Typography>
            </Grid>

            <Grid item xs={12} mb={3}>
              <ClienteGreeting />
            </Grid>

            <Grid item xs={12} mb={3}>
              <Typography variant="h6" color={theme.palette.secondary.main}>
              Modifica tu medio de aporte con tarjeta de crédito, débito o cuenta de ahorro de Banco Atlántida.
               
              </Typography>
              <br />
              {isLink && (
                <Typography variant="h6" color={theme.palette.secondary.main}>
                  <strong>
                  Importante:</strong> Para tu seguridad, debes verificar tu información, este formulario estará disponible 48 horas.

                </Typography>
              )}
            </Grid>
          </Grid>

          {loading ? (
            <Typography>Cargando datos ...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <EditDialogProvider>
              <Form1 listCuentas={listCuentas} id={id} />
            </EditDialogProvider>
          )}
        </ClienteProvider>
      </Container>
    </div>
  );
};

export default App;
