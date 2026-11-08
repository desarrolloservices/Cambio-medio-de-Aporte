import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { IMaskInput } from "react-imask";
import { NumericFormat } from "react-number-format";
import { useEditDialog } from "../Context/EditDialogContext";
import UseUpdateCard from "../Hooks/UseUpdateCard";
import ConfirmDialog from './ConfirmDialog';
import { useConfirmDialog } from '../Hooks/UseConfirmDialog';
import CardNumberMaskedField from "../Components/CardNumberMaskedField";
import ExpiryDateMaskedField from "../Components/ExpiryDateMaskedField";
import { useCardValidator } from "../Hooks/useCardValidator";
import { useExpiryDateValidator } from "../Hooks/useExpiryDateValidator";
import useCuentasAhorro from "../Hooks/UseCuentasAhorro";
import { encryptWithPublicKey } from "../Utils/encryptWithPublicKey";
import {
  getCurrencyMinimum,
  getCurrencyMinimumMessage,
  getCurrencyPrefix,
  normalizeCurrency,
} from "../Utils/currency";
import { calculateInsuranceValues } from "../Utils/insurance";
interface EditDialogProps {
  onUpdateSuccess: () => void;
}

// Input con máscara para MM/YYYY
const TextMaskCustom = React.forwardRef<HTMLInputElement, any>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00/0000"
        definitions={{ "#": /[1-9]/ }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
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

const EditDialog: React.FC<EditDialogProps> = ({ onUpdateSuccess }) => {
  const { open, rowData, closeDialog } = useEditDialog();
  const { updateCard } = UseUpdateCard();
  const tipoDebitoOriginal = String(rowData?.TipoDebito ?? "").trim().toUpperCase();
  const vencimientoOriginal = String(rowData?.FechaVencimiento ?? "").trim();
  const esCuentaAhorro =
    tipoDebitoOriginal === "CA" ||
    tipoDebitoOriginal === "CUENTA_AHORRO" ||
    !vencimientoOriginal ||
    /^0+$/.test(vencimientoOriginal);
  const { cuentasAhorro, loadingCuentasAhorro, errorCuentasAhorro } = useCuentasAhorro({
    cuenta: String(rowData?.CCI ?? ""),
    monedaCuenta: String(rowData?.MonedaCCI ?? rowData?.MonedaDebito ?? ""),
    enabled: open && esCuentaAhorro && !!rowData?.CCI,
  });

  const [tarjeta, setTarjeta] = useState("");
  const [monto, setMonto] = useState("");
  const [Aporte, setAporte] = useState("");
 
  const [monedaDebito, setMonedaDebito] = useState("");
  const [diaDebito, setDiaDebito] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [idTC, setidTC] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [cardError, setCardError] = useState("");
const [expiryError, setExpiryError] = useState("");
const { validateCard } = useCardValidator();
const { getExpiryError } = useExpiryDateValidator();
const [montoError, setMontoError] = useState("");
  const esAporteMensual = Aporte.trim().toUpperCase() === "MENSUAL";
  const tieneSeguro = Boolean(rowData?.tieneSeguro);
  const valoresSeguro = calculateInsuranceValues({
    tieneSeguro,
    tipoSeguro: Number(rowData?.tipoSeguro ?? 0),
    aporte: Number(monto.replace(/,/g, "")) || 0,
    tipoAporte: Aporte,
    valoresActuales: {
      prima: Number(rowData?.primaActual ?? 0),
      sumaAsegurada: Number(rowData?.sumaAseguradaActual ?? 0),
    },
    moneda: monedaDebito,
  });
  const {
    open: confirmOpen,
    loading: confirmLoading,
    options: confirmOptions,
    showConfirm,
    handleCancel: handleConfirmCancel,
    handleConfirm: handleConfirmExecute,
  } = useConfirmDialog();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (rowData) {
      const tarjetaFila = String(rowData.Tarjeta ?? "");

      setTarjeta(tarjetaFila);
      setMonto(rowData.Monto || "");
      setMonedaDebito(
        normalizeCurrency(rowData.MonedaDebito, rowData.MonedaCCI)
      );
      setDiaDebito(rowData.DiaDebito || "");
      setFechaVencimiento(
  rowData.FechaVencimiento
    ? `${rowData.FechaVencimiento.slice(0, 2)}/${rowData.FechaVencimiento.slice(-2)}`
    : ""
);
      setidTC(rowData.ID || "");
      setAporte(rowData.TipoDebito || "MENSUAL");
      
      
    }
  }, [rowData]);

  const handleSave = () => {
    const [mes, anio] = fechaVencimiento.split("/");
    const montoNumerico = parseFloat(monto);
    const monedaNormalizada = normalizeCurrency(
      monedaDebito,
      rowData?.MonedaCCI
    );
    const montoMinimo = getCurrencyMinimum(monedaNormalizada);

if (isNaN(montoNumerico) || montoNumerico < 0) {
  setMontoError("El monto no puede ser negativo o vacío");
  return;
}

if (!monedaNormalizada || montoMinimo === null) {
  setMontoError("No se pudo determinar la moneda del registro");
  return;
}

if (montoNumerico < montoMinimo) {
  setMontoError(getCurrencyMinimumMessage(monedaNormalizada));
  return;
}
    const datosActualizados = {
      ...rowData,
      Tarjeta: tarjeta,
      Monto: String(monto),
      MonedaCCI: normalizeCurrency(rowData?.MonedaCCI, monedaNormalizada),
      MonedaDebito: monedaNormalizada,
      DiaDebito: diaDebito,
      Aporte: Aporte || "MENSUAL",
      Vencimiento: esCuentaAhorro ? "" : `${mes}20${anio}`,
      TipoDebito: esCuentaAhorro ? "CA" : "TC",
      ID: String(idTC),
      Estado: "A",
      Canal: "PRUEBAS",
    };


const cardValidationError = esCuentaAhorro ? "" : validateCard(tarjeta).cardNumber;
const expiryValidationError = esCuentaAhorro ? "" : getExpiryError(fechaVencimiento);

if (cardValidationError || expiryValidationError) {
  setCardError(cardValidationError ?? "");
  setExpiryError(expiryValidationError ?? "");
  return; 
}
    showConfirm({
      title: "Confirmar Actualización",
      message: "¿Deseas Guardar los Cambios?",
      confirmButtonText: "Actualizar",
      confirmColor: "primary",
      onConfirm: async () => {
        if (esCuentaAhorro) {
          await updateCard(datosActualizados);
        } else {
          const encrypted = await encryptWithPublicKey({
                      Tarjeta: datosActualizados.Tarjeta,
                      Vencimiento: datosActualizados.Vencimiento
                    });
         
                    const cardToSend = {
                      ...datosActualizados,
                        Tarjeta: '',
                Vencimiento: '',
                      EncryptedPayload: encrypted, 
                    }; 

          await updateCard(cardToSend);
        }
      
        onUpdateSuccess();
       
        setSnackbarOpen(true); // mostrar mensaje de éxito
        closeDialog(); // cerrar el diálogo
      },
    });
  };

  return (
    <>
      <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle
  sx={{
    textAlign: "center",
    color: "red"
  }}
>
  Modificar Aporte
</DialogTitle>
        <DialogContent>
         {esCuentaAhorro ? (
          <FormControl fullWidth margin="normal" disabled={loadingCuentasAhorro}>
            <InputLabel>Cuenta de ahorro</InputLabel>
            <Select
              value={tarjeta}
              label="Cuenta de ahorro"
              onChange={(e) => setTarjeta(e.target.value)}
            >
              {tarjeta && !cuentasAhorro.some((cuenta) => cuenta.cuenta === tarjeta) && (
                <MenuItem value={tarjeta}>{tarjeta}</MenuItem>
              )}
              {cuentasAhorro.map((cuenta) => (
                <MenuItem value={cuenta.cuenta} key={cuenta.cuenta}>
                  {[cuenta.cuenta, cuenta.moneda, cuenta.descripcion].filter(Boolean).join(" - ")}
                </MenuItem>
              ))}
            </Select>
            {errorCuentasAhorro && <small>{errorCuentasAhorro}</small>}
          </FormControl>
         ) : (
         <FormControl fullWidth margin="normal">
  <CardNumberMaskedField
    key={String(rowData?.ID ?? "sin-id")}
    name="cardnumber"
    value={tarjeta}
    onChange={(e) => {
      setTarjeta(e.target.value);
      setCardError("");
    }}
    error={!!cardError}
    helperText={cardError}
  />
</FormControl>
         )}

          <TextField
  fullWidth
  margin="normal"
  label="Monto"
  name="monto"
  value={monto}
  onChange={(e) => {
    setMonto(e.target.value);
    setMontoError(""); // limpiar error al escribir
  }}
  error={!!montoError}
  helperText={montoError}
  InputProps={{
    inputComponent: CurrencyFormatCustom as any,
  }}
  inputProps={{
    prefix: getCurrencyPrefix(monedaDebito),
  }}
/>

          {tieneSeguro && esAporteMensual && (
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Suma asegurada"
                value={valoresSeguro.sumaAsegurada.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                label="Prima"
                value={valoresSeguro.prima.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                InputProps={{ readOnly: true }}
              />
            </Box>
          )}

         

          <FormControl fullWidth margin="normal">
            <InputLabel>Día de Débito</InputLabel>
            <Select
              value={diaDebito}
              onChange={(e) => setDiaDebito(e.target.value)}
              label="Día de Débito"
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

          {!esCuentaAhorro && <FormControl fullWidth margin="normal">
            
            <ExpiryDateMaskedField
  name="expiryDate"
  value={fechaVencimiento}
  onChange={(e) => {
    setFechaVencimiento(e.target.value);
    setExpiryError("");
  }}
  error={!!expiryError}
  helperText={expiryError}
/>
          </FormControl>}

          <Button onClick={handleSave} variant="contained" color="primary"  fullWidth
            sx={{ mt: 1 }}>
            Guardar
          </Button>

          <Button
            onClick={closeDialog}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
          >
            Cancelar
          </Button>
        </DialogContent>
      </Dialog>

      {/* ConfirmDialog para confirmar la edición */}
      <ConfirmDialog
        open={confirmOpen}
        loading={confirmLoading}
        options={confirmOptions}
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmExecute}
      />

      {/* Snackbar para mensaje de éxito */}
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
          ¡Tarjeta Actualizada con Éxito!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditDialog;
