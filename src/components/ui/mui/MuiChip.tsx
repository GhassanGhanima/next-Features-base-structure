'use client';

import Chip, { ChipProps } from '@mui/material/Chip';
import { forwardRef } from 'react';

export interface MuiChipProps extends Omit<ChipProps, 'color'> {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  label: string;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  onDelete?: () => void;
}

/**
 * MUI Chip wrapper component for use in server components.
 */
const MuiChip = forwardRef<HTMLDivElement, MuiChipProps>(
  ({ variant = 'filled', size = 'medium', ...props }, ref) => {
    return <Chip variant={variant} size={size} ref={ref} {...props} />;
  }
);

MuiChip.displayName = 'MuiChip';

export default MuiChip;
