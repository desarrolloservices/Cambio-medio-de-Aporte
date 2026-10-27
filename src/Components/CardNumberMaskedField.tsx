import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";

interface CustomProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
    onFocus?: () => void;
}

const normalizeCardNumber = (value: string): string =>
  String(value ?? "").replace(/\D/g, "").slice(0, 19);

const formatCardNumber = (value: string): string =>
  normalizeCardNumber(value).replace(/(.{4})/g, "$1 ").trim();

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
      value={formatCardNumber(value)}
      onChange={(event) => {
        onChange({
          target: {
            name,
            value: normalizeCardNumber(event.target.value),
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
      fullWidth
      variant="outlined"
      error={error}
      helperText={helperText}
      inputProps={{
        inputMode: "numeric",
        maxLength: 23,
        autoComplete: "cc-number",
      }}
      InputProps={{
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
