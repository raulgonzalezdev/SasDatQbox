'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// TODO: Usar el tipo de Patient real
type Patient = any;

interface PatientsTableProps {
  patients: Patient[];
}

// --- API Function for Deletion ---
const deletePatient = async (patientId: string) => {
  return await customFetch(`/patients/${patientId}`, {
    method: 'DELETE',
  });
};

export default function PatientsTable({ patients }: PatientsTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);

  const { mutate: triggerDelete, isPending } = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      toast.success('Paciente eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: handleApiError,
  });

  const handleEdit = (patientId: string) => {
    router.push(`/account/patients/${patientId}/edit`);
  };

  const handleOpenConfirm = (patientId: string) => {
    setSelectedPatientId(patientId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedPatientId(null);
  };

  const handleDelete = () => {
    if (selectedPatientId) {
      triggerDelete(selectedPatientId, {
        onSettled: () => handleCloseConfirm(),
      });
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow
                key={patient.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {patient.first_name}
                </TableCell>
                <TableCell>{patient.last_name}</TableCell>
                <TableCell>{patient.contact_info?.email || 'N/A'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Ver Detalles">
                    <IconButton onClick={() => alert(`Ver ${patient.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleEdit(patient.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => handleOpenConfirm(patient.id)} disabled={isPending}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar a este paciente? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" disabled={isPending}>
            {isPending ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
