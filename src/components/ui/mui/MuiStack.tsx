'use client';

import Stack, { StackProps } from '@mui/material/Stack';
import { forwardRef } from 'react';

export interface MuiStackProps extends StackProps {
  children: React.ReactNode;
}

/**
 * MUI Stack wrapper component for use in server components.
 * Provides flexbox layout with spacing.
 */
const MuiStack = forwardRef<HTMLDivElement, MuiStackProps>(({ children, ...props }, ref) => {
  return (
    <Stack ref={ref} {...props}>
      {children}
    </Stack>
  );
});

MuiStack.displayName = 'MuiStack';

export default MuiStack;
