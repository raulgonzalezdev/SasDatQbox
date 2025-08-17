import { Box, Typography, Container, Paper, Avatar, Grid } from '@mui/material';

export default function AboutUsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          Nuestra Misión
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
          Revolucionar la telemedicina, haciendo que la atención médica de calidad sea accesible para todos, en cualquier lugar.
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Sobre BoxDoctor</Typography>
            <Typography paragraph align="left">
              BoxDoctor nació de la visión de un grupo de médicos y tecnólogos que creían que la tecnología podía cerrar la brecha entre pacientes y proveedores de salud. Cansados de sistemas anticuados y poco intuitivos, nos propusimos crear una plataforma de telemedicina que fuera segura, fácil de usar y totalmente personalizable para adaptarse a las necesidades de cada práctica médica.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Nuestro Equipo</Typography>
            <Typography paragraph align="left">
              Somos un equipo diverso de profesionales apasionados por la salud y la innovación. Desde desarrolladores de software hasta expertos en cumplimiento normativo, cada miembro de BoxDoctor comparte el compromiso de ofrecer una herramienta que realmente marque la diferencia en la vida de las personas.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
