'use client';

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, IconButton, Menu, MenuItem, Chip,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import { toast } from 'react-hot-toast';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: 'Active' | 'Inactive'; // Example status
}

const statusMap = {
  Active: { label: 'Activo', color: 'success' as const },
  Inactive: { label: 'Inactivo', color: 'default' as const },
};

const deletePatient = async (patientId: string) => {
  const res = await customFetch(`/api/v1/patients/${patientId}`, { method: 'DELETE' });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Error al eliminar el paciente');
  }
  return res.json();
};

export default function PatientsTable({ patients }: { patients: Patient[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      toast.success('Paciente eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => handleApiError(error),
    onSettled: () => {
      handleMenuClose();
      handleConfirmClose();
    },
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, patientId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatientId(patientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    if (selectedPatientId) {
      router.push(`/account/patients/${selectedPatientId}/edit`);
    }
    handleMenuClose();
  };

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };
  
  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setSelectedPatientId(null); // Deseleccionar al cerrar
  };

  const handleDelete = () => {
    if (selectedPatientId) {
      mutation.mutate(selectedPatientId);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre Completo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {`${patient.first_name} ${patient.last_name}`}
                  </TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone_number}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusMap[patient.status]?.label || 'Desconocido'}
                      color={statusMap[patient.status]?.color || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, patient.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography sx={{ py: 3 }}>No hay pacientes registrados.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Ver Expediente</MenuItem>
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <MenuItem onClick={handleConfirmOpen} sx={{ color: 'error.main' }}>Eliminar</MenuItem>
      </Menu>
      <Dialog open={isConfirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar a este paciente? Esta acción es permanente y no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} disabled={mutation.isPending}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" disabled={mutation.isPending}>
            {mutation.isPending ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
