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
import { Bancos } from "../CustomData/Planes";
import { ClienteData, ClienteDataUpdate, cuenta } from "../Interfaces/Tipos";
import useExtractRawData from "../Hooks/useExtractRawData";
import useCuentasAhorro from "../Hooks/UseCuentasAhorro";
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
import {
  getCurrencyMinimum,
  getCurrencyMinimumMessage,
  getCurrencyPrefix,
  normalizeCurrency,
} from "../Utils/currency";
import {
  isSessionExpiredError,
  notifySessionExpired,
} from "../Utils/sessionExpired";
import { calculateInsuranceValues } from "../Utils/insurance";


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
  const { isValid, isLink } = useValidateToken();
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
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<cuenta>(
    listCuentas.length > 0 ? listCuentas[0] : ({} as cuenta)
  );
  const { isExpiryDateValid } = useExpiryDateValidator();
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");
  const [infoDebitoMesSiguiente, setInfoDebitoMesSiguiente] = useState(false);
  const [usuarioTocoDiaDebito, setUsuarioTocoDiaDebito] = useState(false);

  const isCuentaAhorro = formData.metodoPago === "CUENTA_AHORRO";

const showError = (message: string) => {
  setErrorSnackbarMessage(message);
  setErrorSnackbarOpen(true);
};

  const parseMonto = (monto: string): number => {
    const montoNormalizado = monto.replace(/,/g, "").trim();
    const valor = Number(montoNormalizado);
    return Number.isFinite(valor) ? valor : 0;
  };

  const valoresActualesSeguro = {
    prima: cuentaSeleccionada.prima,
    sumaAsegurada: cuentaSeleccionada.suma_asegurada,
  };
  const esAporteMensual = formData.aporte.trim().toUpperCase() === "MENSUAL";
  const hayNuevoMonto = formData.monto.trim() !== "";
  const aporteParaTotal = hayNuevoMonto
    ? parseMonto(formData.monto)
    : cuentaSeleccionada.tiene_seguro
      ? cuentaSeleccionada.suma_asegurada / 300
      : cuentaSeleccionada.aporte;
  const valoresSeguro = !hayNuevoMonto && cuentaSeleccionada.tipo_seguro === 2
    ? valoresActualesSeguro
    : calculateInsuranceValues({
        tieneSeguro: cuentaSeleccionada.tiene_seguro,
        tipoSeguro: cuentaSeleccionada.tipo_seguro,
        aporte: hayNuevoMonto ? parseMonto(formData.monto) : cuentaSeleccionada.aporte,
        tipoAporte: formData.aporte,
        valoresActuales: valoresActualesSeguro,
        moneda: cuentaSeleccionada.moneda,
      });
  const totalAporte = hayNuevoMonto && esAporteMensual
    ? aporteParaTotal + valoresSeguro.prima
    : aporteParaTotal;

  const handleMontoChange = (event: {
    target: { name: string; value: string };
  }) => {
    const monto = event.target.value;
    setMontoError(null);

    if (!setFormData) return;

    setFormData((prev) => {
      const valores = calculateInsuranceValues({
        tieneSeguro: cuentaSeleccionada.tiene_seguro,
        tipoSeguro: cuentaSeleccionada.tipo_seguro,
        aporte: parseMonto(monto),
        tipoAporte: prev.aporte,
        valoresActuales: {
          prima: cuentaSeleccionada.prima,
          sumaAsegurada: cuentaSeleccionada.suma_asegurada,
        },
        moneda: cuentaSeleccionada.moneda,
      });

      return { ...prev, monto, ...valores };
    });
  };
  const { rawData, loadingData } = useExtractRawData({
    cuenta: cuentaSeleccionada.cuenta,
    monedaCuenta: cuentaSeleccionada.moneda,
    trigger: reloadTrigger,
    enabled: isValid === true && !!cuentaSeleccionada.cuenta,
  });
  const {
    cuentasAhorro,
    loadingCuentasAhorro,
    errorCuentasAhorro,
  } = useCuentasAhorro({
    cuenta: cuentaSeleccionada.cuenta,
    monedaCuenta: cuentaSeleccionada.moneda,
    enabled: isValid === true && !!cuentaSeleccionada.cuenta,
  });
  const mostrarCuentaAhorro =
    !loadingCuentasAhorro && cuentasAhorro.length > 0;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const confirmAddCard = async () => {

    const monto = parseMonto(formData.monto);
    if (isNaN(monto) || monto < 0) {
  setMontoError("No se permiten montos negativos o vacíos");
  showError("No se permiten montos negativos o vacíos");
  return;
}

  // Usar la moneda de la cuenta seleccionada para la validación
  const moneda = normalizeCurrency(
    cuentaSeleccionada.moneda,
    formData.monedaDebito
  );
  const montoMinimo = getCurrencyMinimum(moneda);

  if (!moneda || montoMinimo === null) {
    const msg = "No se pudo determinar la moneda de la cuenta seleccionada";
    setMontoError(msg);
    showError(msg);
    return;
  }

  
if (monto < montoMinimo) {
  const msg = getCurrencyMinimumMessage(moneda);
  setMontoError(msg);
  showError(msg);
  return;
}

  if (
    esAporteMensual &&
    cuentaSeleccionada.tiene_seguro &&
    cuentaSeleccionada.tipo_seguro === 3 &&
    monto <= cuentaSeleccionada.prima
  ) {
    const msg = "Para este plan, el aporte debe ser mayor que la prima vigente.";
    setMontoError(msg);
    showError(msg);
    return;
  }

  setMontoError(null); 
    const [mes, anio] = formData.expiryDate.split("/");
    const montoARegistrar = cuentaSeleccionada.tiene_seguro && esAporteMensual
      ? totalAporte.toFixed(2)
      : formData.monto;
    const cardData: ClienteData = {
      Tarjeta: formData.cardnumber,
      Aporte: formData.aporte,
      Monto: montoARegistrar,
      Contrato: cuentaSeleccionada.contrato,
      MonedaCCI: moneda,
      DiaDebito: formData.diaDebito,
      Identidad: id || "",
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Banco: formData.banco,
      Vencimiento: `${mes}20${anio}`,
      TipoDebito: "TC",
      Modalidad: cuentaSeleccionada.modalidad,
      MonedaDebito: moneda,
      Canal: "PRUEBAS",
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

    try {
      await InfoInsert1.InsertInfo(cardToSend);
    } catch (error) {
      setShowLoader(false);

      if (isSessionExpiredError(error)) {
        notifySessionExpired();
        return;
      }

      showError("No pudimos registrar la tarjeta en este momento. Intenta nuevamente.");
      return;
    }
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

  const confirmAddSavingsAccount = async () => {
    if (!formData.cuentaAhorro) {
      showError("Selecciona la cuenta de ahorro para el débito.");
      return;
    }

    const moneda = normalizeCurrency(
      cuentaSeleccionada.moneda,
      formData.monedaDebito
    );

    const monto = parseMonto(formData.monto);
    if (isNaN(monto) || monto < 0) {
      const mensaje = "No se permiten montos negativos o vacíos";
      setMontoError(mensaje);
      showError(mensaje);
      return;
    }

    if (!moneda) {
      showError("No se pudo determinar la moneda de la cuenta seleccionada.");
      return;
    }

    const montoMinimo = getCurrencyMinimum(moneda);
    if (montoMinimo === null || monto < montoMinimo) {
      const mensaje = montoMinimo === null
        ? "No se pudo determinar la moneda de la cuenta seleccionada"
        : getCurrencyMinimumMessage(moneda);
      setMontoError(mensaje);
      showError(mensaje);
      return;
    }

    if (
      esAporteMensual &&
      cuentaSeleccionada.tiene_seguro &&
      cuentaSeleccionada.tipo_seguro === 3 &&
      monto <= cuentaSeleccionada.prima
    ) {
      const mensaje = "Para este plan, el aporte debe ser mayor que la prima vigente.";
      setMontoError(mensaje);
      showError(mensaje);
      return;
    }

    setMontoError(null);

    const montoARegistrar = cuentaSeleccionada.tiene_seguro && esAporteMensual
      ? totalAporte.toFixed(2)
      : formData.monto;

    const savingsData: ClienteData = {
      Tarjeta: formData.cuentaAhorro,
      Aporte: formData.aporte,
      Monto: montoARegistrar,
      Contrato: cuentaSeleccionada.contrato,
      MonedaCCI: moneda,
      DiaDebito: formData.diaDebito,
      Identidad: id || "",
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Banco: "",
      Vencimiento: "",
      TipoDebito: "CA",
      Modalidad: cuentaSeleccionada.modalidad,
      MonedaDebito: moneda,
      Canal: "PRUEBAS",
    };

    setShowLoader(true);
    try {
      await InfoInsert1.InsertInfo(savingsData);
    } catch (error) {
      setShowLoader(false);
      if (isSessionExpiredError(error)) {
        notifySessionExpired();
        return;
      }
      showError("No pudimos registrar la cuenta de ahorro en este momento. Intenta nuevamente.");
      return;
    }

    setShowCardForm(false);
    setReloadTrigger((prev) => !prev);
    setSnackbarMessage("¡Cuenta de ahorro registrada con éxito!");
    setSnackbarOpen(true);
    const cuentaActual = formData.cuenta;
    setFormData?.({ ...initialFormData, cuenta: cuentaActual });
    setShowLoader(false);
  };
const handleVeriffStarted = () => {
  setVeriffStarted(true);
  
};
  const handleEdit = (row: any) => {
    const monedaCuenta = normalizeCurrency(cuentaSeleccionada.moneda);

    openDialog({
      ...row,
      Contrato: cuentaSeleccionada.contrato,
      Modalidad: cuentaSeleccionada.modalidad,
      MonedaCCI: monedaCuenta,
      MonedaDebito: monedaCuenta,
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Identidad: id||"",
      tieneSeguro: cuentaSeleccionada.tiene_seguro,
      tipoSeguro: cuentaSeleccionada.tipo_seguro,
      primaActual: cuentaSeleccionada.prima,
      sumaAseguradaActual: cuentaSeleccionada.suma_asegurada,
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
        cuenta: cuentaSeleccionada.cuenta,
        moneda: cuentaSeleccionada.moneda,
       
        contrato:cuentaSeleccionada.contrato,
        modalidad:cuentaSeleccionada.modalidad
      }));
    }
  }, [cuentaSeleccionada, setFormData]);

  useEffect(() => {
    if (!setFormData) return;

    setFormData((prev) => {
      if (
        valoresSeguro.prima === prev.prima &&
        valoresSeguro.sumaAsegurada === prev.sumaAsegurada
      ) {
        return prev;
      }

      return { ...prev, ...valoresSeguro };
    });
  }, [
    cuentaSeleccionada.tiene_seguro,
    cuentaSeleccionada.tipo_seguro,
    cuentaSeleccionada.aporte,
    formData.monto,
    formData.aporte,
    setFormData,
  ]);

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
    if (isLink === true && Cookies.get("veriffStatus") === "approved") {
      setVeriffApproved(true);
    }
  }, [isLink]);
  useEffect(() => {
  if (rawData.length === 0) {
    setShowCardForm(true);
  } else {
    setShowCardForm(false);
  }
}, [rawData]);

  useEffect(() => {
    if (
      !loadingCuentasAhorro &&
      cuentasAhorro.length === 0 &&
      formData.metodoPago === "CUENTA_AHORRO"
    ) {
      setFormData?.((prev) => ({
        ...prev,
        metodoPago: "TARJETA",
        cuentaAhorro: "",
      }));
    }
  }, [cuentasAhorro.length, formData.metodoPago, loadingCuentasAhorro, setFormData]);
