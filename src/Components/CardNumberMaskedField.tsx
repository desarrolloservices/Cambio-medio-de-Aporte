import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { IMaskInput } from "react-imask";

interface CustomProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
    onFocus?: () => void;
}

const CardMaskCustom = React.forwardRef<HTMLInputElement, any>(
  function CardMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="0000 0000 0000 0000[ 000]" // admite hasta 19 dígitos con formato de tarjeta
        overwrite
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({
            target: {
              name: props.name,
              value: value.replace(/\s/g, ""), // sin espacios para validar/guardar
            },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      />
    );
  }
);

const CardNumberMaskedField: React.FC<CustomProps> = ({
  name,
  value,
  onChange,
  error,
  helperText,
}) => {
  return (
    <TextField
      label="Número de la Tarjeta"
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      variant="outlined"
      error={error}
      helperText={helperText}
      inputProps={{
        inputMode: "numeric",
      }}
      InputProps={{
        inputComponent: CardMaskCustom as any,
        startAdornment: (
          <InputAdornment position="start">
            <CreditCardIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CardNumberMaskedField;
