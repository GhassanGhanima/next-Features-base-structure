'use client';

import Typography, { TypographyProps } from '@mui/material/Typography';
import { forwardRef } from 'react';

export interface MuiTypographyProps extends Omit<TypographyProps, 'color'> {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'textPrimary' | 'textSecondary';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'button' | 'caption' | 'overline';
  children: React.ReactNode;
}

/**
 * MUI Typography wrapper component for use in server components.
 */
const MuiTypography = forwardRef<HTMLDivElement, MuiTypographyProps>(
  ({ variant = 'body1', color, children, ...props }, ref) => {
    return (
      <Typography variant={variant} color={color} ref={ref} {...props}>
        {children}
      </Typography>
    );
  }
);

MuiTypography.displayName = 'MuiTypography';

export default MuiTypography;
