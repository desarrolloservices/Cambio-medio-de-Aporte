import React, { useContext, useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardHeader,
  createTheme,
  Typography,
  InputAdornment,
  Slider,
  Box,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Divider,
  Input,
  OutlinedInput,
  Stack,
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
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Plan, RawData, cuenta } from "../Interfaces/Tipos";
import { planes, planesDolares, Bancos } from "../CustomData/Planes";
import { InfoConsulta } from "../Data/GetDatosClientes";

import LoyaltyIcon from '@mui/icons-material/Loyalty';
import CreditScoreRoundedIcon from '@mui/icons-material/CreditScoreRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import UpdateIcon from '@mui/icons-material/Update';
import InputMask from 'react-input-mask';
import { TextInputMask } from "react-native-masked-text";
import { IMaskInput } from "react-imask";
import useTwilio from "../Hooks/UseTwlo";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';
import { wait } from "@testing-library/user-event/dist/utils";
import { createVeriffFrame } from "@veriff/incontext-sdk";
import VeriffDialog from "./VeriffDialog";
import useExtractRawData from "../Hooks/useExtractRawData";
import VeriffComponentClick from "./VeriffDialogClick";
import VeriffComponent from "./VeriffDialog";

interface Props {
  listCuentas: cuenta[];
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





interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00/00"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

<Input />
const Form1: React.FC<Props> = ({ listCuentas }) => {
  

  /*const rawData = [
    {
      "ID": 9395,
      "Tarjeta": "4009501009683871",
      "DiaDebito": "16",
      "TipoDebito": { "Value": "UNICO" }
    },
    {
      "ID": 9396,
      "Tarjeta": "4009501009683871",
      "DiaDebito": "16",
      "TipoDebito": { "Value": "MENSUAL" }
    }
  ];*/



  const maskCardNumber = (cardNumber: string) => {
    return `•••• •••• •••• ${cardNumber.slice(-4)}`;
  };
  const handleEdit = (row: any) => {
    alert(`Editing: ${JSON.stringify(row, null, 2)}`);
  };

// Function to handle delete action
const handleDelete = (row: any) => {
  alert(`Deleting: ${row.ID}`);
};
  

  // Function to clean HTML tags from the Identidad field
const cleanHTML = (htmlString: string) => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlString;
  return tempElement.textContent || tempElement.innerText || "";
};

// Define the columns
// Define the columns
const columns: GridColDef[] = [
  { 
    field: "Tarjeta", 
    headerName: "Tarjeta", 
    flex: 1, // Makes the column fill space dynamically
    minWidth: 200,
    valueGetter: (params) => maskCardNumber(params.row.Tarjeta) 
  },
  { 
    field: "DiaDebito", 
    headerName: "Día Débitos", 
    flex: 1, 
    minWidth: 120 
  },
  { 
    field: "TipoDebito", 
    headerName: "Tipo Débito", 
    flex: 1, 
    minWidth: 150, 
    valueGetter: (params) => params.row.TipoDebito 
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    minWidth: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <Stack direction="row" spacing={1} justifyContent="flex-end" width="100%">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(params.row)}
        >
          Agregar
        </Button>
      </Stack>
    ),
  },
];
  // Temp demo data




  // Lógica del componente
  const [code, setCode] = useState("");
  const {enviarCode,enviandoCode,validarCode,confirmado,validandoCode,confirmadoError,setValidandoCode} = useTwilio();

  const { formData, handleInputChange, handleSelectChange, setFormData } =
  useContext(FormContext); // Use the FormContext

