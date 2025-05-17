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
import { useEditDialog } from "../Context/EditDialogContext";
import UseUpdateCard from "../Hooks/UseUpdateCard";
import ConfirmDialog from './ConfirmDialog';
import { useConfirmDialog } from '../Hooks/UseConfirmDialog';

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

const EditDialog: React.FC<EditDialogProps> = ({ onUpdateSuccess }) => {
  const { open, rowData, closeDialog } = useEditDialog();
  const { updateCard } = UseUpdateCard();

  const [tarjeta, setTarjeta] = useState("");
  const [monto, setMonto] = useState("");
  const [Aporte, setAporte] = useState("");
 
  //const [monedaDebito, setMonedaDebito] = useState("");
  const [diaDebito, setDiaDebito] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [idTC, setidTC] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
      setTarjeta(rowData.Tarjeta || "");
      setMonto(rowData.Monto || "");
      //setMonedaDebito(rowData.MonedaDebito || "");
      setDiaDebito(rowData.DiaDebito || "");
      setFechaVencimiento(rowData.FechaVencimiento || "");
      setidTC(rowData.ID || "");
      setAporte(rowData.Aporte||"");
      
      
    }
  }, [rowData]);

  const handleSave = () => {
    const datosActualizados = {
      ...rowData,
      Tarjeta: tarjeta,
      Monto: String(monto),
      //MonedaDebito: monedaDebito,
      DiaDebito: diaDebito,
      Aporte:"MENSUAL",
      Vencimiento: fechaVencimiento.replace("/", ""),
      ID: String(idTC),
      Estado: "A",
    };

    showConfirm({
      title: "Confirmar Actualización",
      message: "¿Deseas Guardar los Cambios?",
      confirmButtonText: "Actualizar",
      confirmColor: "primary",
      onConfirm: async () => {
        await updateCard(datosActualizados);
      
        onUpdateSuccess();
        await delay(4000); // esperar antes del cierre visual
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
          <TextField
            fullWidth
            margin="normal"
            label="Número de Tarjeta"
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Monto"
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />

         

          <FormControl fullWidth margin="normal">
            <InputLabel>Día de Débito</InputLabel>
            <Select
              value={diaDebito}
              onChange={(e) => setDiaDebito(e.target.value)}
              label="Día de Débito"
            >
              {[...Array(27)].map((_, i) => {
                const val = (i + 2).toString();
                return (
                  <MenuItem value={val} key={val}>
                    {val}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Fecha de Vencimiento</InputLabel>
            <OutlinedInput
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              placeholder="MM/YYYY"
              name="fechaVencimiento"
              id="fechaVencimiento"
              inputComponent={TextMaskCustom as any}
              label="Fecha de Vencimiento"
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
        autoHideDuration={3000}
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
