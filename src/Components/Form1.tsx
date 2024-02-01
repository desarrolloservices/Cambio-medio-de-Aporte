import React, { useContext } from 'react';
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
import { FormContext } from '../Context/FormContext'; // Import the FormContext


interface Props {
    // Propiedades del componente
}

const Form1: React.FC<Props> = (props) => {
    // Lógica del componente
    const { formData, handleInputChange,handleNext,handleBack,activeStep } = useContext(FormContext); // Use the FormContext

    return (
        <form>
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
<Button value={formData.genero} onClick={()=>handleInputChange}>F</Button>
  <Button  value={formData.genero}
                onChange={()=>handleInputChange}>M</Button>
</ButtonGroup>
              
                
               
            
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth >
          <DatePicker/>
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="tipoIdentificacion"
              label="Tipo de Identificación"
              value={formData.tipoIdentificacion}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
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
                onChange={()=>handleInputChange}
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
                onChange={()=>handleInputChange}
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
                onChange={()=>handleInputChange}
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
    );
};

export default Form1;
