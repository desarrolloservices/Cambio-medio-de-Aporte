import React from "react";
import { TextField } from "@mui/material";
import { IMask, IMaskInput } from "react-imask";

interface CustomProps {
  name: string;
  value: string;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
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
            maxLength: 2,
          },
          YY: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 99,
          },
        }}
        inputRef={ref}
        overwrite
        onAccept={(value: any) => {
          const syntheticEvent = {
            target: {
              name: props.name,
              value,
            },
          } as React.ChangeEvent<HTMLInputElement>;

          onChange(syntheticEvent);
        }}
      />
    );
  }
);


const ExpiryDateMaskedField: React.FC<CustomProps> = ({
  name,
  value,
  onChange,
  label = "Fecha de Expiración",
  placeholder = "MM/YY",
  error = false,
  helperText = "",
}) => {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth
      error={error}
      helperText={helperText}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: TextMaskCustom as any,
      }}
    />
  );
};

export default ExpiryDateMaskedField;
