import { Container, Grid, Typography, Link, Box, IconButton } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import Logo from '@/components/icons/Logo'; // Reutilizamos nuestro logo

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 6, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800] 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Logo />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              La gestión médica, simplificada y segura.
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>
              Producto
            </Typography>
            <Link href="#" color="text.secondary" display="block">Funcionalidades</Link>
            <Link href="#" color="text.secondary" display="block">Precios</Link>
            <Link href="#" color="text.secondary" display="block">Seguridad</Link>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>
              Empresa
            </Typography>
            <Link href="#" color="text.secondary" display="block">Sobre nosotros</Link>
            <Link href="#" color="text.secondary" display="block">Blog</Link>
            <Link href="#" color="text.secondary" display="block">Contacto</Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Descarga la App
            </Typography>
            <IconButton href="#" aria-label="App Store">
              <AppleIcon fontSize="large" />
            </IconButton>
            <IconButton href="#" aria-label="Google Play">
              <GoogleIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' SasDatQbox. Todos los derechos reservados.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
