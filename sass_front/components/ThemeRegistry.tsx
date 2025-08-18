'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    accentOrange: Palette['primary'];
    accentOrange2: Palette['primary'];
    accentHover: Palette['primary'];
    redDelete: Palette['primary'];
    base1: Palette['primary'];
    borderLine: Palette['primary'];
    fontPrimary: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    accentOrange?: PaletteOptions['primary'];
    accentOrange2?: PaletteOptions['primary'];
    accentHover?: PaletteOptions['primary'];
    redDelete?: PaletteOptions['primary'];
    base1?: PaletteOptions['primary'];
    borderLine?: PaletteOptions['primary'];
    fontPrimary?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true;
    accentOrange: true;
    accentOrange2: true;
    accentHover: true;
    redDelete: true;
    base1: true;
    borderLine: true;
    fontPrimary: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    accent: true;
    accentOrange: true;
    accentOrange2: true;
    accentHover: true;
    redDelete: true;
    base1: true;
    borderLine: true;
    fontPrimary: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2baf9a',
      light: '#4db6ac',
      dark: '#009ba9',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fcb079',
      light: '#ffb26d',
      dark: '#e87246',
      contrastText: '#333',
    },
    accent: {
      main: '#fcb079',
      light: '#ffb26d',
      dark: '#e87246',
      contrastText: '#333',
    },
    accentOrange: {
      main: '#ffb26d',
      light: '#ffe6d0',
      dark: '#e87246',
      contrastText: '#333',
    },
    accentOrange2: {
      main: '#ffe6d0',
      light: '#fff',
      dark: '#ffb26d',
      contrastText: '#333',
    },
    accentHover: {
      main: '#e87246',
      light: '#fcb079',
      dark: '#d65a2e',
      contrastText: '#fff',
    },
    redDelete: {
      main: '#f36a57',
      light: '#f88a7a',
      dark: '#d54a37',
      contrastText: '#fff',
    },
    base1: {
      main: '#009ba9',
      light: '#2baf9a',
      dark: '#007a85',
      contrastText: '#fff',
    },
    borderLine: {
      main: '#4db6ac',
      light: '#6bc5bb',
      dark: '#2baf9a',
      contrastText: '#fff',
    },
    fontPrimary: {
      main: '#003236',
      light: '#004a52',
      dark: '#001a1d',
      contrastText: '#fff',
    },
    text: {
      primary: '#333',
      secondary: '#757575',
    },
    background: {
      default: '#f8f9fa',
      paper: '#fff',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: 'var(--font-rubik), -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontFamily: 'var(--font-rubik), sans-serif',
      fontWeight: 700,
      color: '#003236',
    },
    h2: {
      fontFamily: 'var(--font-rubik), sans-serif',
      fontWeight: 600,
      color: '#003236',
    },
    h3: {
      fontFamily: 'var(--font-rubik), sans-serif',
      fontWeight: 600,
      color: '#003236',
    },
    h4: {
      fontFamily: 'var(--font-rubik), sans-serif',
      fontWeight: 500,
      color: '#003236',
    },
    h5: {
      fontFamily: 'var(--font-rubik), sans-serif',
      fontWeight: 500,
      color: '#003236',
    },
    h6: {
      fontFamily: 'var(--font-rubik), sans-serif',
      fontWeight: 500,
      color: '#003236',
    },
    body1: {
      fontFamily: 'var(--font-rubik), sans-serif',
      color: '#333',
    },
    body2: {
      fontFamily: 'var(--font-rubik), sans-serif',
      color: '#757575',
    },
    button: {
      fontFamily: 'var(--font-rubik), sans-serif',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
