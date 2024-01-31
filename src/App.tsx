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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


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
  };

  const handleDateChange = (date:any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fechaNacimiento: date,
    }));
  };

  const handleSubmit = (event:any) => {
    event.preventDefault();
    // Handle form submission logic here
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
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              sx={{ marginTop: "40px",marginBottom: "40px"}}
              
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
              activeStep === 0 && <>
   <form onSubmit={handleSubmit} >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              name="primerNombre"
              label="Primer Nombre"
              value={formData.primerNombre}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="segundoNombre"
              label="Segundo Nombre"
              value={formData.segundoNombre}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="primerApellido"
              label="Primer Apellido"
              value={formData.primerApellido}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="segundoApellido"
              label="Segundo Apellido"
              value={formData.segundoApellido}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
            
            <ButtonGroup variant="outlined" aria-label="outlined primary button group" >
  <Button  value={formData.genero}
                onChange={handleInputChange}>F</Button>
  <Button  value={formData.genero}
                onChange={handleInputChange}>M</Button>
</ButtonGroup>
              
                
               
            
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="tipoIdentificacion"
              label="Tipo de Identificación"
              value={formData.tipoIdentificacion}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="numeroIdentificacion"
              label="N° de Identificación"
              value={formData.numeroIdentificacion}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="nacionalidad1"
              label="Nacionalidad 1"
              value={formData.nacionalidad1}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="nacionalidad2"
              label="Nacionalidad 2"
              value={formData.nacionalidad2}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
         
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth >
          <DatePicker/>
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="correoElectronico"
              label="Correo Electrónico"
              value={formData.correoElectronico}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Nivel de Escolaridad</InputLabel>
              <Select
                name="nivelEscolaridad"
                value={formData.nivelEscolaridad}
                onChange={handleInputChange}
              >
                <MenuItem value="Primaria">Primaria</MenuItem>
                <MenuItem value="Secundaria">Secundaria</MenuItem>
                <MenuItem value="Universidad">Universidad</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Profesión</InputLabel>
              <Select
                name="profesion"
                value={formData.profesion}
                onChange={handleInputChange}
              >
                <MenuItem value="Ingeniero">Ingeniero</MenuItem>
                <MenuItem value="Médico">Médico</MenuItem>
                <MenuItem value="Abogado">Abogado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="ocupacion"
              label="Ocupación"
              value={formData.ocupacion}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="telefonoFijo"
              label="Teléfono Fijo"
              value={formData.telefonoFijo}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="celular"
              label="Celular"
              value={formData.celular}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="direccionResidencia"
              label="Dirección de Residencia"
              value={formData.direccionResidencia}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="municipio"
              label="Municipio"
              value={formData.municipio}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Departamento</InputLabel>
              <Select
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
              >
                <MenuItem value="Departamento 1">Departamento 1</MenuItem>
                <MenuItem value="Departamento 2">Departamento 2</MenuItem>
                <MenuItem value="Departamento 3">Departamento 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <Button onClick={handleNext}>Siguiente</Button>
          </Grid>
          
        </Grid>
      </form>


      



   

                              </>
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
    </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
