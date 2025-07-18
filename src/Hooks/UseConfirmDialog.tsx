import { useState } from 'react';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmButtonText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'success';
  onConfirm: () => Promise<void> | void;
}

export const useConfirmDialog = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const showConfirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (!options?.onConfirm) return;
    setLoading(true);
    try {
      await options.onConfirm(); 
    } finally {
      setLoading(false);
      setOpen(false); 
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setLoading(false);
  };

  return {
    open,
    loading,
    options,
    showConfirm,
    handleConfirm,
    handleCancel,
  };
};
