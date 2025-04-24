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
} from "@mui/material";
import { useEditDialog } from "../Context/EditDialogContext";
import { useState, useEffect } from "react";
import { IMaskInput } from "react-imask";
import UseUpdateCard from "../Hooks/UseUpdateCard";
import React from "react";
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
  const { updateCard, loading } = UseUpdateCard();

  const [tarjeta, setTarjeta] = useState("");
  const [monto, setMonto] = useState("");
  const [tipoDebito, setTipoDebito] = useState("");
  const [diaDebito, setDiaDebito] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [idTC, setidTC] = useState("");

  useEffect(() => {
    if (rowData) {
      setTarjeta(rowData.Tarjeta || "");
      setMonto(rowData.Monto || "");
      setTipoDebito(rowData.TipoDebito || "");
      setDiaDebito(rowData.DiaDebito || "");
      setFechaVencimiento(rowData.FechaVencimiento || "");
      setidTC(rowData.ID||"");
    }
  }, [rowData]);

  const handleSave = async () => {
    const datosActualizados = {
      ...rowData,
      Tarjeta: tarjeta,
      Monto:String(monto),
      Aporte: tipoDebito,
      DiaDebito: diaDebito,
      Vencimiento: fechaVencimiento.replace("/", ""),
      ID:String(idTC),
      Estado:"A",
    };

    await updateCard(datosActualizados);
onUpdateSuccess(); // 🔄 refresca datos en Form1.tsx
closeDialog();     // ✅ luego cierra el diálogo
  };

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Modificar Aporte</DialogTitle>
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
          <InputLabel>Tipo de Débito</InputLabel>
          <Select
            value={tipoDebito}
            onChange={(e) => setTipoDebito(e.target.value)}
            label="Tipo de Débito"
          >
            <MenuItem value="MENSUAL">MENSUAL</MenuItem>
            <MenuItem value="UNICO">UNÍCO</MenuItem>
          </Select>
        </FormControl>

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
          />
        </FormControl>

        {/* Botón Guardar */}
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>

        {/* Botón Cancelar */}
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
  );
};

export default EditDialog;
