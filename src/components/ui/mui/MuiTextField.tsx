'use client';

import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef } from 'react';

export interface MuiTextFieldProps extends Omit<TextFieldProps, 'color'> {
  label?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * MUI TextField wrapper component for use in server components.
 * Extends MUI TextField with TypeScript types and defaults.
 */
const MuiTextField = forwardRef<HTMLDivElement, MuiTextFieldProps>(
  ({ variant = 'outlined', size = 'small', ...props }, ref) => {
    return <TextField variant={variant} size={size} ref={ref} {...props} />;
  }
);

MuiTextField.displayName = 'MuiTextField';

export default MuiTextField;
