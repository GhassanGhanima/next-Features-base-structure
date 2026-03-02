'use client';

import CardContent, { CardContentProps } from '@mui/material/CardContent';
import { forwardRef } from 'react';

export interface MuiCardContentProps extends CardContentProps {
  children: React.ReactNode;
}

/**
 * MUI CardContent wrapper component for use in server components.
 */
const MuiCardContent = forwardRef<HTMLDivElement, MuiCardContentProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardContent ref={ref} {...props}>
        {children}
      </CardContent>
    );
  }
);

MuiCardContent.displayName = 'MuiCardContent';

export default MuiCardContent;
