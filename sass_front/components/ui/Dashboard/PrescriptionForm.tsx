'use client';
import { useState } from 'react';
import {
  Box, Stepper, Step, StepLabel, Button, Typography, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, TextField, IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useTranslations } from 'next-intl';

// --- Mock Data ---
const mockPatients = [
  { id: '1', name: 'Juan Pérez' },
  { id: '2', name: 'Ana Gómez' },
];

// --- Step Components ---

function SelectPatientStep({ onSelect }: { onSelect: (id: string) => void }) {
  const t = useTranslations('Dashboard.prescriptions');
  
  return (
    <FormControl fullWidth sx={{ mt: 3 }}>
      <InputLabel>{t('newPrescriptionForm.selectPatient')}</InputLabel>
      <Select label={t('newPrescriptionForm.selectPatient')} onChange={(e) => onSelect(e.target.value)}>
        {mockPatients.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

function AddMedicationsStep() {
  const t = useTranslations('Dashboard.prescriptions');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '' }]);

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const handleRemoveMedication = (index: number) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  return (
    <Box sx={{ mt: 3 }}>
      {medications.map((med, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField label={t('medication.name')} fullWidth />
          <TextField label={t('medication.dosage')} />
          <TextField label={t('medication.frequency')} />
          <IconButton onClick={() => handleRemoveMedication(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddMedication}>
        {t('newPrescriptionForm.addMedications')}
      </Button>
    </Box>
  );
}

function ReviewStep() {
  const t = useTranslations('Dashboard.prescriptions');
  
  return (
    <Box sx={{ mt: 3, p: 2, border: '1px dashed grey' }}>
      <Typography variant="h6">{t('newPrescriptionForm.steps.review')}</Typography>
      <Typography><strong>{t('prescription.name')}:</strong> Juan Pérez</Typography>
      <Typography><strong>{t('prescription.medications')}:</strong></Typography>
      <Typography component="div">
        <ul>
          <li>Paracetamol 500mg - cada 8 horas</li>
        </ul>
      </Typography>
    </Box>
  );
}


export default function PrescriptionForm() {
  const t = useTranslations('Dashboard.prescriptions');
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    t('newPrescriptionForm.steps.patientInfo'),
    t('newPrescriptionForm.addMedications'),
    t('newPrescriptionForm.steps.review')
  ];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <SelectPatientStep onSelect={() => {}} />;
      case 1:
        return <AddMedicationsStep />;
      case 2:
        return <ReviewStep />;
      default:
        return 'Paso desconocido';
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 3 }}>
        {getStepContent(activeStep)}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        {activeStep > 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            {t('actions.back')}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          {activeStep === steps.length - 1 ? t('actions.createPrescription') : t('actions.next')}
        </Button>
      </Box>
    </Box>
  );
}
