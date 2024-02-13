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
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormContext } from "../Context/FormContext"; // Import the FormContext
import Navegador from "./Navegador";

interface Props {
  // Propiedades del componente
}

const Form4: React.FC<Props> = (props) => {
  // Lógica del componente
  const { formData, handleInputChange, handleNext, handleBack, activeStep } =
    useContext(FormContext); // Use the FormContext

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="formaPagoLabel">Forma de Pago</InputLabel>
            <Select
              labelId="formaPagoLabel"
              id="formaPago"
              // value={formData.formaPago}
              // onChange={handleInputChange}
            >
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="tarjeta">Tarjeta</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="banco"
            label="Banco"
            // value={formData.banco}
            // onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="numero"
            label="Número"
            // value={formData.numero}
            // onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="mes"
            label="Mes"
            // value={formData.mes}
            // onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="anio"
            label="Año"
            // value={formData.anio}
            // onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de Primer Aporte"
              // value={formData.fechaPrimerAporte}
              // onChange={handleInputChange}
              // renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
           </FormControl>
        </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de Aportes Mensuales"
              // value={formData.fechaAportesMensuales}
              // onChange={handleInputChange}
              // renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="moneda"
            label="Moneda"
            // value={formData.moneda}
            // onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="aporteInicial"
            label="Aporte Inicial"
            // value={formData.aporteInicial}
            // onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="aportePeriodico"
            label="Aporte Periódico"
            // value={formData.aportePeriodico}
            // onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="totalAportes"
            label="Total de Aportes"
            // value={formData.totalAportes}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Navegador />
    </form>
  );
};

export default Form4;
      
   