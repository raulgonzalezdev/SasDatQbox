'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Patient {
  first_name: string;
  last_name: string;
}

interface Appointment {
  id: string;
  patient: Patient;
  appointment_datetime: string;
  reason: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
}

const statusMap = {
  SCHEDULED: { label: 'Programada', color: 'primary' as const },
  COMPLETED: { label: 'Completada', color: 'success' as const },
  CANCELLED: { label: 'Cancelada', color: 'error' as const },
  PENDING: { label: 'Pendiente', color: 'warning' as const },
};

export default function AppointmentsTable({ appointments }: { appointments: Appointment[] }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="appointments table">
        <TableHead>
          <TableRow>
            <TableCell>Paciente</TableCell>
            <TableCell>Fecha y Hora</TableCell>
            <TableCell>Motivo</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {`${appointment.patient.first_name} ${appointment.patient.last_name}`}
                </TableCell>
                <TableCell>
                  {format(new Date(appointment.appointment_datetime), "d 'de' MMMM 'de' yyyy, h:mm a", { locale: es })}
                </TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <Chip
                    label={statusMap[appointment.status]?.label || 'Desconocido'}
                    color={statusMap[appointment.status]?.color || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography sx={{ py: 3 }}>No hay consultas programadas.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
