'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/themeStore';

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
    orange: Palette['primary'];
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
    orange?: PaletteOptions['primary'];
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
    orange: true;
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
    orange: true;
  }
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { mode, primaryColor, secondaryColor, isDarkMode } = useThemeStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const createAppTheme = (isDark: boolean) => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: primaryColor,
        light: isDark ? '#4db6ac' : '#4db6ac',
        dark: isDark ? '#009ba9' : '#009ba9',
        contrastText: '#fff',
      },
      secondary: {
        main: secondaryColor,
        light: isDark ? '#ffb26d' : '#ffb26d',
        dark: isDark ? '#e87246' : '#e87246',
        contrastText: isDark ? '#fff' : '#333',
      },
      accent: {
        main: secondaryColor,
        light: isDark ? '#ffb26d' : '#ffb26d',
        dark: isDark ? '#e87246' : '#e87246',
        contrastText: isDark ? '#fff' : '#333',
      },
      accentOrange: {
        main: '#ffb26d',
        light: isDark ? '#ffe6d0' : '#ffe6d0',
        dark: isDark ? '#e87246' : '#e87246',
        contrastText: isDark ? '#fff' : '#333',
      },
      accentOrange2: {
        main: '#ffe6d0',
        light: isDark ? '#fff' : '#fff',
        dark: isDark ? '#ffb26d' : '#ffb26d',
        contrastText: isDark ? '#fff' : '#333',
      },
      accentHover: {
        main: '#e87246',
        light: isDark ? '#fcb079' : '#fcb079',
        dark: isDark ? '#d65a2e' : '#d65a2e',
        contrastText: '#fff',
      },
      redDelete: {
        main: '#f36a57',
        light: isDark ? '#f88a7a' : '#f88a7a',
        dark: isDark ? '#d54a37' : '#d54a37',
        contrastText: '#fff',
      },
      base1: {
        main: '#009ba9',
        light: isDark ? '#2baf9a' : '#2baf9a',
        dark: isDark ? '#007a85' : '#007a85',
        contrastText: '#fff',
      },
      borderLine: {
        main: '#4db6ac',
        light: isDark ? '#6bc5bb' : '#6bc5bb',
        dark: isDark ? '#2baf9a' : '#2baf9a',
        contrastText: '#fff',
      },
      fontPrimary: {
        main: isDark ? '#ffffff' : '#003236',
        light: isDark ? '#e0e0e0' : '#004a52',
        dark: isDark ? '#bdbdbd' : '#001a1d',
        contrastText: isDark ? '#333' : '#fff',
      },
      orange: {
        main: '#ff6b35',
        light: isDark ? '#ff8a5c' : '#ff8a5c',
        dark: isDark ? '#e55a2b' : '#e55a2b',
        contrastText: '#fff',
      },
      text: {
        primary: isDark ? '#ffffff' : '#333',
        secondary: isDark ? '#bdbdbd' : '#757575',
      },
      background: {
        default: isDark ? '#121212' : '#f8f9fa',
        paper: isDark ? '#1e1e1e' : '#fff',
      },
      divider: isDark ? '#424242' : '#e0e0e0',
    },
    typography: {
      fontFamily: 'var(--font-rubik), -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      h1: {
        fontFamily: 'var(--font-rubik), sans-serif',
        fontWeight: 700,
        color: isDark ? '#ffffff' : '#003236',
      },
      h2: {
        fontFamily: 'var(--font-rubik), sans-serif',
        fontWeight: 600,
        color: isDark ? '#ffffff' : '#003236',
      },
      h3: {
        fontFamily: 'var(--font-rubik), sans-serif',
        fontWeight: 600,
        color: isDark ? '#ffffff' : '#003236',
      },
      h4: {
        fontFamily: 'var(--font-rubik), sans-serif',
        fontWeight: 500,
        color: isDark ? '#ffffff' : '#003236',
      },
      h5: {
        fontFamily: 'var(--font-rubik), sans-serif',
        fontWeight: 500,
        color: isDark ? '#ffffff' : '#003236',
      },
      h6: {
        fontFamily: 'var(--font-rubik), sans-serif',
        fontWeight: 500,
        color: isDark ? '#ffffff' : '#003236',
      },
      body1: {
        fontFamily: 'var(--font-rubik), sans-serif',
        color: isDark ? '#ffffff' : '#333',
      },
      body2: {
        fontFamily: 'var(--font-rubik), sans-serif',
        color: isDark ? '#bdbdbd' : '#757575',
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
              boxShadow: isDark ? '0 2px 8px rgba(255,255,255,0.15)' : '0 2px 8px rgba(0,0,0,0.15)',
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
            boxShadow: isDark ? '0 2px 8px rgba(255,255,255,0.08)' : '0 2px 8px rgba(0,0,0,0.08)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDark ? '0 2px 8px rgba(255,255,255,0.08)' : '0 2px 8px rgba(0,0,0,0.08)',
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
            boxShadow: isDark ? '0 2px 8px rgba(255,255,255,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            boxShadow: isDark ? '2px 0 8px rgba(255,255,255,0.1)' : '2px 0 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  });

  const theme = createAppTheme(isDarkMode());

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