useEffect(() => {
  setShowLoader(loadingData);
}, [loadingData]);

  const handleAddCard = () => {
    setFormData?.((prev) => ({
      ...prev,
      metodoPago: "TARJETA",
      cuentaAhorro: "",
    }));
    setShowCardForm(true);
  };

  const handleMetodoPagoChange = (event: any) => {
    const metodoPago = event.target.value as "TARJETA" | "CUENTA_AHORRO";
    setFormData?.((prev) => ({
      ...prev,
      metodoPago,
      cuentaAhorro: metodoPago === "TARJETA" ? "" : prev.cuentaAhorro,
    }));
    setCardErrors({});
    setMontoError(null);
    setShowCardForm(metodoPago === "CUENTA_AHORRO" || rawData.length === 0);
  };

 
  const maskCardNumber = (cardNumber: string) => `•••• •••• •••• ${cardNumber.slice(-4)}`;

  
  const handleDelete = (row: any) => {
    const monedaCuenta = normalizeCurrency(cuentaSeleccionada.moneda);
    const tipoConsultado = String(row.TipoDebito ?? "").trim().toUpperCase();
    const vencimientoConsultado = String(row.FechaVencimiento ?? "").trim();
    const esCuentaAhorro =
      tipoConsultado === "CA" ||
      tipoConsultado === "CUENTA_AHORRO" ||
      !vencimientoConsultado ||
      /^0+$/.test(vencimientoConsultado);

    const cardData: ClienteDataUpdate = {
      ID: String(row.ID ?? ""),
      Tarjeta: row.Tarjeta,
      // La consulta devuelve el monto en Aporte y la frecuencia en TipoDebito.
      // Para actualizar o eliminar, el servicio espera la frecuencia en Aporte.
      Aporte: row.TipoDebito || "MENSUAL",
      Monto: String(row.Monto),
      Contrato: cuentaSeleccionada.contrato,
      MonedaCCI: monedaCuenta,
      DiaDebito: row.DiaDebito,
      Identidad: id ?? "",
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Banco: row.Banco || formData.banco,
      Vencimiento: esCuentaAhorro ? "" : row.FechaVencimiento,
      TipoDebito: esCuentaAhorro ? "CA" : "TC",
      Modalidad: cuentaSeleccionada.modalidad || "",
      MonedaDebito: monedaCuenta,
      Estado: "I",
      Canal: "PRUEBAS",

    };
 
  
    showConfirm({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de eliminar?",
      confirmButtonText: "Eliminar",
      confirmColor: "error",
      onConfirm: async () => {
        setShowLoader(true);
        try {
           const cardToSend = esCuentaAhorro
             ? cardData
             : {
                 ...cardData,
                 Tarjeta: '',
                 Vencimiento: '',
                 EncryptedPayload: await encryptWithPublicKey({
                   Tarjeta: cardData.Tarjeta,
                   Vencimiento: cardData.Vencimiento,
                 }),
               };

           await deleteCard(cardToSend);
          setReloadTrigger((prev) => !prev);
          setSnackbarMessage("¡Tarjeta eliminada con éxito!");
          setSnackbarOpen(true);

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
        } catch (error) {
          if (isSessionExpiredError(error)) {
            notifySessionExpired();
            return;
          }
          showError("No se pudo eliminar el método de pago. Intenta nuevamente.");
        } finally {
          setShowLoader(false);
        }
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
    const simbolo = getCurrencyPrefix(
      params.row.MonedaDebito || cuentaSeleccionada.moneda
    ).trim();
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
      {isLink && (
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

      {isLink !== null && (!isLink || (isLink && veriffApproved))  && (
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

          {cuentaSeleccionada.tiene_seguro && (
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
                  Seguro
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Suma asegurada"
                      value={valoresSeguro.sumaAsegurada.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            {getCurrencyPrefix(cuentaSeleccionada.moneda).trim()}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Prima"
                      value={valoresSeguro.prima.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            {getCurrencyPrefix(cuentaSeleccionada.moneda).trim()}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Total de aporte"
                      value={totalAporte.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            {getCurrencyPrefix(cuentaSeleccionada.moneda).trim()}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="metodo-pago-label">Método de pago</InputLabel>
              <Select
                labelId="metodo-pago-label"
                label="Método de pago"
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleMetodoPagoChange}
              >
                <MenuItem value="TARJETA">Tarjeta de crédito o débito</MenuItem>
                {mostrarCuentaAhorro && (
                  <MenuItem value="CUENTA_AHORRO">Cuenta de ahorro</MenuItem>
                )}
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
            {isCuentaAhorro ? (
              <>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="cuenta-ahorro-label">Cuenta de ahorro</InputLabel>
                  <Select
                    labelId="cuenta-ahorro-label"
                    label="Cuenta de ahorro"
                    name="cuentaAhorro"
                    value={formData.cuentaAhorro}
                    onChange={handleSelectChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountBalanceIcon />
                      </InputAdornment>
                    }
                  >
                    {loadingCuentasAhorro && (
                      <MenuItem value="" disabled>Cargando cuentas de ahorro...</MenuItem>
                    )}
                    {!loadingCuentasAhorro && errorCuentasAhorro && (
                      <MenuItem value="" disabled>{errorCuentasAhorro}</MenuItem>
                    )}
                    {!loadingCuentasAhorro && !errorCuentasAhorro && cuentasAhorro.length === 0 && (
                      <MenuItem value="" disabled>No hay cuentas de ahorro disponibles.</MenuItem>
                    )}
                    {cuentasAhorro.map((cuenta) => (
                      <MenuItem value={cuenta.cuenta} key={cuenta.cuenta}>
                        {[cuenta.cuenta, cuenta.moneda, cuenta.descripcion]
                          .filter(Boolean)
                          .join(" - ")}
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
                    onChange={handleMontoChange}
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
              </>
            ) : (
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
      onChange={handleMontoChange}
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
              </>
            )}
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
                      onConfirm: isCuentaAhorro
                        ? confirmAddSavingsAccount
                        : confirmAddCard,
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
