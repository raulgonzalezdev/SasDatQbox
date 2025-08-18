'use client';
import { Box, Container, Typography, Grid, Paper, Avatar } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';

export default function AboutSection() {
  return (
    <Box
      id="sobre-nosotros"
      sx={{
        py: 8,
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 6,
          }}
        >
          Sobre Nosotros
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                textAlign: 'center',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  boxShadow: 4,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                <BusinessIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Nuestra Misión
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Transformar la atención médica digital proporcionando herramientas innovadoras 
                que conecten a médicos y pacientes de manera segura y eficiente.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                textAlign: 'center',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  boxShadow: 4,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                <PeopleIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Nuestra Visión
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ser la plataforma líder en telemedicina, facilitando el acceso a atención 
                médica de calidad desde cualquier lugar del mundo.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                textAlign: 'center',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  boxShadow: 4,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                }}
              >
                <SecurityIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Nuestros Valores
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Compromiso con la excelencia, innovación constante, seguridad de datos 
                y atención centrada en el paciente.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ¿Por qué elegir BoxDoctor?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            BoxDoctor nació de la necesidad de modernizar la atención médica. Nuestro equipo 
            de expertos en tecnología y profesionales de la salud trabaja incansablemente 
            para crear una plataforma que no solo cumpla con los estándares más altos de 
            seguridad, sino que también ofrezca una experiencia excepcional tanto para 
            médicos como para pacientes.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
