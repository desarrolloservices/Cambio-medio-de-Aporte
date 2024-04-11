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
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Icon,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormContext } from "../Context/FormContext"; // Import the FormContext
import SwitchAccessShortcutAddIcon from '@mui/icons-material/SwitchAccessShortcutAdd';
import Navegador from "./Navegador";
import { NumericFormat } from "react-number-format";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MaskExpiry from "./MaskExpiry";

import EastIcon from '@mui/icons-material/East';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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
  const { formData, handleInputChange, handleSelectChange, handleToggle } =
    useContext(FormContext); // Use the FormContext
    const cuentas = ["13242","243242","434343" ];
    const planes = [
      {
        "id": 1,
        "nombre": "Plan A",
        "prima": 34,
        "sumaAsegurada": 1000000
      },
      {
        "id": 2,
        "nombre": "Plan B",
        "prima": 100,
        "sumaAsegurada": 3000000
      },
      {
        "id": 3,
        "nombre": "Plan C",
        "prima": 167,
        "sumaAsegurada": 500000
      },
      {
        "id": 4,
        "nombre": "Plan D",
        "prima": 334,
        "sumaAsegurada": 1000000
      },
      {
        "id": 5,
        "nombre": "Plan E",
        "prima": 667,
        "sumaAsegurada": 2000000
      },
      {
        "id": 6,
        "nombre": "Plan F",
        "prima": 834,
        "sumaAsegurada": 2500000
      },
      {
        "id": 7,
        "nombre": "Plan G",
        "prima": 1000,
        "sumaAsegurada": 3000000
      }
    ];

    const planesDolares = [
      {
        "id": 1,
        "nombre": "Plan A",
        "prima": 1.70,
        "sumaAsegurada": 5000
      },
      {
        "id": 2,
        "nombre": "Plan B",
        "prima": 5.00,
        "sumaAsegurada": 15000
      },
      {
        "id": 3,
        "nombre": "Plan C",
        "prima": 8.34,
        "sumaAsegurada": 25000
      },
      {
        "id": 4,
        "nombre": "Plan D",
        "prima": 17.00,
        "sumaAsegurada": 50000
      },
      {
        "id": 5,
        "nombre": "Plan E",
        "prima": 27.00,
        "sumaAsegurada": 80000
      },
      {
        "id": 6,
        "nombre": "Plan F",
        "prima": 34.00,
        "sumaAsegurada": 100000
      },
      {
        "id": 7,
        "nombre": "Plan G",
        "prima": 41.00,
        "sumaAsegurada": 122500
      }
    ];

    const columns: GridColDef[] = [
      { field: 'nombre', headerName: 'Plan', width: 70 },
      { field: 'prima', headerName: 'prima', width: 130 },
      { field: 'sumaAsegurada', headerName: 'sumaAsegurada', width: 130 },

    ];
    

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
              inputProps={{startAdornment: 
                <InputAdornment position="start">
              <EastIcon />
              </InputAdornment>
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
            customInput={TextField}
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
      
        <Grid item xs={12} >
        <Typography
            variant="h6"
            align="justify"
            color={theme.palette.secondary.main}
            mb={2}
          >
            Adquiere tu seguro de vida opcional:
          </Typography>
          <Typography align="left" color={theme.palette.primary.main} mb={2}>
            Selecciona tu plan:
          </Typography>
            {/* <List
              dense
              sx={{ width: "100%", maxWidth: 560, bgcolor: "background.paper" }}
            >
              {planes.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;

                return (
                  <ListItem
                    key={value.nombre}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    }
                    disablePadding
                  >
                    <ListItemButton>
                      <ListItemText
                        id={labelId}
                        primary={`${value.nombre} - Prima: $${value.prima} - Suma Asegurada: $${value.sumaAsegurada}`}
                        
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List> */}
            <DataGrid
        rows={planes}
        columns={columns}
        
       
        checkboxSelection
        
      />
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
                label="Número de la Tarjeta"
                variant="outlined"
                type="number"
                value={formData?.cardnumber}
                //onChange={handleSelectChange}
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
                    onChange={(e) =>
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
                  {
                    [
                      "0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28"
                    ].map((value) => {
                      return (
                        <MenuItem value={value} key={value}>{value}</MenuItem>
                      );
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
          </>
        )}

        <Navegador />
      </Grid>
    </form>
  );
};

export default Form1;
