'use client';

import Box, { BoxProps } from '@mui/material/Box';
import { forwardRef } from 'react';

export interface MuiBoxProps extends BoxProps {
  children: React.ReactNode;
}

/**
 * MUI Box wrapper component for use in server components.
 * Provides a container for styling and layout.
 */
const MuiBox = forwardRef<HTMLDivElement, MuiBoxProps>(({ children, ...props }, ref) => {
  return (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  );
});

MuiBox.displayName = 'MuiBox';

export default MuiBox;
