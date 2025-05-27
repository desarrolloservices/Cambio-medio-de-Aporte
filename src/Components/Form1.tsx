// Form1.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  Button,
  Box,
  Stack,
  TextField,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FormContext } from "../Context/FormContext";
import { planes, Bancos } from "../CustomData/Planes";
import { ClienteData, ClienteDataUpdate, cuenta, Plan } from "../Interfaces/Tipos";
import useExtractRawData from "../Hooks/useExtractRawData";
import useValidateToken from "../Hooks/UseValidateTk";
import VeriffComponentNew from "./VeriffDialogoNew";
import VeriffStatusChecker from "./ValidateSession";
import { useClienteContext } from "../Context/ClienteContext";
import { IMask, IMaskInput } from "react-imask";
import { InfoInsert1 } from "../Data/GetDatosClientes";
import UseDeleteCard from "../Hooks/UseDeleteCard";
import { useEditDialog } from "../Context/EditDialogContext";
import EditDialog from "./EditDialog";
import ConfirmDialog from './ConfirmDialog';
import { useConfirmDialog } from '../Hooks/UseConfirmDialog';
import { useCardValidator } from "../Hooks/useCardValidator";
import { initialFormData } from "../Context/FormContext";
import FullscreenLoader from '../Components/FullscreenLoader';
import ExpiryDateMaskedField from '../Components/ExpiryDateMaskedField';
import { useExpiryDateValidator } from '../Hooks/useExpiryDateValidator';
import CardTypeDisplay from "../Components/CardTypeDisplay";
import CardNumberMaskedField from "../Components/CardNumberMaskedField";


interface Props {
  listCuentas: cuenta[];
  id: string | null;
}

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
        mask="MM/YY"
        blocks={{
          MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
            maxLength: 2, // fuerza 01, 02... 12
          },
          YY: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 99,
          },
        }}
        inputRef={ref}
        overwrite
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
      />
    );
  }
);


