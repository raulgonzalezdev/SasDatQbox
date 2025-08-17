'use client';

import { Box, Typography, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import PatientsTable from '@/components/ui/Dashboard/PatientsTable';
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';

const fetchPatients = async () => {
  return await customFetch('/patients/');
};

export default function PatientsPage() {
  const { data: patients, isLoading, isError } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography>Error al cargar la lista de pacientes.</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Pacientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/account/patients/new"
        >
          Añadir Paciente
        </Button>
      </Box>
      
      {patients && patients.length > 0 ? (
        <PatientsTable patients={patients} />
      ) : (
        <Typography>No se han encontrado pacientes. Añade uno para empezar.</Typography>
      )}
    </Box>
  );
}
