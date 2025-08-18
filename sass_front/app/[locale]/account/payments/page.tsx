'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  MonetizationOn as MonetizationOnIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

interface Payment {
  id: string;
  patientName: string;
  patientId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash' | 'insurance';
  date: string;
  description: string;
  invoiceNumber: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_account';
  name: string;
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    patientName: 'María González',
    patientId: 'P001',
    amount: 150.00,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'credit_card',
    date: '2024-01-15',
    description: 'Consulta médica general',
    invoiceNumber: 'INV-2024-001'
  },
  {
    id: '2',
    patientName: 'Juan Pérez',
    patientId: 'P002',
    amount: 200.00,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'insurance',
    date: '2024-01-14',
    description: 'Examen de laboratorio',
    invoiceNumber: 'INV-2024-002'
  },
  {
    id: '3',
    patientName: 'Ana López',
    patientId: 'P003',
    amount: 75.00,
    currency: 'USD',
    status: 'failed',
    paymentMethod: 'bank_transfer',
    date: '2024-01-13',
    description: 'Consulta de seguimiento',
    invoiceNumber: 'INV-2024-003'
  },
  {
    id: '4',
    patientName: 'Carlos Rodríguez',
    patientId: 'P004',
    amount: 300.00,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'cash',
    date: '2024-01-12',
    description: 'Procedimiento médico',
    invoiceNumber: 'INV-2024-004'
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'credit_card',
    name: 'Visa ending in 4242',
    last4: '4242',
    brand: 'visa',
    isDefault: true
  },
  {
    id: '2',
    type: 'credit_card',
    name: 'Mastercard ending in 5555',
    last4: '5555',
    brand: 'mastercard',
    isDefault: false
  },
  {
    id: '3',
    type: 'bank_account',
    name: 'Bank of America',
    last4: '1234',
    isDefault: false
  }
];

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(mockPayments);
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isPaymentDetailDialogOpen, setIsPaymentDetailDialogOpen] = useState(false);
  const [isAddPaymentMethodDialogOpen, setIsAddPaymentMethodDialogOpen] = useState(false);
  const [isNewPaymentDialogOpen, setIsNewPaymentDialogOpen] = useState(false);

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsPaymentDetailDialogOpen(true);
  };

  const handleAddPaymentMethod = () => {
    setIsAddPaymentMethodDialogOpen(true);
  };

  const handleNewPayment = () => {
    setIsNewPaymentDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'pending':
        return <PendingIcon />;
      case 'failed':
        return <ErrorIcon />;
      case 'refunded':
        return <ReceiptIcon />;
      default:
        return <PaymentIcon />;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Tarjeta de Crédito';
      case 'bank_transfer':
        return 'Transferencia Bancaria';
      case 'cash':
        return 'Efectivo';
      case 'insurance':
        return 'Seguro Médico';
      default:
        return method;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCardIcon />;
      case 'bank_transfer':
        return <BankIcon />;
      case 'cash':
        return <MonetizationOnIcon />;
      case 'insurance':
        return <ReceiptIcon />;
      default:
        return <PaymentIcon />;
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const failedPayments = payments.filter(p => p.status === 'failed');

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Gestión de Pagos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddPaymentMethod}
            sx={{ borderRadius: 2 }}
          >
            Método de Pago
          </Button>
          <Button
            variant="contained"
            startIcon={<PaymentIcon />}
            onClick={handleNewPayment}
            sx={{ borderRadius: 2 }}
          >
            Nuevo Pago
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'success.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MonetizationOnIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ${totalRevenue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Ingresos Totales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'primary.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PaymentIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {payments.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Transacciones Totales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'warning.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PendingIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {pendingPayments.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pagos Pendientes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'error.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ErrorIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {failedPayments.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Pagos Fallidos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Payment Methods */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Métodos de Pago
              </Typography>
              <IconButton size="small" onClick={handleAddPaymentMethod}>
                <AddIcon />
              </IconButton>
            </Box>
            <List>
              {paymentMethods.map((method, index) => (
                <React.Fragment key={method.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {method.name}
                          </Typography>
                          {method.isDefault && (
                            <Chip label="Predeterminado" size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {method.type === 'credit_card' ? 'Tarjeta de Crédito' : 'Cuenta Bancaria'}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" sx={{ color: 'info.main' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'error.main' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < paymentMethods.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Payments */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Pagos Recientes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Paciente</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Método</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {payment.patientName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payment.invoiceNumber}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          ${payment.amount.toFixed(2)} {payment.currency}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <Typography variant="body2">
                            {getPaymentMethodText(payment.paymentMethod)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(payment.status)}
                          label={getStatusText(payment.status)}
                          color={getStatusColor(payment.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(payment.date).toLocaleDateString('es-ES')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewPayment(payment)}
                            sx={{ color: 'primary.main' }}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" sx={{ color: 'success.main' }}>
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Payment Detail Dialog */}
      <Dialog 
        open={isPaymentDetailDialogOpen} 
        onClose={() => setIsPaymentDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PaymentIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Detalle del Pago
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Información del Paciente
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Nombre:</strong> {selectedPayment.patientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>ID:</strong> {selectedPayment.patientId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Factura:</strong> {selectedPayment.invoiceNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Información del Pago
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    ${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedPayment.status)}
                    label={getStatusText(selectedPayment.status)}
                    color={getStatusColor(selectedPayment.status) as any}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Fecha:</strong> {new Date(selectedPayment.date).toLocaleDateString('es-ES')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Método de Pago
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                    <Typography variant="body2">
                      {getPaymentMethodText(selectedPayment.paymentMethod)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Descripción
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPayment.description}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPaymentDetailDialogOpen(false)}>Cerrar</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Descargar Recibo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog 
        open={isAddPaymentMethodDialogOpen} 
        onClose={() => setIsAddPaymentMethodDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Agregar Método de Pago
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de Método</InputLabel>
              <Select label="Tipo de Método">
                <MenuItem value="credit_card">Tarjeta de Crédito</MenuItem>
                <MenuItem value="bank_account">Cuenta Bancaria</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Número de Tarjeta"
              placeholder="1234 5678 9012 3456"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Fecha de Vencimiento"
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  placeholder="123"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddPaymentMethodDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Payment Dialog */}
      <Dialog 
        open={isNewPaymentDialogOpen} 
        onClose={() => setIsNewPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Nuevo Pago
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Paciente</InputLabel>
              <Select label="Paciente">
                <MenuItem value="P001">María González (P001)</MenuItem>
                <MenuItem value="P002">Juan Pérez (P002)</MenuItem>
                <MenuItem value="P003">Ana López (P003)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Monto"
              type="number"
              placeholder="0.00"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Método de Pago</InputLabel>
              <Select label="Método de Pago">
                <MenuItem value="credit_card">Tarjeta de Crédito</MenuItem>
                <MenuItem value="bank_transfer">Transferencia Bancaria</MenuItem>
                <MenuItem value="cash">Efectivo</MenuItem>
                <MenuItem value="insurance">Seguro Médico</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              placeholder="Descripción del pago..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewPaymentDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained">
            Procesar Pago
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
