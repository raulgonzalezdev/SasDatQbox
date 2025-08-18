import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  email?: string;
  phone: string;
  address?: string;
  place_of_birth?: string;
  nationality?: string;
  city_of_birth?: string;
  relationship?: string;
  blood_type?: string;
  education_level?: string;
  profession?: string;
  religion?: string;
  marital_status?: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  billing_info?: {
    name: string;
    address: string;
    tax_regime: string;
    cfdi_use: string;
    rfc: string;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePatientPayload {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  email?: string;
  phone: string;
  address?: string;
  place_of_birth?: string;
  nationality?: string;
  city_of_birth?: string;
  relationship?: string;
  blood_type?: string;
  education_level?: string;
  profession?: string;
  religion?: string;
  marital_status?: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  billing_info?: {
    name: string;
    address: string;
    tax_regime: string;
    cfdi_use: string;
    rfc: string;
  };
  notes?: string;
}

export interface UpdatePatientPayload extends Partial<CreatePatientPayload> {}

// Mock data
const mockPatients: Patient[] = [
  {
    id: '1',
    first_name: 'Alfredo',
    last_name: 'Arroyo Demillon',
    date_of_birth: '2002-05-17',
    gender: 'male',
    email: 'alfredoarroyode@gmail.com',
    phone: '7721793137',
    address: 'Calle Principal 123',
    place_of_birth: 'Ciudad de México',
    nationality: 'Mexicana',
    city_of_birth: 'Ciudad de México',
    relationship: 'Paciente',
    blood_type: 'O+',
    education_level: 'Universidad',
    profession: 'Ingeniero',
    religion: 'Católica',
    marital_status: 'Soltero',
    emergency_contact: {
      name: 'María Arroyo',
      relationship: 'Madre',
      phone: '7721793138',
      email: 'maria@email.com'
    },
    billing_info: {
      name: 'Alfredo Arroyo Demillon',
      address: 'Calle Principal 123',
      tax_regime: 'Persona Física',
      cfdi_use: 'G01',
      rfc: 'AAD020517ABC'
    },
    notes: 'Paciente con antecedentes familiares de diabetes',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    first_name: 'Jose',
    last_name: 'Bastidas',
    date_of_birth: '1999-01-01',
    gender: 'male',
    email: 'jose@email.com',
    phone: '24242424242424',
    address: 'Calle Secundaria 456',
    place_of_birth: 'Guadalajara',
    nationality: 'Mexicana',
    city_of_birth: 'Guadalajara',
    relationship: 'Paciente',
    blood_type: 'A+',
    education_level: 'Universidad',
    profession: 'Médico',
    religion: 'Católica',
    marital_status: 'Casado',
    emergency_contact: {
      name: 'Ana Bastidas',
      relationship: 'Esposa',
      phone: '24242424242425',
      email: 'ana@email.com'
    },
    billing_info: {
      name: 'Jose Bastidas',
      address: 'Calle Secundaria 456',
      tax_regime: 'Persona Física',
      cfdi_use: 'G01',
      rfc: 'JOB990101ABC'
    },
    notes: 'Paciente con antecedentes de hipertensión',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '3',
    first_name: 'Andrea',
    last_name: 'Bañuelos',
    date_of_birth: '2011-03-15',
    gender: 'female',
    email: 'andrea@email.com',
    phone: '6181316911',
    address: 'Calle Tercera 789',
    place_of_birth: 'Monterrey',
    nationality: 'Mexicana',
    city_of_birth: 'Monterrey',
    relationship: 'Hija',
    blood_type: 'B+',
    education_level: 'Primaria',
    profession: 'Estudiante',
    religion: 'Católica',
    marital_status: 'Soltera',
    emergency_contact: {
      name: 'Carlos Bañuelos',
      relationship: 'Padre',
      phone: '6181316912',
      email: 'carlos@email.com'
    },
    billing_info: {
      name: 'Carlos Bañuelos',
      address: 'Calle Tercera 789',
      tax_regime: 'Persona Física',
      cfdi_use: 'G01',
      rfc: 'CAB110315ABC'
    },
    notes: 'Paciente pediátrica',
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    id: '4',
    first_name: 'Johana',
    last_name: 'Burgos',
    date_of_birth: '2000-07-20',
    gender: 'female',
    email: 'johana@email.com',
    phone: '9994182485',
    address: 'Calle Cuarta 321',
    place_of_birth: 'Puebla',
    nationality: 'Mexicana',
    city_of_birth: 'Puebla',
    relationship: 'Paciente',
    blood_type: 'AB+',
    education_level: 'Universidad',
    profession: 'Abogada',
    religion: 'Católica',
    marital_status: 'Soltera',
    emergency_contact: {
      name: 'Luis Burgos',
      relationship: 'Hermano',
      phone: '9994182486',
      email: 'luis@email.com'
    },
    billing_info: {
      name: 'Johana Burgos',
      address: 'Calle Cuarta 321',
      tax_regime: 'Persona Física',
      cfdi_use: 'G01',
      rfc: 'JOB000720ABC'
    },
    notes: 'Paciente con antecedentes de alergias',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  }
];

interface PatientStore {
  patients: Patient[];
  selectedPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  
  // Actions
  setPatients: (patients: Patient[]) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // CRUD Operations
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: UpdatePatientPayload) => void;
  deletePatient: (id: string) => void;
  
  // UI Actions
  openEditDialog: (patient: Patient) => void;
  closeEditDialog: () => void;
  openDeleteDialog: (patient: Patient) => void;
  closeDeleteDialog: () => void;
  
  // Computed
  getPatientById: (id: string) => Patient | undefined;
  searchPatients: (query: string) => Patient[];
  getPatientsByGender: (gender: 'male' | 'female') => Patient[];
  getTotalPatients: () => number;
  getGenderDistribution: () => { male: number; female: number; malePercentage: number; femalePercentage: number };
}

