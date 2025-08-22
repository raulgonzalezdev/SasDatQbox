'use client';

import React, { useState, useEffect } from 'react';
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
import { useTranslations, useLocale } from 'next-intl';
import { useAppStore } from '@/store/appStore';

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
  const t = useTranslations('Dashboard.payments');
  const locale = useLocale();
  const { setCurrentDashboardSection } = useAppStore();
  
  // Establecer la sección actual del dashboard
  useEffect(() => {
    setCurrentDashboardSection('payments');
  }, [setCurrentDashboardSection]);

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
        return t('status.completed');
      case 'pending':
        return t('status.pending');
      case 'failed':
        return t('status.failed');
      case 'refunded':
        return t('status.refunded');
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
        return t('paymentMethods.creditCard');
      case 'bank_transfer':
        return t('paymentMethods.bankTransfer');
      case 'cash':
        return t('paymentMethods.cash');
      case 'insurance':
        return t('paymentMethods.insurance');
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
          {t('title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddPaymentMethod}
            sx={{ borderRadius: 2 }}
          >
            {t('paymentMethod')}
          </Button>
          <Button
            variant="contained"
            startIcon={<PaymentIcon />}
            onClick={handleNewPayment}
            sx={{ borderRadius: 2 }}
          >
            {t('newPayment')}
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
                                     <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                     {t('stats.totalRevenue')}
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
                                     <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                     {t('stats.totalTransactions')}
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
                                     <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                     {t('stats.pendingPayments')}
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
                                     <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                     {t('stats.failedPayments')}
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
                {t('paymentMethods.title')}
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
                            <Chip label={t('paymentMethods.default')} size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {method.type === 'credit_card' ? t('paymentMethods.creditCard') : t('paymentMethods.bankAccount')}
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
              {t('recentPayments')}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('tableHeaders.patient')}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('tableHeaders.amount')}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('tableHeaders.method')}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('tableHeaders.status')}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('tableHeaders.date')}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('tableHeaders.actions')}</TableCell>
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
                          {new Date(payment.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
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
              {t('payment.detail')}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {t('payment.patientInfo')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('payment.name')}:</strong> {selectedPayment.patientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('payment.id')}:</strong> {selectedPayment.patientId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('payment.invoice')}:</strong> {selectedPayment.invoiceNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {t('payment.paymentInfo')}
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
                    <strong>{t('payment.date')}:</strong> {new Date(selectedPayment.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {t('paymentMethods.title')}
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
                    {t('payment.description')}
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
          <Button onClick={() => setIsPaymentDetailDialogOpen(false)}>{t('actions.close')}</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            {t('payment.receipt')}
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
            {t('form.addPaymentMethod')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('form.methodType')}</InputLabel>
              <Select label={t('form.methodType')}>
                <MenuItem value="credit_card">{t('paymentMethods.creditCard')}</MenuItem>
                <MenuItem value="bank_account">{t('paymentMethods.bankAccount')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={t('form.cardNumber')}
              placeholder="1234 5678 9012 3456"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('form.expiryDate')}
                  placeholder="MM/YY"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: 'grey.300',
                      },
                      '&:hover fieldset': {
                        borderColor: 'grey.400',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('form.cvv')}
                  placeholder="123"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      '& fieldset': {
                        borderColor: 'grey.300',
                      },
                      '&:hover fieldset': {
                        borderColor: 'grey.400',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddPaymentMethodDialogOpen(false)}>
            {t('actions.cancel')}
          </Button>
          <Button variant="contained">
            {t('actions.add')}
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
            {t('form.newPayment')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('form.patient')}</InputLabel>
              <Select label={t('form.patient')}>
                <MenuItem value="P001">María González (P001)</MenuItem>
                <MenuItem value="P002">Juan Pérez (P002)</MenuItem>
                <MenuItem value="P003">Ana López (P003)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={t('form.amount')}
              type="number"
              placeholder="0.00"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('form.paymentMethod')}</InputLabel>
              <Select label={t('form.paymentMethod')}>
                <MenuItem value="credit_card">{t('paymentMethods.creditCard')}</MenuItem>
                <MenuItem value="bank_transfer">{t('paymentMethods.bankTransfer')}</MenuItem>
                <MenuItem value="cash">{t('paymentMethods.cash')}</MenuItem>
                <MenuItem value="insurance">{t('paymentMethods.insurance')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('form.description')}
              placeholder={t('form.descriptionPlaceholder')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewPaymentDialogOpen(false)}>
            {t('actions.cancel')}
          </Button>
          <Button variant="contained">
            {t('actions.processPayment')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