const [moneda, setMoneda] = useState("L");

  const [planSeleccionado, setPlanSeleccionado] = React.useState<Plan>(
    planes[0]
  );

  const [cuentaSeleccionada, setCuentaSeleccionada] = React.useState<cuenta>(
    listCuentas[0]
  );

  // Use the custom hook
  const { rawData, loadingData, errorData } = useExtractRawData({
    cuenta: cuentaSeleccionada.cuenta,
  });


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filterPlanes = (prima: number) => {
    setPlanSeleccionado(planes.filter((plan) => plan.prima === prima)[0]);
  };

  const filterCuentas = (cuentaRecibida: string) => {
    const foundCuenta = listCuentas.find((cuenta) => cuenta.cuenta === cuentaRecibida);

    if (foundCuenta) {
      setCuentaSeleccionada(foundCuenta);
    } else {
      console.error(`Cuenta no encontrada: ${cuentaRecibida}`);
      // Handle the case where the cuenta is not found, e.g., setCuentaSeleccionada(null) or show an error message
    }
  }

 


  const handleCODE = (codigo:string)=>{
    setCode(codigo);
    const largo = codigo.length;
    
    if (largo===6){
      setValidandoCode(true);
      validarCode("+50499787930",codigo);
      console.log("6 Caracteres")
    }
    wait(3000).then(()=>{
      setValidandoCode(false);
      setCode("")
    });
   

  }

  useEffect(() => {
    console.log("Cuenta seleccionada: ", cuentaSeleccionada);
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        prima: planSeleccionado.prima,
        sumaAsegurada: planSeleccionado.sumaAsegurada,
        cuenta: cuentaSeleccionada.cuenta,
        moneda: cuentaSeleccionada.moneda,
        aporte: cuentaSeleccionada.aporte.toString(),
      }));
    }
    setMoneda(cuentaSeleccionada.moneda);
     // Call fetchDataForAccount when cuentaSeleccionada changes
    
  },[cuentaSeleccionada]);
   
  
 
  useEffect(() => {
    console.log("Cambiando plan seleccionado");
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        prima: planSeleccionado.prima,
        sumaAsegurada: planSeleccionado.sumaAsegurada,
        cuenta: cuentaSeleccionada.cuenta,
        moneda: cuentaSeleccionada.moneda,
      }));
    }
    setMoneda(cuentaSeleccionada.moneda);
  }, [planSeleccionado, cuentaSeleccionada]);



  return (
    <form>
        <Grid container mt={5} mb={5}>
          <Grid item xs={12}>
         
            <VeriffComponent /> {/* Use the new component */}
          </Grid>
        </Grid>
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
              onChange={(e, value) => filterCuentas(e.target.value as string)}
              value={formData.cuenta}
              startAdornment={
                <InputAdornment position="start">
                  <SavingsRoundedIcon sx={{color:theme.palette.primary.main}}/>
                </InputAdornment>
              }

            >
              {listCuentas.map((cuenta) => (
      <MenuItem value={cuenta.cuenta} key={cuenta.cuenta}>
        {cuenta.cuenta}
      </MenuItem>
    ))}
            </Select>
          </FormControl>
        </Grid>

        {/* APORTE */}
       
        
        

        <Grid item xs={12}>
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              flexDirection: "row",
              alignContent: "center",
            }}
            gap={1}
            mb={2}
          >
            {/* <LoyaltyIcon color="primary" fontSize="small" /> */}
   
          </Grid>

          {/* <Box
            sx={{
              width: "90%",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              margin: "auto",
            }}
            mb={2}
          >
            <Slider
              aria-label="Small steps"
              defaultValue={0}
              aria-valuetext={"valuetex"}
              onChange={(e, value) => filterPlanes(value as number)}
              marks={planes.map((value) => ({
                value: value.prima,
                label: `${moneda} ${value.prima}`,
              }))}
              min={Math.min(...planes.map((o) => o.prima))}
              max={Math.max(...planes.map((o) => o.prima))}
              step={null}
              valueLabelDisplay="auto"
              sx={{ display: { xs: "none", md: "block" } }}
            />
          </Box> */}
          
          
        </Grid>

        <Grid item xs={12} sm={12}>
        <Typography
            variant="h6"
            align="justify"
            color={theme.palette.secondary.main}
          >
            Tus medios de pago:
          </Typography>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <DataGrid
        rows={rawData}
        columns={columns}
        getRowId={(row) => row.ID} // Using ID as unique key
        autoHeight // Fixes bottom blank space issue
        disableColumnMenu // Hides unnecessary column settings
        disableRowSelectionOnClick // Prevents row selection when clicking buttons
        hideFooterPagination={rawData.length <= 5} // Hides pagination if rows are 5 or less
        pageSizeOptions={[5, 10]}
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
              defaultValue="Carné"
              value={formData.formaPago}
              onChange={handleSelectChange}
              startAdornment={
                <InputAdornment position="start">
                  <UpdateIcon sx={{color:theme.palette.primary.main}}/>
                </InputAdornment>
              }
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
                      <CreditCardIcon sx={{color:theme.palette.primary.main}} />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <FormControl>
                {/* <MaskExpiry
                  id="expiryDate"
                  label="Fecha de vencimiento"
                  placeholder="MM / YY"
                  variant="outlined"
                  ref={ref}
  inputRef={inputRef}  
                  
                  value={formData.expiryDate}
                  name="expiryDate"

                  
                  fullWidth
                /> */}
                <InputLabel>Fecha de Expiración</InputLabel>
                <OutlinedInput
          
          value={formData.expiryDate}
          label="Fecha de Expiración"
          onChange={handleInputChange}
          placeholder="MM/YY"
          name="expiryDate"
          id="expiryDate"
          
          inputComponent={TextMaskCustom as any}
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
            <Grid item xs={12} sm={12}>
         
         
          <FormControl fullWidth>
            <InputLabel>Banco Emisor</InputLabel>
            <Select
              multiple={false}
              label="Banco Emisor"
              name="banco"
              value={formData.banco}
              onChange={handleSelectChange}
              startAdornment={
                <InputAdornment position="start">
                  <AccountBalanceIcon sx={{color:theme.palette.primary.main}}/>
                </InputAdornment>
              }
            >
              {
                Bancos.map((banco) => {
                  return (
                    <MenuItem value={banco} key={banco}>
                      {banco}
                    </MenuItem>
                  );
                })
              }
              
            </Select>
          </FormControl>
        </Grid>
          </>
        )}
       

      
       
      </Grid>
    
    </form>
    
  );
};

export default Form1;