export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      patients: mockPatients,
      selectedPatient: null,
      isLoading: false,
      error: null,
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      
      // Actions
      setPatients: (patients) => set({ patients }),
      setSelectedPatient: (patient) => set({ selectedPatient: patient }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // CRUD Operations
      addPatient: (patient) => 
        set((state) => ({ 
          patients: [...state.patients, patient] 
        })),
      
      updatePatient: (id, updates) =>
        set((state) => ({
          patients: state.patients.map(patient =>
            patient.id === id 
              ? { 
                  ...patient, 
                  ...updates, 
                  updated_at: new Date().toISOString() 
                } 
              : patient
          )
        })),
      
      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter(patient => patient.id !== id)
        })),
      
      // UI Actions
      openEditDialog: (patient) => 
        set({ 
          selectedPatient: patient, 
          isEditDialogOpen: true 
        }),
      
      closeEditDialog: () => 
        set({ 
          selectedPatient: null, 
          isEditDialogOpen: false 
        }),
      
      openDeleteDialog: (patient) =>
        set({
          selectedPatient: patient,
          isDeleteDialogOpen: true
        }),
      
      closeDeleteDialog: () =>
        set({
          selectedPatient: null,
          isDeleteDialogOpen: false
        }),
      
      // Computed
      getPatientById: (id) => {
        const state = get();
        return state.patients.find(patient => patient.id === id);
      },
      
      searchPatients: (query) => {
        const state = get();
        const lowerQuery = query.toLowerCase();
        return state.patients.filter(patient =>
          patient.first_name.toLowerCase().includes(lowerQuery) ||
          patient.last_name.toLowerCase().includes(lowerQuery) ||
          patient.email?.toLowerCase().includes(lowerQuery) ||
          patient.phone.includes(query)
        );
      },
      
      getPatientsByGender: (gender) => {
        const state = get();
        return state.patients.filter(patient => patient.gender === gender);
      },
      
      getTotalPatients: () => {
        const state = get();
        return state.patients.length;
      },
      
      getGenderDistribution: () => {
        const state = get();
        const total = state.patients.length;
        const male = state.patients.filter(p => p.gender === 'male').length;
        const female = state.patients.filter(p => p.gender === 'female').length;
        
        return {
          male,
          female,
          malePercentage: total > 0 ? Math.round((male / total) * 100) : 0,
          femalePercentage: total > 0 ? Math.round((female / total) * 100) : 0
        };
      }
    }),
    {
      name: 'patient-store',
      partialize: (state) => ({
        patients: state.patients
      })
    }
  )
);
