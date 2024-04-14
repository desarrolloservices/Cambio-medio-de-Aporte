import React, { useContext, useEffect, useState } from "react";
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
import { Plan, cuenta } from "../Interfaces/Tipos";
import { planes, planesDolares } from "../CustomData/Planes";
import { cuentas } from "../CustomData/Cuentas";

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
  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useContext(FormContext); // Use the FormContext

  const [moneda, setMoneda] = useState("L");

  const [planSeleccionado, setPlanSeleccionado] = React.useState<Plan>(
    planes[0]
  );

  const [cuentaSeleccionada, setCuentaSeleccionada] = React.useState<cuenta>(
    cuentas[0]
  );

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
    setCuentaSeleccionada(cuentas.filter((cuenta) => cuenta.cuenta === cuentaRecibida)[0]);
  }

  
  useEffect(() => {
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        prima: planSeleccionado.prima,
        sumaAsegurada: planSeleccionado.sumaAsegurada,
        cuenta: cuentaSeleccionada.cuenta,
        moneda: cuentaSeleccionada.moneda,
        aporte: cuentaSeleccionada.aporte,
      }));
    }
    setMoneda(cuentaSeleccionada.moneda);
  },);

  useEffect(() => {
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
  }, [planSeleccionado,cuentaSeleccionada]);



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
              onChange={(e, value) => filterCuentas(e.target.value as string)}
              value={formData.cuenta}
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EastIcon />
                  </InputAdornment>
                ),
              }}
            >
              {cuentas.map((cuenta) => {
                return (
                  <MenuItem value={cuenta.cuenta} key={cuenta.cuenta}>
                    {cuenta.cuenta}
                  </MenuItem>
                );
              })}
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
            value={formData.aporte}
            thousandSeparator={true}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{moneda}</InputAdornment>
              ),

              inputProps: { min: 0, max: 1000000 },
            }}
            fullWidth
          />
        </Grid>

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
            <LocalOfferIcon color="primary" fontSize="small" />
            <Typography variant="h6" color={theme.palette.secondary.main}>
              Adquiere tu seguro de vida opcional:
            </Typography>
          </Grid>

          <Box
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
          </Box>
          <Box mb={2}>
            <FormControl
              fullWidth
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <InputLabel>Prima que pagarías</InputLabel>
              <Select
                multiple={false}
                label="Selecciona tu plan"
                name="plan"
                defaultValue={0}
                onChange={(event) => {
                  filterPlanes(event.target.value as number);
                }}
                sx={{ width: "100%" }}
              >
                {planes.map((plan) => {
                  return (
                    <MenuItem
                      value={plan.prima}
                      key={plan.prima}
                    >{`${plan.nombre} - ${moneda} ${plan.prima}`}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          {planSeleccionado.id > 0 && (
            <Card>
              <CardHeader
                title={planSeleccionado.nombre}
                subheader={
                  "Prima mensual: " +
                  moneda +
                  " " +
                  planSeleccionado.prima.toLocaleString()
                }
                titleTypographyProps={{
                  align: "center",
                  color: theme.palette.primary.main,
                }}
              />
              <CardContent>
                <Typography
                  variant="body1"
                  color={theme.palette.secondary.main}
                >
                  Suma Asegurada: {moneda}{" "}
                  <strong>
                    {planSeleccionado.sumaAsegurada.toLocaleString()}
                  </strong>
                </Typography>
              </CardContent>
            </Card>
          )}
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
        <Grid container mt={5} mb={5}>
          <Grid item xs={12}>
            <Button onClick={handleClickOpen} variant="outlined">
              Continuar
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Confirma tu información</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirma la información de tu solicitud y luego ingresa el código de
            verificación que te enviamos a tu correo electrónico.
          </DialogContentText>

          <br />
          <Typography>
            Aporte:{" "}
            <strong>
              {moneda} {formData.aporte.toLocaleString()}
            </strong>
          </Typography>
          <Typography>
            Prima:{" "}
            <strong>
              {moneda} {planSeleccionado.prima}
            </strong>
          </Typography>

          <Typography>
            Cuenta: <strong>{formData.cuenta}</strong>
          </Typography>
          <Typography>
            Suma Asegurada: <strong>{planSeleccionado.sumaAsegurada}</strong>
          </Typography>
          <Typography>
            Forma de Pago: <strong>{formData.formaPago}</strong>
          </Typography>
          {formData.formaPago === "Débito a Tarjeta" && (
            <>
              <Typography>
                Número de Tarjeta: <strong>{formData.cardnumber}</strong>
              </Typography>
              <Typography>
                Fecha de Vencimiento: <strong>{formData.expiryDate}</strong>
              </Typography>
              <Typography>
                Fecha de Débito: <strong>{formData.diaDebito}</strong>
              </Typography>
            </>
          )}

          <br />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Código de verificación"
            helperText="Ingresa el código que te enviamos a tu correo electrónico"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">Solicitar Ahora</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default Form1;
