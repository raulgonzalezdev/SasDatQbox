// Datos de usuario mock para testing de roles

export const mockUsers = {
  doctor: {
    id: 'doc_001',
    first_name: 'Dr. María',
    last_name: 'González',
    email: 'maria.gonzalez@hospital.com',
    phone: '+1 234 567 8900',
    role: 'doctor' as const,
    businessName: 'Clínica Médica González',
    isPremium: true,
    created_at: new Date('2023-01-01'),
    updated_at: new Date(),
    specialization: 'Medicina General',
    medicalLicense: 'ML-2023-001',
    yearsOfExperience: 15,
  },
  
  patient: {
    id: 'pat_001',
    first_name: 'Ana',
    last_name: 'Martínez',
    email: 'ana.martinez@email.com',
    phone: '+1 234 567 8901',
    role: 'patient' as const,
    isPremium: false,
    created_at: new Date('2023-06-15'),
    updated_at: new Date(),
    dateOfBirth: new Date('1985-03-10'),
    bloodType: 'O+',
    emergencyContact: {
      name: 'Carlos Martínez',
      phone: '+1 234 567 8902',
      relationship: 'Esposo'
    },
    insuranceProvider: 'Seguros Médicos Unidos',
    insuranceNumber: 'SMU-12345678',
    primaryDoctorId: 'doc_001',
  },

  admin: {
    id: 'adm_001',
    first_name: 'Luis',
    last_name: 'Administrador',
    email: 'admin@hospital.com',
    phone: '+1 234 567 8999',
    role: 'admin' as const,
    isPremium: true,
    created_at: new Date('2022-01-01'),
    updated_at: new Date(),
  }
};

// Datos médicos específicos para pacientes
export const mockPatientMedicalData = {
  medicalHistory: [
    {
      id: 'hist_001',
      condition: 'Hipertensión',
      diagnosedDate: '2020-03-15',
      status: 'active',
      severity: 'moderate',
    },
    {
      id: 'hist_002', 
      condition: 'Diabetes Tipo 2',
      diagnosedDate: '2019-08-22',
      status: 'controlled',
      severity: 'mild',
    }
  ],
  
  currentMedications: [
    {
      id: 'med_001',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Una vez al día',
      prescribedBy: 'Dr. María González',
      startDate: '2020-03-15',
    },
    {
      id: 'med_002',
      name: 'Metformina',
      dosage: '500mg',
      frequency: 'Dos veces al día',
      prescribedBy: 'Dr. María González', 
      startDate: '2019-08-22',
    }
  ],

  allergies: [
    {
      id: 'all_001',
      allergen: 'Penicilina',
      severity: 'severe',
      reaction: 'Erupciones cutáneas',
    }
  ],

  vitalSigns: {
    lastRecorded: new Date(),
    bloodPressure: '130/85',
    heartRate: 75,
    temperature: 36.5,
    weight: 68,
    height: 165,
  }
};

// Datos específicos para doctores
export const mockDoctorData = {
  patients: [
    {
      id: 'pat_001',
      name: 'Ana Martínez',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-20',
      status: 'active',
      riskLevel: 'medium',
    },
    {
      id: 'pat_002',
      name: 'Carlos Rodríguez', 
      lastVisit: '2024-01-08',
      nextAppointment: '2024-01-18',
      status: 'active',
      riskLevel: 'low',
    },
    {
      id: 'pat_003',
      name: 'Laura Silva',
      lastVisit: '2024-01-05',
      nextAppointment: null,
      status: 'inactive',
      riskLevel: 'high',
    }
  ],

  upcomingAppointments: [
    {
      id: 'app_001',
      patientName: 'Ana Martínez',
      date: '2024-01-20',
      time: '10:00',
      type: 'Consulta General',
      status: 'confirmed',
    },
    {
      id: 'app_002', 
      patientName: 'Carlos Rodríguez',
      date: '2024-01-18',
      time: '14:30',
      type: 'Seguimiento',
      status: 'pending',
    }
  ],

  monthlyStats: {
    totalAppointments: 45,
    newPatients: 8,
    prescriptionsIssued: 32,
    emergencyCalls: 2,
  }
};
