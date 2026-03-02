'use client';

import CardActions, { CardActionsProps } from '@mui/material/CardActions';
import { forwardRef } from 'react';

export interface MuiCardActionsProps extends CardActionsProps {
  children: React.ReactNode;
}

/**
 * MUI CardActions wrapper component for use in server components.
 */
const MuiCardActions = forwardRef<HTMLDivElement, MuiCardActionsProps>(
  ({ children, ...props }, ref) => {
    return (
      <CardActions ref={ref} {...props}>
        {children}
      </CardActions>
    );
  }
);

MuiCardActions.displayName = 'MuiCardActions';

export default MuiCardActions;
