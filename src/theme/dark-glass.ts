// src/theme/darkTheme.ts
import { ThemeOptions } from '@mui/material';
import { PALETTE_COLORS, COMMON_COLORS } from './colors';

export const DARK_GLASS_THEME: ThemeOptions = {
  palette: {
    mode: 'dark',
    ...PALETTE_COLORS,
    background: {
      default: 'rgba(3, 1, 24, 0.8)', // Transparent dark background
      paper: 'rgba(255, 255, 255, 0.05)', // Glass effect for cards/dialogs
    },
    text: {
      primary: COMMON_COLORS.white,
      secondary: COMMON_COLORS.grayMedium,
    },
    divider: 'rgba(255,255,255,0.15)',
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(25, 25, 25, 0.5)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(6px)',
          textTransform: 'none',
        },
      },
    },
  },
};

export default DARK_GLASS_THEME;
