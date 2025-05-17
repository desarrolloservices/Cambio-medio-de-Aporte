// ConfirmDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { ConfirmOptions } from '../Hooks/UseConfirmDialog';

interface Props {
  open: boolean;
  loading: boolean;
  options: ConfirmOptions | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<Props> = ({
  open,
  loading,
  options,
  onCancel,
  onConfirm,
}) => {
  if (!options) return null;

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle sx={{
    textAlign: "center",
    color: "red"
  }}>{options.title ?? 'Confirmación'}</DialogTitle>
      <DialogContent>
        <Typography>{options.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button
          onClick={onConfirm}
          color={options.confirmColor ?? 'primary'}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : options.confirmButtonText ?? 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