const Form1: React.FC<Props> = ({ listCuentas, id } ) => {
  const { isValid, isOVP } = useValidateToken();
  const { cliente } = useClienteContext();
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const { deleteCard, loading, error } = UseDeleteCard();
  const [showLoader, setShowLoader] = useState(false);
const { formData, handleInputChange, handleSelectChange, setFormData } =
    useContext(FormContext);
const [montoError, setMontoError] = useState<string | null>(null);
const [cardErrors, setCardErrors] = useState<{ cardNumber?: string; expiryDate?: string }>({});
const { validateCard, getCardType } = useCardValidator();
  const [veriffSessionId, setVeriffSessionId] = useState<string | null>(null);
  const [veriffStarted, setVeriffStarted] = useState(false);
  const [veriffApproved, setVeriffApproved] = useState(false);
  const [veriffError, setVeriffError] = useState(false);
  const [veriffShouldCheck, setVeriffShouldCheck] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const { openDialog } = useEditDialog();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [planSeleccionado, setPlanSeleccionado] = useState<Plan>(planes[0]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<cuenta>(
    listCuentas.length > 0 ? listCuentas[0] : ({} as cuenta)
  );
  const { isExpiryDateValid } = useExpiryDateValidator();
const { loading: formLoading, setLoading } = useContext(FormContext);
  const { rawData, loadingData } = useExtractRawData({
    cuenta: cuentaSeleccionada.cuenta,
    trigger: reloadTrigger,
  });
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const confirmAddCard = async () => {

    const monto = parseFloat(formData.monto);
    if (monto < 0) {
  setMontoError("No se permiten montos negativos");
  return;
}
  const moneda = formData.monedaDebito;
console.log("Moneda seleccionada:", moneda);
  
  if (
    (moneda === 'LEMPIRAS' && monto < 250) ||
    (moneda === 'DÓLARES' && monto < 20)
  ) {
    setMontoError(
      moneda === 'LEMPIRAS'
        ? 'El monto mínimo para Lempiras es L 250'
        : 'El monto mínimo para Dólares es $ 20'
    );
    return; 
  }

  setMontoError(null); 
  const [mes, anio] = formData.expiryDate.split("/");
    const cardData: ClienteData = {
      Tarjeta: formData.cardnumber,
      Aporte: formData.aporte,
      Monto: formData.monto,
      Contrato: cuentaSeleccionada.contrato,
      MonedaCCI: cuentaSeleccionada.moneda,
      DiaDebito: formData.diaDebito,
      Identidad: id || "",
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Banco: formData.banco,
      Vencimiento: `${mes}20${anio}`,
      TipoDebito: "TC",
      Modalidad: cuentaSeleccionada.modalidad,
      MonedaDebito:cuentaSeleccionada.moneda
    };
    if (!isExpiryDateValid(formData.expiryDate)) {
  setCardErrors(prev => ({
    ...prev,
    expiryDate: 'Fecha inválida o vencida',
  }));
  return;
}
  const errors = validateCard(formData.cardnumber);
 
if (Object.keys(errors).length > 0) {
  setCardErrors(errors);
  return;
}

 setShowLoader(true);
setCardErrors({});
    await InfoInsert1.InsertInfo(cardData);
    setShowCardForm(false);
    
    setReloadTrigger((prev) => !prev);
    
    setSnackbarMessage("¡Tarjeta registrada con éxito!");
  setSnackbarOpen(true);
 const cuentaActual = formData.cuenta;

setFormData?.({
  ...initialFormData,
  cuenta: cuentaActual, 
});
setCardErrors({});
setMontoError(null);
 setShowLoader(false);
  


  };

  const handleEdit = (row: any) => {
    
    openDialog({
      ...row,
      Contrato: cuentaSeleccionada.contrato,
      Modalidad: cuentaSeleccionada.modalidad,
      MonedaCCI: cuentaSeleccionada.moneda,
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Identidad: id||"",
    });
  };


  useEffect(() => {
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        prima: planSeleccionado.prima,
        sumaAsegurada: planSeleccionado.sumaAsegurada,
        cuenta: cuentaSeleccionada.cuenta,
        moneda: cuentaSeleccionada.moneda,
        aporte: cuentaSeleccionada.aporte.toString(),
        contrato:cuentaSeleccionada.contrato,
        modalidad:cuentaSeleccionada.modalidad
      }));
    }
  }, [cuentaSeleccionada]);

  useEffect(() => {
    if (cliente && setFormData) {
      setFormData((prev) => ({
        ...prev,
        nombre: cliente.Nombre,
        email: cliente.Correo,
      }));
    }
  }, [cliente]);

  useEffect(() => {
    if (veriffStarted && veriffSessionId && !veriffApproved && !veriffShouldCheck) {
   
      setVeriffShouldCheck(true);
    }
  }, [veriffStarted, veriffSessionId]);
  useEffect(() => {
  if (rawData.length === 0) {
    setShowCardForm(true);
  }
}, [rawData]);
useEffect(() => {
  setShowLoader(loadingData);
}, [loadingData]);

  const handleAddCard = () => setShowCardForm(true);

 
  const maskCardNumber = (cardNumber: string) => `•••• •••• •••• ${cardNumber.slice(-4)}`;

  //const handleEdit = (row: any) => alert(`Editando: ${JSON.stringify(row, null, 2)}`);
  const handleDelete = (row: any) => {
  
    const cardData: ClienteDataUpdate = {
      ID: String(row.ID ?? ""),
      Tarjeta: row.Tarjeta,
      Aporte: formData.aporte || row.TipoDebito,
      Monto: String(row.Monto),
      Contrato: cuentaSeleccionada.contrato,
      MonedaCCI: cuentaSeleccionada.moneda,
      DiaDebito: row.DiaDebito,
      Identidad: id ?? "",
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Banco: row.Banco || formData.banco,
      Vencimiento: row.FechaVencimiento,
      TipoDebito: "TC",
      Modalidad: cuentaSeleccionada.modalidad || "",
      MonedaDebito:row.MonedaDebito || formData.monedaDebito,
      Estado: "I",

    };
    console.log("Datos de la tarjeta a eliminar:", cardData);
  
    showConfirm({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de eliminar?",
      confirmButtonText: "Eliminar",
      confirmColor: "error",
      onConfirm: async () => {
        setShowLoader(true);
        await deleteCard(cardData);
      
        setReloadTrigger((prev) => !prev);
        setShowLoader(false);
        setSnackbarMessage("¡Tarjeta eliminada con éxito!");
        setSnackbarOpen(true);
        
      }
    });
  };

  const {
    open: confirmOpen,
    loading: confirmLoading,
    options: confirmOptions,
    showConfirm,
    handleCancel: handleConfirmCancel,
    handleConfirm: handleConfirmExecute
  } = useConfirmDialog();

  

  const columns: GridColDef[] = [
    {
      field: "Tarjeta",
      headerName: "Tarjeta",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => maskCardNumber(params.row.Tarjeta),
    },
    {
      field: "DiaDebito",
      headerName: "Día Débito",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "TipoDebito",
      headerName: "Tipo Débito",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "MonedaDebitoMonto",
      headerName: "Monto",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
    const simbolo = params.row.MonedaDebito === 'LEMPIRAS' ? 'L' : '$';
    const monto = Number(params.row.Monto) || 0;
    return `${simbolo} ${monto.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    },
    },
    {
      field: "actions",
      headerName: "Acciones",
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
          color="error"
          size="small"
          onClick={() => handleDelete(params.row)}
        >
          Eliminar
        </Button>
        </Stack>
      ),
    },
  ];

  const CustomNoRowsOverlay = ({ onAddCard }: { onAddCard: () => void }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 2,
      }}
    >
      <Typography variant="body2" sx={{ mb: 2 }}>
        No hay métodos de pago registrados.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CreditCardIcon />}
        onClick={onAddCard}
      >
        Agregar método de pago
      </Button>
    </Box>
  );

  return (
    <>
     
    {showLoader && <FullscreenLoader message="Procesando..." />}
    <form>
      {isOVP && (
        <Grid container mt={5} mb={5}>
          <Grid item xs={12}>
            {(!veriffApproved || veriffError) && (
              <VeriffComponentNew
                onSessionCreated={setVeriffSessionId}
                onVeriffStarted={() => {
                  setVeriffStarted(true);
                  setVeriffError(false);
                }}
                id={id}
              />
            )}
          </Grid>

          {veriffShouldCheck && veriffSessionId && (
            <VeriffStatusChecker
              sessionId={veriffSessionId}
              onApproved={() => {
                setVeriffApproved(true);
                setVeriffShouldCheck(false);
              }}
              onRejected={() => {
                setVeriffError(true);
                setVeriffShouldCheck(false);
              }}
            />
          )}
        </Grid>
      )}

      {(!isOVP || (isOVP && veriffApproved))  && (
        <Grid container spacing={2} rowSpacing={4} top={4} mb={5}>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="cuenta-label">Selecciona tu cuenta</InputLabel>
              <Select
                labelId="cuenta-label"
                id="cuenta"
                required
                name="cuenta"
                label="Selecciona tu cuenta"
                onChange={(e) => {
                  const cuenta = e.target.value;
                  const encontrada = listCuentas.find((c) => c.cuenta === cuenta);
                  if (encontrada) setCuentaSeleccionada(encontrada);
                }}
                value={formData?.cuenta || ""}
                startAdornment={
                  <InputAdornment position="start">
                    <SavingsRoundedIcon />
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

        <Grid item xs={12} sm={12}>
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography variant="h6" color="primary">
      Tus métodos de pago:
    </Typography>
    {rawData.length > 0 && (
      <Button
        variant="contained"
        color="primary"
        startIcon={<CreditCardIcon />}
        onClick={handleAddCard}
      >
        Agregar método de pago
      </Button>
    )}
  </Box>

  {rawData.length > 0 && (
    <DataGrid
      rows={rawData}
      columns={columns}
      getRowId={(row) => row.ID}
      autoHeight
      disableColumnMenu
      disableRowSelectionOnClick
      hideFooterPagination={rawData.length <= 5}
      pageSizeOptions={[5, 10]}
    />
  )}
</Grid>

          {showCardForm && (
            <>
              <Grid item xs={12} sm={4}>
               <CardNumberMaskedField
  name="cardnumber"
  value={formData.cardnumber}
  onChange={handleInputChange}
  error={!!cardErrors.cardNumber}
  helperText={cardErrors.cardNumber}
/>
<CardTypeDisplay cardNumber={formData.cardnumber} />
              </Grid>
              <Grid item xs={12} sm={4}>
                
  <ExpiryDateMaskedField
  name="expiryDate"
  value={formData.expiryDate}
  onChange={handleInputChange}
  error={!!cardErrors.expiryDate}
  helperText={cardErrors.expiryDate}
/>

              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Banco Emisor</InputLabel>
                  <Select
                    label="Banco Emisor"
                    name="banco"
                    value={formData.banco}
                    onChange={handleSelectChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountBalanceIcon />
                      </InputAdornment>
                    }
                  >
                    {Bancos.map((banco) => (
                      <MenuItem value={banco} key={banco}>
                        {banco}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
  <FormControl fullWidth>
    <TextField
      id="monto"
      name="monto"
      label="Monto del Aporte"
      variant="outlined"
      type="number"
      value={formData.monto}
      onChange={handleInputChange}
      fullWidth
      required
      error={!!montoError}
      helperText={montoError}
      InputLabelProps={{ shrink: true }}  
    />
  </FormControl>
</Grid>
<Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <InputLabel>Tipo de Aporte</InputLabel>
      <Select
        label="Tipo de Aporte"
        name="aporte"
        value={formData.aporte}
        onChange={handleSelectChange}
      >
        <MenuItem value="MENSUAL">Mensual</MenuItem>
        <MenuItem value="UNICO">Único</MenuItem>
      </Select>
    </FormControl>
  </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Día del débito</InputLabel>
                  <Select
                    label="Día del débito"
                    name="diaDebito"
                    value={formData.diaDebito}
                    onChange={handleSelectChange}
                  >
                    {[...Array(30)].map((_, i) => {
                      const val = (i + 1).toString();
                      return (
                        <MenuItem value={val} key={val}>
                          {val}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              
       
              

 
              
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    showConfirm({
                      title: "Confirmar registro",
                      message: "¿Deseas registrar?",
                      confirmButtonText: "Registrar",
                      confirmColor: "success",
                      onConfirm: confirmAddCard,
                    })
                  }
                >
                  Ingresar
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </form>
    <EditDialog onUpdateSuccess={() => setReloadTrigger((prev) => !prev)} />
    <ConfirmDialog
  open={confirmOpen}
  loading={confirmLoading}
  options={confirmOptions}
  onCancel={handleConfirmCancel}
  onConfirm={handleConfirmExecute}
/>
<Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity="success"
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
    </>
  );
};

export default Form1;

