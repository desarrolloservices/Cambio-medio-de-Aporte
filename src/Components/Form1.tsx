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
  FormControlLabel,
  Checkbox,
  createTheme,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormContext } from "../Context/FormContext"; // Import the FormContext
import Navegador from "./Navegador";

interface Props {
  // Propiedades del componente
}

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

const Form1: React.FC<Props> = (props) => {
  // Lógica del componente
  const { formData, handleInputChange, handleNext, handleSelectChange,setFormData,handleGeneroChange } =
    useContext(FormContext); // Use the FormContext
    const [dobleNacionalidad, setDobleNacionalidad] = React.useState(false);

  return (
    <form>
      <Grid container spacing={2} rowSpacing={4}>
        <Grid item xs={12} sm={12}>
          <Typography align="justify" variant="h6" color={theme.palette.secondary.main}>
            Incrementa tu aporte:
          </Typography>
          <br />
          <TextField
            name="aporte"
            label="Aporte"
            value={formData.aporte}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}  >
          <Typography  variant="h6" align="justify" color={theme.palette.secondary.main}>
            Aumenta tu prima de seguro:
          </Typography>
<br />
      
          <TextField
            name="tipoIdentificacion"
            label="Tipo de Identificación"
            value={formData.tipoIdentificacion}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
       
       
       
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" align="justify" color={theme.palette.secondary.main}>
            Actualiza tu forma de pago:
          </Typography>

      <br />
          <FormControl fullWidth>
            <InputLabel>Departamento</InputLabel>
            <Select
            multiple={false}
              name="departamento"
              value={formData.departamento}
             onChange={handleSelectChange}
            >
              <MenuItem value="Departamento 1" >Carné</MenuItem>
              <MenuItem value="Departamento 2">Débito a Tarjeta</MenuItem>
             
            </Select>
          </FormControl>
        </Grid>
        <Navegador />
      </Grid>
    </form>
  );
};

export default Form1;
