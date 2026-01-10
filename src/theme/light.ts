import { ThemeOptions } from '@mui/material';
import { PALETTE_COLORS, COMMON_COLORS } from './colors';

/**
 * MUI theme options for "Light Mode"
 */
export const LIGHT_THEME: ThemeOptions = {
  palette: {
    mode: 'light',
    ...PALETTE_COLORS,
    divider: '#E0E0E0', // Light gray divider
  },
  
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
};

export default LIGHT_THEME;
