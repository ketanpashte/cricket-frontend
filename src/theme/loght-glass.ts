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

/**
 * MUI theme options for "Light Glass Mode" (Glassmorphism)
 */
export const LIGHT_GLASS_THEME: ThemeOptions = {
  palette: {
    mode: 'light',
    ...PALETTE_COLORS,
    background: {
      default: 'rgba(255, 255, 255, 0.6)', // translucent background
      paper: 'rgba(255, 255, 255, 0.4)',   // more transparent for cards/panels
    },
    divider: 'rgba(255, 255, 255, 0.3)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(12px)', // Glass blur
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
};

export default LIGHT_THEME;
