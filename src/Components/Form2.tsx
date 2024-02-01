import React, { useContext } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  ButtonGroup,
  Divider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormContext } from "../Context/FormContext"; // Import the FormContext

interface Props {
  // Propiedades del componente
}

const Form2: React.FC<Props> = (props) => {
  // Lógica del componente
  const { formData, handleInputChange, handleNext, handleBack, handleSelectChange } =
    useContext(FormContext); // Use the FormContext

  return (
    <form>
      <Grid container spacing={2}>
        
       
       
  
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Nivel de Escolaridad</InputLabel>
            <Select
              name="nivelEscolaridad"
              label="Nivel de Escolaridad"
              value={formData.nivelEscolaridad}
              onChange={handleSelectChange}
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
              label="Profesión"
              value={formData.profesion}
              onChange={handleSelectChange}
            >
              <MenuItem value="Ingeniero">Ingeniero</MenuItem>
              <MenuItem value="Médico">Médico</MenuItem>
              <MenuItem value="Abogado">Abogado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
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
            name="fuenteIngresos"
            label="Fuente de Ingresos"
            value={formData.fuenteIngresos}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="ingresosMensuales"
            type="number"
            label="Ingresos Mensuales"
            value={formData.ingresosMensuales}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="centroTrabajo"
            label="Centro de trabajo"
            value={formData.centroTrabajo}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Actividad Económica</InputLabel>
            <Select
              name="actividadEconomica"
              value={formData.actividadEconomica}
              onChange={handleSelectChange}
            >
              <MenuItem value="Actividad 1">Actividad 1</MenuItem>
              <MenuItem value="Actividad 2">Actividad 2</MenuItem>
              <MenuItem value="Actividad 3">Actividad 3</MenuItem>
            </Select>
          </FormControl>
       </Grid>
       <Grid container>
       <Grid item xs={6}>
          <Button onClick={handleBack}>Regresar</Button>
        </Grid >
        <Grid item xs={6}>
          <Button onClick={handleNext}>Siguiente</Button>
        </Grid>
       </Grid>
     
       
      </Grid>
    </form>
  );
};

export default Form2;
