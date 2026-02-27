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
import { NumericFormat } from "react-number-format";
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
import { encryptWithPublicKey } from "../Utils/encryptWithPublicKey";
import Cookies from "js-cookie";
import { clearSessionCookies } from "../Data/setCookies";


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

function getCurrencyPrefix(moneda?: string) {
  const m = (moneda ?? "").trim().toUpperCase();
  if (m === "LEMPIRAS" || m === "L" || m === "LPS") return "L ";
  if (m === "DOLARES" || m === "DÓLARES" || m === "$" || m === "USD") return "$ ";
  return "";
}

interface CurrencyFormatCustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  prefix?: string;
}

const CurrencyFormatCustom = React.forwardRef<any, CurrencyFormatCustomProps>(
  function CurrencyFormatCustom(props, ref) {
    const { onChange, prefix, ...other } = props;
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        valueIsNumericString
        thousandSeparator=","
        decimalScale={2}
        fixedDecimalScale
        allowNegative={false}
        prefix={prefix}
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
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");
  const [infoDebitoMesSiguiente, setInfoDebitoMesSiguiente] = useState(false);
  const [usuarioTocoDiaDebito, setUsuarioTocoDiaDebito] = useState(false);

const showError = (message: string) => {
  setErrorSnackbarMessage(message);
  setErrorSnackbarOpen(true);
};
  const { rawData, loadingData } = useExtractRawData({
    cuenta: cuentaSeleccionada.cuenta,
    trigger: reloadTrigger,
    enabled: isValid === true && !!cuentaSeleccionada.cuenta,
  });
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const confirmAddCard = async () => {

    const monto = parseFloat(formData.monto);
    if (isNaN(monto) || monto < 0) {
  setMontoError("No se permiten montos negativos o vacíos");
  showError("No se permiten montos negativos o vacíos");
  return;
}

  // Usar la moneda de la cuenta seleccionada para la validación
  const moneda = cuentaSeleccionada.moneda || formData.monedaDebito;

  
if (
  (moneda === 'LEMPIRAS' && monto < 250) ||
  ((moneda === 'DOLARES' || moneda === 'DÓLARES') && monto < 20)
) {
  const msg = moneda === 'LEMPIRAS'
    ? 'El monto mínimo para Lempiras es L 250'
    : 'El monto mínimo para Dólares es $ 20';
  setMontoError(msg);
  showError(msg);
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
      MonedaDebito:cuentaSeleccionada.moneda,
      Canal: isOVP ? "OVP" : "WEB",
    };
   if (!isExpiryDateValid(formData.expiryDate)) {
  const msg = 'Fecha inválida o vencida';
  setCardErrors(prev => ({ ...prev, expiryDate: msg }));
  showError(msg);
  return;
}
  const errors = validateCard(formData.cardnumber);
 
if (Object.keys(errors).length > 0) {
  setCardErrors(errors);
  const combinedErrorMsg = Object.values(errors).join(" | ");
  showError(combinedErrorMsg);
  return;
}

 setShowLoader(true);
setCardErrors({});
const encrypted = await encryptWithPublicKey({
              Tarjeta: cardData.Tarjeta,
              Vencimiento: cardData.Vencimiento
            });
 
            const cardToSend = {
              ...cardData,
                Tarjeta: '',
        Vencimiento: '',
              EncryptedPayload: encrypted, 
            }; 
            

    await InfoInsert1.InsertInfo(cardToSend);
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

    // Abrir después de que el hook cierre el modal "¿Deseas registrar?"
    setTimeout(() => {
      showConfirm({
        title: "Gestión Completada con Éxito",
        message: "¿Deseas realizar otra operación?",
        confirmButtonText: "Sí",
        cancelButtonText: "No",
        onConfirm: () => setShowCardForm(true),
        onCancel: clearSessionCookies,
      });
    }, 0);
  };
const handleVeriffStarted = () => {
  setVeriffStarted(true);
  
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
  const hoy = new Date();
  const diaHoy = hoy.getDate();
  const diaSeleccionado = parseInt(formData.diaDebito, 10);

  if (usuarioTocoDiaDebito && !isNaN(diaSeleccionado) && diaSeleccionado <= diaHoy) {
    setInfoDebitoMesSiguiente(true);
  } else {
    setInfoDebitoMesSiguiente(false);
  }
}, [formData.diaDebito, usuarioTocoDiaDebito]);
  useEffect(() => {
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        prima: planSeleccionado.prima,
        sumaAsegurada: planSeleccionado.sumaAsegurada,
        cuenta: cuentaSeleccionada.cuenta,
        moneda: cuentaSeleccionada.moneda,
       
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
    if (veriffStarted && veriffSessionId) {
    setVeriffShouldCheck(true);
  }
  }, [veriffStarted, veriffSessionId]);

  // Si la sesión Veriff ya fue validada (cookie), no mostrar el botón y mostrar los datos al refrescar
  useEffect(() => {
    if (isOVP === true && Cookies.get("veriffStatus") === "approved") {
      setVeriffApproved(true);
    }
  }, [isOVP]);
  useEffect(() => {
  if (rawData.length === 0) {
    setShowCardForm(true);
  } else {
    setShowCardForm(false);
  }
}, [rawData]);
useEffect(() => {
  setShowLoader(loadingData);
}, [loadingData]);

  const handleAddCard = () => setShowCardForm(true);

 
  const maskCardNumber = (cardNumber: string) => `•••• •••• •••• ${cardNumber.slice(-4)}`;

  
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
      Canal: isOVP ? "OVP" : "WEB",

    };
 
  
    showConfirm({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de eliminar?",
      confirmButtonText: "Eliminar",
      confirmColor: "error",
      onConfirm: async () => {
        setShowLoader(true);
        const encrypted = await encryptWithPublicKey({
              Tarjeta: cardData.Tarjeta,
              Vencimiento: cardData.Vencimiento
            });
 
            const cardToSend = {
              ...cardData,
                Tarjeta: '',
        Vencimiento: '',
              EncryptedPayload: encrypted, 
            }; 

           
            
        await deleteCard(cardToSend);
      
        setReloadTrigger((prev) => !prev);
        setShowLoader(false);
        setSnackbarMessage("¡Tarjeta eliminada con éxito!");
        setSnackbarOpen(true);

        // Abrir después de que el hook cierre el modal "¿Estás seguro de eliminar?"
        setTimeout(() => {
          showConfirm({
            title: "Gestión Completada con Éxito",
            message: "¿Deseas realizar otra operación?",
            confirmButtonText: "Sí",
            cancelButtonText: "No",
            onConfirm: () => setShowCardForm(true),
            onCancel: clearSessionCookies,
          });
        }, 0);
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
   onSessionCreated={(sessionId) => setVeriffSessionId(sessionId)}
  onVeriffStarted={() => setVeriffStarted(true)}
  id={id}
/>
            )}
          </Grid>

          {veriffSessionId && (
  <VeriffStatusChecker
    sessionId={veriffSessionId}
    active={veriffStarted && !veriffApproved && !veriffError}
    onApproved={() => setVeriffApproved(true)}
    onRejected={() => setVeriffError(true)}
  />
)}
        </Grid>
      )}

      {isOVP !== null && (!isOVP || (isOVP && veriffApproved))  && (
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
                     {`${cuenta.cuenta} - ${cuenta.moneda}`}
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
        Agregar otra tarjeta
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
      value={formData.monto}
      onChange={handleInputChange}
      fullWidth
      required
      error={!!montoError}
      helperText={montoError}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: CurrencyFormatCustom as any,
      }}
      inputProps={{
        prefix: getCurrencyPrefix(cuentaSeleccionada.moneda || formData.monedaDebito),
      }}
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
                    onChange={(e) => {
                      handleSelectChange(e);
                      setUsuarioTocoDiaDebito(true);
                    }}
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
    <EditDialog
      onUpdateSuccess={() => {
        setReloadTrigger((prev) => !prev);
        showConfirm({
          title: "Gestión Completada con Éxito",
          message: "¿Deseas realizar otra operación?",
          confirmButtonText: "Sí",
          cancelButtonText: "No",
          onConfirm: () => setShowCardForm(true),
          onCancel: clearSessionCookies,
        });
      }}
    />
    <ConfirmDialog
  open={confirmOpen}
  loading={confirmLoading}
  options={confirmOptions}
  onCancel={handleConfirmCancel}
  onConfirm={handleConfirmExecute}
/>
<Snackbar
  open={snackbarOpen}
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
<Snackbar
  open={errorSnackbarOpen}
  onClose={() => setErrorSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert
    onClose={() => setErrorSnackbarOpen(false)}
    severity="error"
    sx={{ width: '100%' }}
  >
    {errorSnackbarMessage}
  </Alert>
</Snackbar>
<Snackbar
  open={infoDebitoMesSiguiente}
  onClose={() => setInfoDebitoMesSiguiente(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert
    onClose={() => setInfoDebitoMesSiguiente(false)}
    severity="info"
    sx={{ width: '100%' }}
  >
    El día de débito seleccionado ya pasó este mes. El débito se realizará el próximo mes.
  </Alert>
</Snackbar>
    </>
  );
};

export default Form1;

