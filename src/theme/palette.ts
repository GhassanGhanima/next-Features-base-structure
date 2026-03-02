import { PaletteOptions } from '@mui/material/styles';

// Map colors from tailwind.config.ts to MUI palette
const palette: PaletteOptions = {
  primary: {
    main: '#0ea5e9',      // primary-500
    light: '#38bdf8',     // primary-400
    dark: '#0284c7',      // primary-600
    contrastText: '#fff',
  },
  secondary: {
    main: '#a855f7',      // secondary-500
    light: '#c084fc',     // secondary-400
    dark: '#9333ea',      // secondary-600
    contrastText: '#fff',
  },
  error: {
    main: '#ef4444',      // error-500
    light: '#f87171',     // error-400
    dark: '#dc2626',      // error-600
    contrastText: '#fff',
  },
  warning: {
    main: '#f59e0b',      // warning-500
    light: '#fbbf24',     // warning-400
    dark: '#d97706',      // warning-600
    contrastText: '#fff',
  },
  success: {
    main: '#22c55e',      // success-500
    light: '#4ade80',     // success-400
    dark: '#16a34a',      // success-600
    contrastText: '#fff',
  },
  info: {
    main: '#3b82f6',      // info-500
    light: '#60a5fa',     // info-400
    dark: '#2563eb',      // info-600
    contrastText: '#fff',
  },

  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  text: {
    primary: '#171717',   // neutral-900
    secondary: '#737373', // neutral-500
    disabled: '#a3a3a3',  // neutral-400
  },
  divider: '#e5e5e5',     // neutral-200
};

export default palette;
