'use client';
import { Box, Typography, Grid, Paper, TextField, Button, Chip, IconButton, Divider } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PatientHeader from '@/components/ui/Dashboard/PatientHeader';

export default function ConsultationPage() {
  const [vitalSigns, setVitalSigns] = useState({
    height: '1.73 m',
    weight: '105 kg',
    temperature: '37 c',
    bloodPressure: '130/80 (mm/Hg)',
    oxygenSaturation: '98%',
    heartRate: '85 bpm'
  });

  const [consultationNotes, setConsultationNotes] = useState('');
  const [systemInterrogation, setSystemInterrogation] = useState('');
  const [physicalExam, setPhysicalExam] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prognosis, setPrognosis] = useState('');
  const [plan, setPlan] = useState('');
  const [studies, setStudies] = useState<Array<{id: string, study: string, indications: string}>>([]);
  const [prescriptions, setPrescriptions] = useState<Array<{id: string, medication: string, quantity: string, frequency: string, duration: string, notes: string}>>([]);
  const [allergies, setAllergies] = useState<Array<{id: string, allergy: string}>>([]);

  const addStudy = () => {
    setStudies([...studies, { id: Date.now().toString(), study: '', indications: '' }]);
  };

  const removeStudy = (id: string) => {
    setStudies(studies.filter(s => s.id !== id));
  };

  const updateStudy = (id: string, field: string, value: string) => {
    setStudies(studies.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { 
      id: Date.now().toString(), 
      medication: '', 
      quantity: '', 
      frequency: '', 
      duration: '', 
      notes: '' 
    }]);
  };

  const removePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const updatePrescription = (id: string, field: string, value: string) => {
    setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addAllergy = () => {
    setAllergies([...allergies, { id: Date.now().toString(), allergy: '' }]);
  };

  const removeAllergy = (id: string) => {
    setAllergies(allergies.filter(a => a.id !== id));
  };

  const updateAllergy = (id: string, value: string) => {
    setAllergies(allergies.map(a => a.id === id ? { ...a, allergy: value } : a));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Patient Header */}
      <PatientHeader
        patientName="Robert Antonio Escalona Montilla"
        gender="male"
        age="0 meses"
        phone="04161153577"
        email="montillayomy@gmail.com"
        patientId="000228"
      />

      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
        Consulta Médica
      </Typography>

      <Grid container spacing={3}>
        {/* Signos Vitales */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Signos Vitales
              </Typography>
              <IconButton size="small" sx={{ color: 'primary.main' }}>
                <EditIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Talla</Typography>
                <Typography variant="body1">{vitalSigns.height}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Peso</Typography>
                <Typography variant="body1">{vitalSigns.weight}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Temperatura</Typography>
                <Typography variant="body1">{vitalSigns.temperature}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Tensión Arterial</Typography>
                <Typography variant="body1">{vitalSigns.bloodPressure}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Saturación O₂</Typography>
                <Typography variant="body1">{vitalSigns.oxygenSaturation}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Frecuencia Cardíaca</Typography>
                <Typography variant="body1">{vitalSigns.heartRate}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Motivo de la consulta */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Motivo de la consulta
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              placeholder="Describa el motivo de la consulta..."
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Interrogatorio por aparatos y sistemas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Interrogatorio por aparatos y sistemas
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={systemInterrogation}
              onChange={(e) => setSystemInterrogation(e.target.value)}
              placeholder="Describa el interrogatorio por aparatos y sistemas..."
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Examen físico */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Examen físico
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={physicalExam}
              onChange={(e) => setPhysicalExam(e.target.value)}
              placeholder="Describa el examen físico..."
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Diagnóstico */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Diagnóstico
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Agregar diagnóstico..."
              variant="outlined"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Puedes seleccionar el diagnóstico del Catálogo Internacional de Enfermedades (CIE-11)
            </Typography>
          </Paper>
        </Grid>

        {/* Pronóstico */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Pronóstico
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={prognosis}
              onChange={(e) => setPrognosis(e.target.value)}
              placeholder="Describa el pronóstico..."
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Plan */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Plan
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="Describa el plan de tratamiento..."
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Solicitar estudios */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Solicitar estudios
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addStudy}
                variant="outlined"
                color="primary"
              >
                Agregar estudio
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ingresa la siguiente información para solicitar un estudio
            </Typography>
            
            {studies.map((study) => (
              <Box key={study.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Estudio a solicitar</Typography>
                  <IconButton size="small" onClick={() => removeStudy(study.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  value={study.study}
                  onChange={(e) => updateStudy(study.id, 'study', e.target.value)}
                  placeholder="Ej: Rx de mano izquierda"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={study.indications}
                  onChange={(e) => updateStudy(study.id, 'indications', e.target.value)}
                  placeholder="Escribe indicaciones a considerar"
                  variant="outlined"
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Receta */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Receta
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addPrescription}
                variant="outlined"
                color="primary"
              >
                Agregar medicamento
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ingresa la siguiente información para recetar un medicamento
            </Typography>
            
            {prescriptions.map((prescription) => (
              <Box key={prescription.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Medicación</Typography>
                  <IconButton size="small" onClick={() => removePrescription(prescription.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      value={prescription.medication}
                      onChange={(e) => updatePrescription(prescription.id, 'medication', e.target.value)}
                      placeholder="Medicación"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      value={prescription.quantity}
                      onChange={(e) => updatePrescription(prescription.id, 'quantity', e.target.value)}
                      placeholder="Cantidad"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      value={prescription.frequency}
                      onChange={(e) => updatePrescription(prescription.id, 'frequency', e.target.value)}
                      placeholder="Frecuencia"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      value={prescription.duration}
                      onChange={(e) => updatePrescription(prescription.id, 'duration', e.target.value)}
                      placeholder="Duración"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={prescription.notes}
                      onChange={(e) => updatePrescription(prescription.id, 'notes', e.target.value)}
                      placeholder="Agregar notas..."
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Alergias */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Alergias
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addAllergy}
                variant="outlined"
                color="primary"
              >
                Agregar alergia
              </Button>
            </Box>
            
            {allergies.length === 0 ? (
              <Chip label="No padece de alergias" color="success" />
            ) : (
              <Box>
                {allergies.map((allergy) => (
                  <Box key={allergy.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      value={allergy.allergy}
                      onChange={(e) => updateAllergy(allergy.id, e.target.value)}
                      placeholder="Describa la alergia"
                      variant="outlined"
                      size="small"
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <IconButton size="small" onClick={() => removeAllergy(allergy.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Botones de acción */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" color="primary">
          Guardar borrador
        </Button>
        <Button variant="contained" color="primary">
          Finalizar consulta
        </Button>
      </Box>
    </Box>
  );
}
