'use client';
import { useState } from 'react';
import {
  Box, Stepper, Step, StepLabel, Button, Typography, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, TextField, IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const steps = ['Seleccionar Paciente', 'Añadir Medicamentos', 'Revisar y Confirmar'];

// --- Mock Data ---
const mockPatients = [
  { id: '1', name: 'Juan Pérez' },
  { id: '2', name: 'Ana Gómez' },
];

// --- Step Components ---

function SelectPatientStep({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <FormControl fullWidth sx={{ mt: 3 }}>
      <InputLabel>Paciente</InputLabel>
      <Select label="Paciente" onChange={(e) => onSelect(e.target.value)}>
        {mockPatients.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

function AddMedicationsStep() {
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
          <TextField label="Medicamento" fullWidth />
          <TextField label="Dosis" />
          <TextField label="Frecuencia" />
          <IconButton onClick={() => handleRemoveMedication(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddMedication}>
        Añadir Medicamento
      </Button>
    </Box>
  );
}

function ReviewStep() {
  return (
    <Box sx={{ mt: 3, p: 2, border: '1px dashed grey' }}>
      <Typography variant="h6">Resumen de la Receta</Typography>
      <Typography><strong>Paciente:</strong> Juan Pérez</Typography>
      <Typography><strong>Medicamentos:</strong></Typography>
      <Typography component="div">
        <ul>
          <li>Paracetamol 500mg - cada 8 horas</li>
        </ul>
      </Typography>
    </Box>
  );
}


export default function PrescriptionForm() {
  const [activeStep, setActiveStep] = useState(0);

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
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Receta creada exitosamente.
          </Typography>
        </>
      ) : (
        <>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Atrás
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
