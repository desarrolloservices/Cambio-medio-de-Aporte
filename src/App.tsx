import React, { useState } from 'react';
import logo from './Assets/logo.png';
import './App.css';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Container,
  ButtonGroup,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Slider,
  Modal,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  InputAdornment,
  ListItem,
  List,
  ListItemText,
  ListItemIcon,
  createTheme,
  ThemeProvider,
} from "@mui/material";


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

  const [activeStep, setActiveStep] = useState(0);

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
    <ThemeProvider theme={theme}>
    <div className="App">
      <Container>
        <Grid container mt={5}>
          <Grid item xs={12} sx={{justifyContent:'center',textAlign:'center',alignItems:'center',display:'flex',flexDirection:'row'}}>
            <img src={logo} alt="Logo" style={{height:'70px'}}/>
          </Grid>
          <Grid item xs={12} sx={{justifyContent:'center',textAlign:'center',alignItems:'center',display:'flex',flexDirection:'row'}} mt={4}>
          <Typography variant='h5' color={'gray'}>
            Formulario de Afiliación Simplificada
          </Typography>
          </Grid>
        </Grid>
        <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ marginTop: "40px" }}
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
            {
              activeStep === 0 && <><Typography variant='h6' color={'gray'} mt={4}>Paso 1</Typography> <Button onClick={handleBack}>Regresar</Button><Button onClick={handleNext}>Siguiente</Button></>
            }
             {
              activeStep === 1 && <><Typography variant='h6' color={'gray'} mt={4}>Paso 2</Typography> <Button onClick={handleBack}>Regresar</Button><Button onClick={handleNext}>Siguiente</Button></>
            }
            {
              activeStep === 2 && <><Typography variant='h6' color={'gray'} mt={4}>Paso 2</Typography> <Button onClick={handleBack}>Regresar</Button><Button onClick={handleNext}>Siguiente</Button></>
            }
            {
              activeStep === 3 && <><Typography variant='h6' color={'gray'} mt={4}>Paso 2</Typography> <Button onClick={handleBack}>Regresar</Button></>
            }
      </Container>
    </div>
    </ThemeProvider>
  );
}

export default App;
