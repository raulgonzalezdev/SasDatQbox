'use client';
import { Box, Container, Typography, Grid, Paper, Avatar, Chip } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldIcon from '@mui/icons-material/Shield';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DataUsageIcon from '@mui/icons-material/DataUsage';

export default function SecuritySection() {
  return (
    <Box
      id="seguridad"
      sx={{
        py: 8,
        backgroundColor: 'grey.50',
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
          Seguridad y Privacidad
        </Typography>

        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 6,
            color: 'text.secondary',
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          Su privacidad y la seguridad de sus datos médicos son nuestra máxima prioridad. 
          BoxDoctor cumple con los más altos estándares de seguridad internacionales.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  <LockIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Cifrado de Extremo a Extremo
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Todas las comunicaciones entre médicos y pacientes están cifradas con 
                tecnología AES-256, garantizando que sus datos médicos permanezcan 
                completamente seguros.
              </Typography>
              <Chip 
                label="AES-256" 
                color="primary" 
                variant="outlined" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label="TLS 1.3" 
                color="primary" 
                variant="outlined" 
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  <VerifiedUserIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Cumplimiento HIPAA
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                BoxDoctor cumple completamente con las regulaciones HIPAA, garantizando 
                que todos los datos de salud estén protegidos según los estándares 
                federales de los Estados Unidos.
              </Typography>
              <Chip 
                label="HIPAA Compliant" 
                color="success" 
                variant="outlined" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label="HITECH" 
                color="success" 
                variant="outlined" 
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  <ShieldIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Autenticación de Dos Factores
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Protección adicional con autenticación de dos factores (2FA) para 
                todas las cuentas, asegurando que solo usuarios autorizados puedan 
                acceder a la información médica.
              </Typography>
              <Chip 
                label="2FA" 
                color="warning" 
                variant="outlined" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label="SMS/App" 
                color="warning" 
                variant="outlined" 
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  <DataUsageIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Auditoría Completa
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Registro detallado de todas las actividades y accesos al sistema, 
                proporcionando transparencia total y cumplimiento con los requisitos 
                de auditoría médica.
              </Typography>
              <Chip 
                label="Audit Logs" 
                color="info" 
                variant="outlined" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label="24/7 Monitoring" 
                color="info" 
                variant="outlined" 
              />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Certificaciones de Seguridad
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mt: 3 }}>
            <Chip 
              label="SOC 2 Type II" 
              color="primary" 
              variant="filled" 
              sx={{ fontSize: '1rem', py: 1 }} 
            />
            <Chip 
              label="ISO 27001" 
              color="primary" 
              variant="filled" 
              sx={{ fontSize: '1rem', py: 1 }} 
            />
            <Chip 
              label="GDPR Compliant" 
              color="primary" 
              variant="filled" 
              sx={{ fontSize: '1rem', py: 1 }} 
            />
            <Chip 
              label="CCPA Compliant" 
              color="primary" 
              variant="filled" 
              sx={{ fontSize: '1rem', py: 1 }} 
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
