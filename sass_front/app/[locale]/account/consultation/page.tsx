'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  TextField,
  Tabs,
  Tab,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Person as PersonIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  LocalHospital as HospitalIcon,
  Medication as MedicationIcon,
  Science as ScienceIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import { usePatientStore } from '@/stores/patientStore';
import { useConsultationStore } from '@/stores/consultationStore';
import dayjs from 'dayjs';
import { useTranslations, useLocale } from 'next-intl';
import { useAppStore } from '@/store/appStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`consultation-tabpanel-${index}`}
      aria-labelledby={`consultation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ConsultationPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  const t = useTranslations('Dashboard.consultation');
  const locale = useLocale();
  const { setCurrentDashboardSection } = useAppStore();
  
  // Configurar el idioma de dayjs según el locale actual
  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  // Establecer la sección actual del dashboard
  useEffect(() => {
    setCurrentDashboardSection('consultations');
  }, [setCurrentDashboardSection]);
  
  const { getPatientById } = usePatientStore();
  const {
    currentConsultation,
    medicalHistory,
    activeTab,
    setActiveTab,
    updateConsultation,
    updateMedicalHistory,
    completeConsultation,
  } = useConsultationStore();

  const [tabValue, setTabValue] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const patient = patientId ? getPatientById(patientId) : null;

  useEffect(() => {
    if (patient) {
      // Initialize consultation if needed
      console.log('Patient loaded:', patient);
    }
  }, [patient]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const tabs = ['ficha', 'historia_clinica', 'consulta', 'historial', 'estudios'];
    setActiveTab(tabs[newValue] as any);
  };

  const calculateAge = (dateOfBirth: string) => {
    return dayjs().diff(dayjs(dateOfBirth), 'year');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleFinishConsultation = () => {
    if (currentConsultation) {
      completeConsultation(currentConsultation.id);
    }
  };

  // Helper function to get condition name
  const getConditionName = (key: string) => {
    return t(`medicalHistory.conditions.${key}`) || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!patient) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h5" color="error">
          {t('patientNotFound')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Patient Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
              {getInitials(patient.first_name, patient.last_name)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {patient.first_name} {patient.last_name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {patient.gender === 'male' ? <MaleIcon color="primary" /> : <FemaleIcon color="secondary" />}
                <Typography variant="body2">
                  {patient.gender === 'male' ? t('patients.form.male') : t('patients.form.female')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="action" />
                <Typography variant="body2">
                  {calculateAge(patient.date_of_birth)} {t('patients.age')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon color="action" />
                <Typography variant="body2">
                  {dayjs(patient.date_of_birth).format('D MMM, YYYY')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="action" />
                <Typography variant="body2">
                  {patient.phone}
                </Typography>
              </Box>
            </Box>
            <Typography 
              variant="body2" 
              color="primary.main" 
              sx={{ cursor: 'pointer', mt: 1 }}
              onClick={() => setIsEditMode(true)}
            >
              {t('editInfo')}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="text.secondary">
              Nro. {patient.id.padStart(6, '0')}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="consultation tabs">
            <Tab label={t('tabs.file')} />
            <Tab label={t('tabs.medicalHistory')} />
            <Tab label={t('tabs.consultation')} />
            <Tab label={t('tabs.history')} />
            <Tab label={t('tabs.studies')} />
          </Tabs>
        </Box>
      </Paper>

      {/* Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<CheckCircleIcon />}
          onClick={handleFinishConsultation}
          sx={{ 
            backgroundColor: 'orange.main',
            '&:hover': { backgroundColor: 'orange.dark' }
          }}
        >
          {t('finishConsultation')}
        </Button>
      </Box>

      {/* Tab Content */}
      <TabPanel value={tabValue} index={0}>
        {/* Ficha Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('patientInfo.personalInfo')}
                  </Typography>
                  <IconButton size="small" sx={{ ml: 'auto' }}>
                    <EditIcon />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.address')}
                      value={patient.address || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.birthState')}
                      value={patient.place_of_birth || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.nationality')}
                      value={patient.nationality || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.birthCity')}
                      value={patient.city_of_birth || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.relationship')}
                      value={patient.relationship || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.bloodType')}
                      value={patient.blood_type || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.education')}
                      value={patient.education_level || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.profession')}
                      value={patient.profession || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.religion')}
                      value={patient.religion || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.maritalStatus')}
                      value={patient.marital_status || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.phone')}
                      value={patient.phone || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.email')}
                      value={patient.email || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PhoneIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('patientInfo.emergencyContact')}
                  </Typography>
                  <IconButton size="small" sx={{ ml: 'auto' }}>
                    <EditIcon />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.fullName')}
                      value={patient.emergency_contact?.name || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.relationship')}
                      value={patient.emergency_contact?.relationship || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.phone')}
                      value={patient.emergency_contact?.phone || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.email')}
                      value={patient.emergency_contact?.email || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AssignmentIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t('patientInfo.billingInfo')}
                  </Typography>
                  <IconButton size="small" sx={{ ml: 'auto' }}>
                    <EditIcon />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.fullName')}
                      value={patient.billing_info?.name || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.address')}
                      value={patient.billing_info?.address || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.taxRegime')}
                      value={patient.billing_info?.tax_regime || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.cfdiUse')}
                      value={patient.billing_info?.cfdi_use || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('patientInfo.fields.rfc')}
                      value={patient.billing_info?.rfc || ''}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {t('patientInfo.notes')}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={patient.notes || ''}
                  variant="outlined"
                  placeholder={t('patientInfo.notesPlaceholder')}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Historia Clínica Tab */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {t('medicalHistory.hereditaryFamily')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {Object.entries(medicalHistory?.hereditary_family || {}).map(([key, value]) => (
                    <Grid item xs={12} md={6} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <FormControl component="fieldset">
                          <RadioGroup row value={value.has ? 'yes' : 'no'}>
                            <FormControlLabel value="yes" control={<Radio />} label={t('medicalHistory.yes')} />
                            <FormControlLabel value="no" control={<Radio />} label={t('medicalHistory.no')} />
                          </RadioGroup>
                        </FormControl>
                        <Typography variant="body2" sx={{ minWidth: 120 }}>
                          {getConditionName(key)}
                        </Typography>
                      </Box>
                      {value.has && (
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder={t('medicalHistory.details')}
                          value={value.details || ''}
                          size="small"
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {t('medicalHistory.nonPathological')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {Object.entries(medicalHistory?.non_pathological || {}).map(([key, value]) => (
                    <Grid item xs={12} md={6} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <FormControl component="fieldset">
                          <RadioGroup row value={value.has ? 'yes' : 'no'}>
                            <FormControlLabel value="yes" control={<Radio />} label={t('medicalHistory.yes')} />
                            <FormControlLabel value="no" control={<Radio />} label={t('medicalHistory.no')} />
                          </RadioGroup>
                        </FormControl>
                        <Typography variant="body2" sx={{ minWidth: 120 }}>
                          {getConditionName(key)}
                        </Typography>
                      </Box>
                      {value.has && (
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder={t('medicalHistory.details')}
                          value={value.details || ''}
                          size="small"
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {t('medicalHistory.pathological')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {Object.entries(medicalHistory?.pathological || {}).map(([key, value]) => (
                    <Grid item xs={12} md={6} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <FormControl component="fieldset">
                          <RadioGroup row value={value.has ? 'yes' : 'no'}>
                            <FormControlLabel value="yes" control={<Radio />} label={t('medicalHistory.yes')} />
                            <FormControlLabel value="no" control={<Radio />} label={t('medicalHistory.no')} />
                          </RadioGroup>
                        </FormControl>
                        <Typography variant="body2" sx={{ minWidth: 120 }}>
                          {getConditionName(key)}
                        </Typography>
                      </Box>
                      {value.has && (
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder={t('medicalHistory.details')}
                          value={value.details || ''}
                          size="small"
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {t('medicalHistory.systemsInterrogation')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {Object.entries(medicalHistory?.systems_interrogation || {}).map(([key, value]) => (
                    <Grid item xs={12} md={6} key={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <FormControl component="fieldset">
                          <RadioGroup row value={value.has ? 'yes' : 'no'}>
                            <FormControlLabel value="yes" control={<Radio />} label={t('medicalHistory.yes')} />
                            <FormControlLabel value="no" control={<Radio />} label={t('medicalHistory.no')} />
                          </RadioGroup>
                        </FormControl>
                        <Typography variant="body2" sx={{ minWidth: 120 }}>
                          {getConditionName(key)}
                        </Typography>
                      </Box>
                      {value.has && (
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder={t('medicalHistory.details')}
                          value={value.details || ''}
                          size="small"
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Consulta Tab */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t('inDevelopment.consultation')}
        </Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Historial Tab */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t('inDevelopment.history')}
        </Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        {/* Estudios Tab */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          {t('inDevelopment.studies')}
        </Typography>
      </TabPanel>
    </Container>
  );
}
