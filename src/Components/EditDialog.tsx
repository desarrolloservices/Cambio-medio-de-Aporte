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
import { encryptWithPublicKey } from "../Utils/encryptWithPublicKey";
import {
  getCurrencyMinimum,
  getCurrencyMinimumMessage,
  getCurrencyPrefix,
  normalizeCurrency,
} from "../Utils/currency";
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
      setAporte(rowData.Aporte||"");
      
      
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
      Aporte:"MENSUAL",
      Vencimiento: `${mes}20${anio}`,
      ID: String(idTC),
      Estado: "A",
      Canal: "PRUEBAS",
    };


const cardValidationError = validateCard(tarjeta).cardNumber;
const expiryValidationError = getExpiryError(fechaVencimiento);

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

          <FormControl fullWidth margin="normal">
            
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
          </FormControl>

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
