'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  Woman as WomanIcon,
  Man as ManIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { usePatientStore, Patient } from '@/stores/patientStore';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAppStore } from '@/store/appStore';

export default function PatientsPage() {
  const router = useRouter();
  const t = useTranslations('Dashboard.patients');
  const locale = useLocale();
  const { setCurrentDashboardSection } = useAppStore();
  
  // Configurar el idioma de dayjs según el locale actual
  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  // Establecer la sección actual del dashboard
  useEffect(() => {
    setCurrentDashboardSection('patients');
  }, [setCurrentDashboardSection]);

  const {
    patients,
    selectedPatient,
    isEditDialogOpen,
    isDeleteDialogOpen,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    updatePatient,
    deletePatient,
    searchPatients,
    getTotalPatients,
    getGenderDistribution,
  } = usePatientStore();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatientForMenu, setSelectedPatientForMenu] = useState<Patient | null>(null);
  const [editForm, setEditForm] = useState<Partial<Patient>>({});

  // Filtered patients
  const filteredPatients = useMemo(() => {
    let filtered = patients;
    
    if (searchQuery) {
      filtered = searchPatients(searchQuery);
    }
    
    if (selectedLetter && selectedLetter !== '#') {
      filtered = filtered.filter(patient => 
        patient.last_name.toLowerCase().startsWith(selectedLetter.toLowerCase())
      );
    }
    
    return filtered;
  }, [patients, searchQuery, selectedLetter, searchPatients]);

  // Statistics
  const totalPatients = getTotalPatients();
  const genderDistribution = getGenderDistribution();

  // Alphabetical filter
  const alphabet = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // Helper functions
  const calculateAge = (dateOfBirth: string) => {
    return dayjs().diff(dayjs(dateOfBirth), 'year');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getLastConsultation = (patient: Patient) => {
    // Mock data - in real app this would come from appointments
    const mockDates = [
      '2025-08-08',
      '2025-04-08', 
      '2025-08-12',
      '2025-07-10'
    ];
    const randomDate = mockDates[Math.floor(Math.random() * mockDates.length)];
    return dayjs(randomDate).format('D MMM, YYYY');
  };

  const getNextConsultation = (patient: Patient) => {
    // Mock data - in real app this would come from appointments
    return null; // No upcoming appointments for now
  };

  const hasActiveConsultation = (patient: Patient) => {
    // Mock logic - in real app this would check if patient has active consultation
    return Math.random() > 0.5;
  };

  // Event handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? '' : letter);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, patient: Patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatientForMenu(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatientForMenu(null);
  };

  const handleEditClick = (patient: Patient) => {
    setEditForm(patient);
    openEditDialog(patient);
    handleMenuClose();
  };

  const handleDeleteClick = (patient: Patient) => {
    openDeleteDialog(patient);
    handleMenuClose();
  };

  const handleConsultationClick = (patient: Patient) => {
    router.push(`/account/consultation?patientId=${patient.id}`);
  };

  const handleSaveEdit = () => {
    if (selectedPatient) {
      updatePatient(selectedPatient.id, editForm);
      closeEditDialog();
      setEditForm({});
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPatient) {
      deletePatient(selectedPatient.id);
      closeDeleteDialog();
    }
  };

  const handleAddPatient = () => {
    // TODO: Implement add patient functionality
    console.log('Add patient clicked');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {t('title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPatient}
            sx={{ 
              backgroundColor: 'orange.main',
              '&:hover': { backgroundColor: 'orange.dark' }
            }}
          >
            {t('addPatient')}
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <GroupIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {totalPatients}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('totalPatients')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <WomanIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {genderDistribution.femalePercentage}{t('womenPercentage')}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {genderDistribution.malePercentage}{t('menPercentage')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          {/* Alphabetical Filter */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {alphabet.map((letter) => (
              <Chip
                key={letter}
                label={letter}
                onClick={() => handleLetterClick(letter)}
                variant={selectedLetter === letter ? 'filled' : 'outlined'}
                color={selectedLetter === letter ? 'primary' : 'default'}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Paper>

        {/* Patients Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'orange.main' }}>{t('tableHeaders.patient')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'orange.main' }}>{t('tableHeaders.age')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'orange.main' }}>{t('tableHeaders.gender')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'orange.main' }}>{t('tableHeaders.phone')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'orange.main' }}>{t('tableHeaders.lastConsultation')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'orange.main' }}>{t('tableHeaders.nextConsultation')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'orange.main' }}>{t('tableHeaders.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} sx={{ '&:hover': { backgroundColor: 'grey.50' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getInitials(patient.first_name, patient.last_name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                            {patient.last_name}, {patient.first_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {patient.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {calculateAge(patient.date_of_birth)} {t('age')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {patient.gender === 'male' ? (
                        <MaleIcon color="primary" />
                      ) : (
                        <FemaleIcon color="secondary" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {patient.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getLastConsultation(patient)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {getNextConsultation(patient) || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleConsultationClick(patient)}
                          sx={{ 
                            backgroundColor: 'orange.main',
                            '&:hover': { backgroundColor: 'orange.dark' }
                          }}
                        >
                          {hasActiveConsultation(patient) ? t('continueConsultation') : t('startConsultation')}
                        </Button>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, patient)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Edit Patient Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onClose={closeEditDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EditIcon sx={{ color: 'orange.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {t('editPatient')}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('form.firstName')}
                    value={editForm.first_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('form.lastName')}
                    value={editForm.last_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label={t('form.dateOfBirth')}
                    value={editForm.date_of_birth ? dayjs(editForm.date_of_birth) : null}
                    onChange={(date) => setEditForm({ 
                      ...editForm, 
                      date_of_birth: date ? date.format('YYYY-MM-DD') : '' 
                    })}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">{t('form.gender')}</FormLabel>
                    <RadioGroup
                      row
                      value={editForm.gender || ''}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as 'male' | 'female' })}
                    >
                      <FormControlLabel value="male" control={<Radio />} label={t('form.male')} />
                      <FormControlLabel value="female" control={<Radio />} label={t('form.female')} />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('form.email')}
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('form.phone')}
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('form.notes')}
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditDialog} sx={{ color: 'orange.main' }}>
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              variant="contained"
              sx={{ backgroundColor: 'orange.main', '&:hover': { backgroundColor: 'orange.dark' } }}
            >
              {t('save')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isDeleteDialogOpen}
          onClose={closeDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t('confirmDelete')}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography>
              {t('confirmDeleteMessage')}{' '}
              <strong>{selectedPatient?.first_name} {selectedPatient?.last_name}</strong>?
              {t('confirmDeleteWarning')}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              color="error" 
              variant="contained"
            >
              {t('delete')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Patient Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => selectedPatientForMenu && handleEditClick(selectedPatientForMenu)}>
            <EditIcon sx={{ mr: 1 }} />
            {t('editPatient')}
          </MenuItem>
          <MenuItem onClick={() => selectedPatientForMenu && handleDeleteClick(selectedPatientForMenu)}>
            <DeleteIcon sx={{ mr: 1 }} />
            {t('deletePatient')}
          </MenuItem>
        </Menu>
      </Container>
    </LocalizationProvider>
  );
}
