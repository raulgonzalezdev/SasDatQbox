'use client';
import { Box, Typography, Avatar, Chip, Button, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

interface PatientHeaderProps {
  patientName: string;
  gender: 'male' | 'female';
  age: string;
  phone: string;
  email: string;
  patientId: string;
}

export default function PatientHeader({ 
  patientName, 
  gender, 
  age, 
  phone, 
  email, 
  patientId 
}: PatientHeaderProps) {
  const initials = patientName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Box sx={{ 
      backgroundColor: 'background.paper', 
      p: 3, 
      mb: 3, 
      borderRadius: 2, 
      boxShadow: 1,
      border: '1px solid',
      borderColor: 'divider'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              mr: 2, 
              width: 56, 
              height: 56,
              fontSize: '1.5rem'
            }}
          >
            {initials}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              {patientName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paciente #{patientId}
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="contained" 
          color="accentHover"
          sx={{ 
            color: 'white'
          }}
        >
          Terminar consulta
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <Chip 
          icon={gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
          label={gender === 'male' ? 'Masculino' : 'Femenino'}
          variant="outlined"
          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
        />
        <Chip 
          icon={<PersonIcon />}
          label={age}
          variant="outlined"
          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
        />
        <Chip 
          icon={<CalendarTodayIcon />}
          label="13 Ago, 2025"
          variant="outlined"
          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
        />
        <Chip 
          icon={<PhoneIcon />}
          label={phone}
          variant="outlined"
          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
        />
        <Chip 
          icon={<EmailIcon />}
          label={email}
          variant="outlined"
          sx={{ borderColor: 'primary.main', color: 'primary.main' }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'primary.main', 
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': { color: 'primary.dark' }
          }}
        >
          Editar información
        </Typography>
      </Box>
    </Box>
  );
}
