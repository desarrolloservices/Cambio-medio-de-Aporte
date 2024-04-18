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
              <Typography variant="h4" color={theme.palette.primary.main}>
                Aumenta tu ahorro y alcanza tus metas!
              </Typography>
            </Grid>
            <Grid item xs={12} mb={3}>
              <Typography variant="h5" color={theme.palette.secondary.main}>
                Estimado(a): <strong>DEMO</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} mb={3}>
              <Typography variant="body1" color={theme.palette.secondary.main}>
              ¡Haz crecer tu patrimonio! Incrementa tu aporte mensual y asegura un mañana próspero para ti y tu familia. Cada paso cuenta en el camino hacia tus metas financieras, en el presente y futuro, Tu mejora Aliado, eres Tú.
Para tu comodidad, afilia tu aporte a un medio automático con tu tarjeta de crédito o débito.
 

              </Typography>
              <br />
              <Typography variant="body1" color={theme.palette.secondary.main}>
              Nota: Este formulario estará disponible durante las próximas 48 horas.  ¡No pierdas la oportunidad de mejorar tu futuro!
              </Typography>
            </Grid>
          </Grid>
          {/* <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ marginTop: "40px", marginBottom: "40px" }}
          >
            <Step>
              <StepLabel>Ingresa tus datos</StepLabel>
            </Step>
            <Step>
              <StepLabel>Valida tus datos</StepLabel>
              </Step>
            <Step>
              <StepLabel>Confirmar</StepLabel>
            </Step>
          </Stepper> */}
          <Form1 />
          {/* {activeStep === 0 && <Form1 />}
          {activeStep === 1 && (
             <Form2 />
          )}
          {activeStep === 2 && (
            <Form3 />
          )} */}
        </Container>
      </div>
    </div>
  );
};

export default App;
