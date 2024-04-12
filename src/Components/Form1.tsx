import React, { useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,

  createTheme,
  Typography,
  InputAdornment,

  Slider,
  Box,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormContext } from "../Context/FormContext"; // Import the FormContext
import SwitchAccessShortcutAddIcon from "@mui/icons-material/SwitchAccessShortcutAdd";
import Navegador from "./Navegador";
import { NumericFormat } from "react-number-format";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MaskExpiry from "./MaskExpiry";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EastIcon from "@mui/icons-material/East";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Plan } from "../Interfaces/Tipos";
import { planes,planesDolares } from "../CustomData/Planes";

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
  const { formData, handleInputChange, handleSelectChange,setFormData } =
    useContext(FormContext); // Use the FormContext
  const cuentas = ["13242", "243242", "434343"];
  
  
  const [planSeleccionado,setPlanSeleccionado] = React.useState<Plan>(planes[0]);
  

  const filterPlanes = (prima:number) => {
    setPlanSeleccionado(
      planes.filter(plan => plan.prima === prima)[0]
    )
  
  }

useEffect(() => {
  if(setFormData){
    setFormData((prev) => ({
      ...prev,
      prima: planSeleccionado.prima,
      sumaAsegurada: planSeleccionado.sumaAsegurada
    }))
  }

}, [planSeleccionado])


  return (
    <form>
      <Grid container spacing={2} rowSpacing={4}>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="cuenta-label">Selecciona tu cuenta</InputLabel>
            <Select
              labelId="cuenta-label"
              id="cuenta"
              required
              name="cuenta"
              label="Selecciona tu cuenta"
              onChange={handleSelectChange}
              value={formData.cuenta}
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EastIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value={124454}>124454</MenuItem>
              <MenuItem value={34454}>34454</MenuItem>
              <MenuItem value={54545}>54545</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography
            align="justify"
            variant="h6"
            color={theme.palette.secondary.main}
          >
            Incrementa tu aporte:
          </Typography>
          <br />
          <NumericFormat
            required
            name="aporte"
            customInput={TextField}
            onChange={handleInputChange}
            label="Monto del Aporte"
            isAllowed={(values) => {
              const { floatValue } = values;
              return floatValue !== undefined && floatValue <= 100000;
            }}
            max={100000}
            min={0}
            thousandSeparator={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),

              inputProps: { min: 0, max: 1000000 },
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Grid sx={{display:"flex", alignItems: 'center',
    flexWrap: 'wrap',flexDirection:"row",alignContent:"center"}} gap={1} mb={2}>
          <LocalOfferIcon color="primary" fontSize="small"  />
          <Typography
            variant="h6"
             
            color={theme.palette.secondary.main}
          
          >
            
            Adquiere tu seguro de vida opcional:
          </Typography>
          </Grid>
          <Typography
            variant="h6"

            color={theme.palette.secondary.main}
          
          >
            
            Plan Seleccionado: <strong>{planSeleccionado.nombre}</strong>
          </Typography>
          <Typography
            variant="body1"
        
            color={theme.palette.secondary.main}
          
          >
            
            Suma Asegurada: <strong>{planSeleccionado.sumaAsegurada}</strong>
          </Typography>

          <Typography align="left" color={theme.palette.primary.main} mb={2}>
            Selecciona tu plan:
          </Typography>
         
          <Box
            sx={{
              width: "90%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              margin: "auto",
            }}
          >
            <Slider
              aria-label="Small steps"
              defaultValue={0}
              aria-valuetext={"valuetex"}
              onChange={(e, value) => filterPlanes(value as number)}
              marks={planes.map((value) => ({
                value: value.prima,
                label: String(value.prima),
              }))}
              min={Math.min(...planes.map((o) => o.prima))}
              max={Math.max(...planes.map((o) => o.prima))}
              step={null}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Typography
            variant="h6"
            align="justify"
            color={theme.palette.secondary.main}
          >
            Actualiza tu forma de pago: {formData.formaPago}
          </Typography>

          <br />
          <FormControl fullWidth>
            <InputLabel>Forma de Pago</InputLabel>
            <Select
              multiple={false}
              label="Forma de Pago"
              name="formaPago"
              value={formData.formaPago}
              onChange={handleSelectChange}
            >
              <MenuItem value="Carné">Carné</MenuItem>
              <MenuItem value="Débito a Tarjeta">Débito a Tarjeta</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {formData.formaPago === "Débito a Tarjeta" && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                id="cardnumber"
                name="cardnumber"
                label="Número de la Tarjeta"
                variant="outlined"
                type="number"
                value={parseInt(formData?.cardnumber)}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <FormControl>
                <MaskExpiry
                  id="expiryDate"
                  label="Fecha de vencimiento"
                  placeholder="MM / YY"
                  variant="outlined"
                  value={formData.expiryDate}
                  name="expiryDate"
                  onChange={
                    (e) =>
                      //setState({ ...state, expiry: e.target.value })
                      console.log("Cambiando fecha de vencimiento")
                    //IMask.onChange={console.log("Cambiando fecha de vencimiento")}
                  }
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Día del débito</InputLabel>
                <Select
                  multiple={false}
                  label="Día del débito"
                  name="diaDebito"
                  value={formData.diaDebito}
                  onChange={handleSelectChange}
                  defaultValue="15"
                >
                  {[
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                    "16",
                    "17",
                    "18",
                    "19",
                    "20",
                    "21",
                    "22",
                    "23",
                    "24",
                    "25",
                    "26",
                    "27",
                    "28",
                  ].map((value) => {
                    return (
                      <MenuItem value={value} key={value}>
                        {value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        {Navegador && <Navegador />}
      </Grid>
    </form>
  );
};

export default Form1;
