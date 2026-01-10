// src/theme/colors.ts
import { SimplePaletteColorOptions } from '@mui/material';

// Core brand colors
export const COLOR_PRIMARY: SimplePaletteColorOptions = {
  main: '#1976D2',  // Blue
  light: '#63A4FF',
  dark: '#004BA0',
  contrastText: '#FFFFFF',
};

export const COLOR_SECONDARY: SimplePaletteColorOptions = {
  main: '#d308deff',  // Orange
  light: '#FFC947',
  dark: '#C66900',
  contrastText: '#FFFFFF',
};

// Status colors
export const COLOR_ERROR: SimplePaletteColorOptions = {
  main: '#E53935',
  light: '#FF6F60',
  dark: '#AB000D',
  contrastText: '#FFFFFF',
};

export const COLOR_WARNING: SimplePaletteColorOptions = {
  main: '#FB8C00',
  light: '#FFBD45',
  dark: '#C25E00',
  contrastText: '#FFFFFF',
};

export const COLOR_INFO: SimplePaletteColorOptions = {
  main: '#039BE5',
  light: '#63CCFF',
  dark: '#006DB3',
  contrastText: '#FFFFFF',
};

export const COLOR_SUCCESS: SimplePaletteColorOptions = {
  main: '#43A047',
  light: '#76D275',
  dark: '#00701A',
  contrastText: '#FFFFFF',
};

// Neutral / Background / Text colors (common for light & dark base)
export const COMMON_COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  grayLight: '#F5F5F5',
  grayMedium: '#9E9E9E',
  grayDark: '#424242',
};
export const PALETTE_COLORS = {
  primary: COLOR_PRIMARY,
  secondary: COLOR_SECONDARY,
  error: COLOR_ERROR,
  warning: COLOR_WARNING,
  info: COLOR_INFO,
  success: COLOR_SUCCESS,
  common: COMMON_COLORS,
};