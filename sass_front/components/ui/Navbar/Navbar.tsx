import Navlinks from './Navlinks';
import { useUserDetails } from '@/lib/hooks/useData';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';

export default function Navbar() {
  const { data: user, isLoading, error } = useUserDetails();

  if (isLoading) {
    return <Typography>Cargando navegación...</Typography>;
  }

  if (error) {
    console.error('Error al cargar el usuario en la barra de navegación:', error);
    // Podrías mostrar un mensaje de error o simplemente no pasar el usuario
  }

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <a href="#skip" style={{ position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', border: 0 }}>
            Saltar al contenido
          </a>
          <Navlinks user={user} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
