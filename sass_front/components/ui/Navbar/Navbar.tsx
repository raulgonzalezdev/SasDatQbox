'use client';

import Navlinks from './Navlinks';
import { useAuth } from '@/hooks/useAuth';
import { AppBar, Toolbar, Box, CircularProgress, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();

  // No renderizar el Navbar principal en las páginas del dashboard
  if (pathname.startsWith('/account')) {
    return null;
  }

  return (
    <AppBar position="sticky" sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider'
    }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <a href="#skip" style={{ position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', border: 0 }}>
            Saltar al contenido
          </a>
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <Typography variant="body2">Cargando...</Typography>
            </Box>
          ) : (
            <Navlinks user={user} isAuthenticated={isAuthenticated} logout={logout} />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
