'use client';

import Button, { ButtonProps } from '@mui/material/Button';
import { forwardRef } from 'react';

export interface MuiButtonProps extends Omit<ButtonProps, 'color'> {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inherit';
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

/**
 * MUI Button wrapper component for use in server components.
 * Extends MUI Button with TypeScript types and defaults.
 */
const MuiButton = forwardRef<HTMLButtonElement, MuiButtonProps>(
  ({ variant = 'contained', color = 'primary', size = 'medium', children, ...props }, ref) => {
    return (
      <Button variant={variant} color={color} size={size} ref={ref} {...props}>
        {children}
      </Button>
    );
  }
);

MuiButton.displayName = 'MuiButton';

export default MuiButton;
