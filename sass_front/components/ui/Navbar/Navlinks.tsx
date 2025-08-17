'use client';

import Link from 'next/link';
import { Button, Box, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import Logo from '@/components/icons/Logo';

interface User {
  id: string;
  email: string;
}

interface NavlinksProps {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
}

export default function Navlinks({ user, isAuthenticated, logout }: NavlinksProps) {
  const buttonStyles = {
    textTransform: 'none',
    fontSize: '1rem',
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Link href="/" passHref>
          <Logo />
        </Link>
        <Button color="inherit" component={Link} href="/#features" sx={buttonStyles}>
          Funcionalidades
        </Button>
        <Button color="inherit" component={Link} href="/#pricing" sx={buttonStyles}>
          Precios
        </Button>
        <Button color="inherit" component={Link} href="/#blog" sx={buttonStyles}>
          Blog
        </Button>
        <Button color="inherit" component={Link} href="/#help" sx={buttonStyles}>
          Ayuda
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} href="/account" sx={buttonStyles}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={logout} sx={buttonStyles}>
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} href="/signin" sx={buttonStyles}>
            Iniciar Sesión
          </Button>
        )}
        <Button variant="contained" color="primary" sx={{ ...buttonStyles, borderRadius: '20px' }}>
          Descargar App
        </Button>
        <FormControl size="small" variant="outlined" sx={{ minWidth: 60 }}>
          <Select
            value="es"
            IconComponent={LanguageIcon}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiSelect-select': {
                padding: '8px',
              },
            }}
          >
            <MenuItem value="es">ES</MenuItem>
            <MenuItem value="en">EN</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
