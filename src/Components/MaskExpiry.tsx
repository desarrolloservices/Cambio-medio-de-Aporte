import React, { useRef, useEffect, FC, forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import IMask from 'imask';

interface OwnProps {
  onValueChange?: (value: string) => void;
}

type MaskedTextFieldProps = TextFieldProps & OwnProps;

const MaskExpiry: FC<MaskedTextFieldProps> = forwardRef(({ onValueChange, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      const maskOptions = {
        mask: '00 / 00',
        lazy: false,
        onAccept: () => {
          if (onValueChange) {
            onValueChange(inputRef.current?.value || '');
          }
        }
      };
      const mask = IMask(inputRef.current, maskOptions);

      return () => {
        mask.destroy();
      };
    }
  }, [onValueChange]);

  return (
    <TextField
      {...props}
      inputRef={(node) => {
        inputRef.current = node;
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      }}
    />
  );
});

export default MaskExpiry;