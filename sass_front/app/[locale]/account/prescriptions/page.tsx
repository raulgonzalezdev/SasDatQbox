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
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Medication as MedicationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocalPharmacy as PharmacyIcon
} from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import { useAppStore } from '@/store/appStore';

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  medications: Medication[];
  status: 'active' | 'completed' | 'expired';
  notes: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientName: 'María González',
    patientId: 'P001',
    doctorName: 'Dr. Carlos Rodríguez',
    date: '2024-01-15',
    status: 'active',
    notes: 'Tomar con las comidas',
    medications: [
      {
        id: '1',
        name: 'Ibuprofeno',
        dosage: '400mg',
        frequency: 'Cada 8 horas',
        duration: '7 días',
        instructions: 'Tomar con las comidas'
      },
      {
        id: '2',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Cada 6 horas',
        duration: '5 días',
        instructions: 'Para el dolor de cabeza'
      }
    ]
  },
  {
    id: '2',
    patientName: 'Juan Pérez',
    patientId: 'P002',
    doctorName: 'Dr. Ana Martínez',
    date: '2024-01-10',
    status: 'completed',
    notes: 'Tratamiento completado',
    medications: [
      {
        id: '3',
        name: 'Amoxicilina',
        dosage: '500mg',
        frequency: 'Cada 12 horas',
        duration: '10 días',
        instructions: 'Tomar con el estómago vacío'
      }
    ]
  }
];

export default function PrescriptionsPage() {
  const t = useTranslations('Dashboard.prescriptions');
  const locale = useLocale();
  const { setCurrentDashboardSection } = useAppStore();
  
  // Establecer la sección actual del dashboard
  useEffect(() => {
    setCurrentDashboardSection('prescriptions');
  }, [setCurrentDashboardSection]);

  const [prescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewPrescriptionDialogOpen, setIsNewPrescriptionDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    medications: [] as Medication[],
    notes: ''
  });

  const steps = [
    t('newPrescriptionForm.steps.patientInfo'),
    t('newPrescriptionForm.steps.medications'),
    t('newPrescriptionForm.steps.instructions'),
    t('newPrescriptionForm.steps.review')
  ];

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDialogOpen(true);
  };

  const handleNewPrescription = () => {
    setIsNewPrescriptionDialogOpen(true);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCreatePrescription = () => {
    // Mock creation logic
    console.log('Creating prescription:', newPrescription);
    setIsNewPrescriptionDialogOpen(false);
    setActiveStep(0);
    setNewPrescription({ patientId: '', medications: [], notes: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('status.active');
      case 'completed':
        return t('status.completed');
      case 'expired':
        return t('status.expired');
      default:
        return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          {t('title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewPrescription}
          sx={{ borderRadius: 2 }}
        >
          {t('newPrescription')}
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'primary.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {prescriptions.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t('stats.totalPrescriptions')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'success.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {prescriptions.filter(p => p.status === 'active').length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t('stats.activePrescriptions')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            backgroundColor: 'info.main', 
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {prescriptions.filter(p => p.status === 'completed').length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t('stats.completedPrescriptions')}
              </Typography>
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
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {prescriptions.reduce((acc, p) => acc + p.medications.length, 0)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {t('stats.prescribedMedications')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Prescriptions List */}
      <Paper sx={{ overflow: 'auto' }}>
        <List>
          {prescriptions.map((prescription, index) => (
            <React.Fragment key={prescription.id}>
              <ListItem sx={{ py: 2 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {prescription.patientName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('prescription.id')}: {prescription.patientId} • {prescription.doctorName}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {new Date(prescription.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusText(prescription.status)}
                        color={getStatusColor(prescription.status) as any}
                        size="small"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MedicationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {prescription.medications.length} {t('prescription.medicationCount')}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewPrescription(prescription)}
                      sx={{ color: 'primary.main' }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'info.main' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'success.main' }}>
                      <PrintIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: 'error.main' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
              {index < prescriptions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* View Prescription Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MedicationIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('prescription.title')} - {selectedPrescription?.patientName}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {t('prescription.patientInfo')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('prescription.name')}:</strong> {selectedPrescription.patientName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('prescription.id')}:</strong> {selectedPrescription.patientId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('prescription.doctor')}:</strong> {selectedPrescription.doctorName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('prescription.date')}:</strong> {new Date(selectedPrescription.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {t('prescription.status')}
                  </Typography>
                  <Chip
                    label={getStatusText(selectedPrescription.status)}
                    color={getStatusColor(selectedPrescription.status) as any}
                    sx={{ mb: 1 }}
                  />
                  {selectedPrescription.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {t('prescription.notes')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedPrescription.notes}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {t('prescription.medications')}
                  </Typography>
                  <List>
                    {selectedPrescription.medications.map((medication, index) => (
                      <Card key={medication.id} sx={{ mb: 2, backgroundColor: 'grey.50' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {medication.name}
                          </Typography>
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>{t('medication.dosage')}:</strong> {medication.dosage}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>{t('medication.frequency')}:</strong> {medication.frequency}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>{t('medication.duration')}:</strong> {medication.duration}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="text.secondary">
                                <strong>{t('medication.instructions')}:</strong> {medication.instructions}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>{t('actions.close')}</Button>
          <Button variant="contained" startIcon={<PrintIcon />}>
            {t('actions.print')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Prescription Dialog */}
      <Dialog 
        open={isNewPrescriptionDialogOpen} 
        onClose={() => setIsNewPrescriptionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('newPrescriptionForm.title')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t('newPrescriptionForm.steps.patientInfo')}
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>{t('newPrescriptionForm.selectPatient')}</InputLabel>
                  <Select
                    value={newPrescription.patientId}
                    onChange={(e) => setNewPrescription({...newPrescription, patientId: e.target.value})}
                    label={t('newPrescriptionForm.selectPatient')}
                  >
                    <MenuItem value="P001">María González (P001)</MenuItem>
                    <MenuItem value="P002">Juan Pérez (P002)</MenuItem>
                    <MenuItem value="P003">Ana López (P003)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t('newPrescriptionForm.steps.medications')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('newPrescriptionForm.medicationsWillBeAdded')}
                </Typography>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t('newPrescriptionForm.steps.instructions')}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t('newPrescriptionForm.additionalNotes')}
                  value={newPrescription.notes}
                  onChange={(e) => setNewPrescription({...newPrescription, notes: e.target.value})}
                />
              </Box>
            )}

            {activeStep === 3 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t('newPrescriptionForm.steps.review')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('newPrescriptionForm.reviewInfo')}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewPrescriptionDialogOpen(false)}>
            {t('actions.cancel')}
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack}>
              {t('actions.back')}
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              {t('actions.next')}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleCreatePrescription}>
              {t('actions.createPrescription')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
