import { createTheme, type ThemeOptions } from '@mui/material/styles';

const lightOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#000000' },
    secondary: { main: '#6b7280' },
    background: { default: '#f3f4f6', paper: '#ffffff' },
    text: { primary: '#111827', secondary: '#4b5563' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 16px' },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
        },
      },
    },
  },
};

const darkOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    secondary: { main: '#9ca3af' },
    background: { default: '#111827', paper: '#1f2937' },
    text: { primary: '#f9fafb', secondary: '#9ca3af' },
  },
  typography: lightOptions.typography,
  shape: lightOptions.shape,
  components: {
    ...lightOptions.components,
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255,255,255,0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(255,255,255,0.05)',
          backgroundColor: '#1f2937',
        },
      },
    },
  },
};

export const lightTheme = createTheme(lightOptions);
export const darkTheme = createTheme(darkOptions);
