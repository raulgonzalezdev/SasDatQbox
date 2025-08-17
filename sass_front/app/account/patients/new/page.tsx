import { Box, Typography } from '@mui/material';
import PatientForm from '@/components/ui/Dashboard/PatientForm';

export default function NewPatientPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Añadir Nuevo Paciente
      </Typography>
      <PatientForm />
    </Box>
  );
}
