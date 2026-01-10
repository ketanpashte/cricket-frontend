// src/theme/darkTheme.ts
import { ThemeOptions } from '@mui/material';
import { PALETTE_COLORS, COMMON_COLORS } from './colors';

export const DARK_THEME: ThemeOptions = {
  palette: {
    mode: 'dark',
    ...PALETTE_COLORS,
    background: {
      default: '#030118ff', // Main background
    },
    text: {
      primary: COMMON_COLORS.white,
      secondary: COMMON_COLORS.grayMedium,
    },
    divider: '#333333',
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
};

export default DARK_THEME;

