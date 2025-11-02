    // SuccessSnackbar.tsx
    import React from 'react';
    import Snackbar from '@mui/material/Snackbar';
    import Alert from '@mui/material/Alert';
    import { SuccessSnackbarProps } from '../Types/HelperTypes';

    const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
    open,
    onClose,
    message = "This is a success Alert inside a Snackbar!",
    autoHideDuration = 6000,
    }) => {
    return (
        <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert
            onClose={onClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
        >
            {message}
        </Alert>
        </Snackbar>
    );
    };

    export default SuccessSnackbar;
