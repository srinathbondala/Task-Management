// SnackbarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import SuccessSnackbar from '../Helpers/SuccessSnackbar';

type SnackbarContextType = {
  showMessage: (message: string, duration?: number) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

type SnackbarProviderProps = {
  children: ReactNode;
};

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [autoHideDuration, setAutoHideDuration] = useState(6000);

  const showMessage = (msg: string, duration = 6000) => {
    setMessage(msg);
    setAutoHideDuration(duration);
    setOpen(true);
  };

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <SuccessSnackbar
        open={open}
        onClose={handleClose}
        message={message}
        autoHideDuration={autoHideDuration}
      />
    </SnackbarContext.Provider>
  );
};
