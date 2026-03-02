'use client';

import Card, { CardProps } from '@mui/material/Card';
import { forwardRef } from 'react';

export interface MuiCardProps extends CardProps {
  children: React.ReactNode;
}

/**
 * MUI Card wrapper component for use in server components.
 * Extends MUI Card with TypeScript types.
 */
const MuiCard = forwardRef<HTMLDivElement, MuiCardProps>(({ children, ...props }, ref) => {
  return (
    <Card ref={ref} {...props}>
      {children}
    </Card>
  );
});

MuiCard.displayName = 'MuiCard';

export default MuiCard;
