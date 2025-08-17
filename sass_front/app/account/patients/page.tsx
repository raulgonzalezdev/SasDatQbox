'use client';

import { Box, Typography, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import PatientsTable from '@/components/ui/Dashboard/PatientsTable';
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';

// Suponiendo que esta es la estructura de datos del paciente
interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  contact_info: {
    email: string;
    phone_number: string;
  };
  // Agrega otros campos que necesites
}

const fetchPatients = async (): Promise<Patient[]> => {
  const res = await customFetch('/api/v1/patients/');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};


export default function PatientsPage() {
  const { data: patients, error, isLoading } = useQuery<Patient[]>({
    queryKey: ['patients'],
    queryFn: fetchPatients
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Pacientes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          href="/account/patients/new"
        >
          Añadir Nuevo Paciente
        </Button>
      </Box>
      <PatientsTable patients={patients || []} />
    </Box>
  );
}
