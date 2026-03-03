'use client';

import Alert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { forwardRef } from 'react';

export interface MuiAlertProps extends Omit<AlertProps, 'color'> {
  severity?: 'success' | 'info' | 'warning' | 'error';
  variant?: 'filled' | 'outlined' | 'standard';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

/**
 * MUI Alert wrapper component for use in server components.
 */
const MuiAlert = forwardRef<HTMLDivElement, MuiAlertProps>(
  ({ severity = 'info', variant = 'standard', title, children, onClose, ...props }, ref) => {
    return (
      <Alert severity={severity} variant={variant} onClose={onClose} ref={ref} {...props}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </Alert>
    );
  }
);

MuiAlert.displayName = 'MuiAlert';

export default MuiAlert;
