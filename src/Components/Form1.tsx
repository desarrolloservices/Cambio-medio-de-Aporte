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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormContext } from "../Context/FormContext"; // Import the FormContext
import Navegador from "./Navegador";

interface Props {
  // Propiedades del componente
}

const Form1: React.FC<Props> = (props) => {
  // Lógica del componente
  const { formData, handleInputChange, handleNext, handleSelectChange,setFormData,handleGeneroChange } =
    useContext(FormContext); // Use the FormContext
    const [dobleNacionalidad, setDobleNacionalidad] = React.useState(false);

  return (
    <form>
      <Grid container spacing={2} rowSpacing={4}>
        <Grid item xs={12} sm={12}>
          <TextField
            name="primerNombre"
            label="Nombre Completo"
            value={formData.primerNombre}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        {/* <Grid item xs={12} sm={3}>
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
        </Grid> */}
        <Grid item xs={12}  >
          <FormControl
            fullWidth
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <ButtonGroup
              variant="outlined"
              aria-label="outlined primary button group"
              
              
            >
              <Button name="genero" value={formData.genero} onClick={()=>{handleGeneroChange("F")}} 
              variant={
                formData.genero === "F" ? "contained" : "outlined"
              }
              >
                F
              </Button>
              <Button value={formData.genero} onClick={()=>{handleGeneroChange("M")}}
               variant={
                formData.genero === "M" ? "contained" : "outlined"
              }
              >
                M
              </Button>
            </ButtonGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            
            <DatePicker   label={"Fecha de nacimiento"} />
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
        <FormControlLabel
    control={
      <Checkbox
        checked={dobleNacionalidad}
        onChange={(event) => setDobleNacionalidad(event.target.checked)}
        name="dobleNacionalidad"
        color="secondary"
      />
    }
    label="¿Tiene doble nacionalidad?"
  />
        </Grid>
        {
            dobleNacionalidad && (
                <Grid item xs={12}>
                <TextField
                    name="nacionalidad2"
                    label="Nacionalidad 2"
                    value={formData.nacionalidad2}
                    onChange={handleInputChange}
                    fullWidth
                />
                </Grid>
            )
        }
        

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
          <TextField
            name="celular"
            label="Celular"
            value={formData.celular}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
   
        <Grid item xs={12} sm={12}>
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
            multiple={false}
              name="departamento"
              value={formData.departamento}
             onChange={handleSelectChange}
            >
              <MenuItem value="Departamento 1" >Departamento 1</MenuItem>
              <MenuItem value="Departamento 2">Departamento 2</MenuItem>
              <MenuItem value="Departamento 3">Departamento 3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            name="direccionResidencia"
            label="Dirección de Residencia"
            value={formData.direccionResidencia}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Navegador />
      </Grid>
    </form>
  );
};

export default Form1;
