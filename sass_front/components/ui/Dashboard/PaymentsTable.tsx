'use client';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, Box
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Payment {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
}

const statusMap = {
  Paid: { label: 'Pagado', color: 'success' as const },
  Pending: { label: 'Pendiente', color: 'warning' as const },
  Failed: { label: 'Fallido', color: 'error' as const },
};

const mockPayments: Payment[] = [
  { id: '1', patientName: 'Carlos Ruíz', date: new Date().toISOString(), amount: 75.00, status: 'Paid' },
  { id: '2', patientName: 'Sofía Castro', date: new Date().toISOString(), amount: 120.50, status: 'Pending' },
];

export default function PaymentsTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>ID Transacción</TableCell>
            <TableCell>Paciente</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockPayments.length > 0 ? (
            mockPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">{payment.id}</Typography>
                </TableCell>
                <TableCell>{payment.patientName}</TableCell>
                <TableCell>
                  {format(new Date(payment.date), "d 'de' MMMM, yyyy", { locale: es })}
                </TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={statusMap[payment.status].label}
                    color={statusMap[payment.status].color}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography sx={{ py: 3 }}>No hay transacciones registradas.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
