'use client';

import AppointmentForm from '@/components/ui/Dashboard/AppointmentForm';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function NewAppointmentPage() {
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, md: 4 }, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Programar Nueva Consulta
        </Typography>
        <Typography paragraph color="text.secondary">
          Selecciona un paciente y define los detalles para la nueva consulta médica.
        </Typography>
        <Box mt={4}>
          <AppointmentForm />
        </Box>
      </Paper>
    </Container>
  );
}
