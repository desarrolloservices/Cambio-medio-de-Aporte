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
import Form2 from "./Components/Form2";
import Form3 from "./Components/Form3";
import Form4 from "./Components/Form4";

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
              mt={4}
            >
              <Typography variant="h5" color={"gray"}>
                Formulario de Afiliación Simplificada
              </Typography>
            </Grid>
          </Grid>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ marginTop: "40px", marginBottom: "40px" }}
          >
            <Step>
              <StepLabel>Datos del Solicitante</StepLabel>
            </Step>
            <Step>
              <StepLabel>Información Laboral</StepLabel>
            </Step>
            <Step>
              <StepLabel>Beneficiarios Directos</StepLabel>
            </Step>
            <Step>
              <StepLabel>Aportaciones</StepLabel>
            </Step>
          </Stepper>
          {activeStep === 0 && <Form1 />}
          {activeStep === 1 && (
             <Form2 />
          )}
          {activeStep === 2 && (
            <Form3 />
          )}
          {activeStep === 3 && (
            <Form4/>
          )}
        </Container>
      </div>
    </div>
  );
};

export default App;
