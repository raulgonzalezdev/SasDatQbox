import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MedicalHistory {
  id: string;
  patient_id: string;
  
  // Antecedentes heredo-familiares
  hereditary_family: {
    diabetes: { has: boolean; details?: string };
    hypertension: { has: boolean; details?: string };
    cardiovascular: { has: boolean; details?: string };
    thyroid: { has: boolean; details?: string };
    cancer: { has: boolean; details?: string };
    renal: { has: boolean; details?: string };
    lupus: { has: boolean; details?: string };
    parkinson: { has: boolean; details?: string };
    alzheimer: { has: boolean; details?: string };
    active_medications: { has: boolean; details?: string };
    other: { has: boolean; details?: string };
  };
  
  // Antecedentes no patológicos
  non_pathological: {
    smoking: { has: boolean; details?: string };
    alcohol: { has: boolean; details?: string };
    drugs: { has: boolean; details?: string };
    exercise: { has: boolean; details?: string };
    diet: { has: boolean; details?: string };
    sleep: { has: boolean; details?: string };
    stress: { has: boolean; details?: string };
    other: { has: boolean; details?: string };
  };
  
  // Antecedentes patológicos
  pathological: {
    surgeries: { has: boolean; details?: string };
    hospitalizations: { has: boolean; details?: string };
    allergies: { has: boolean; details?: string };
    chronic_diseases: { has: boolean; details?: string };
    medications: { has: boolean; details?: string };
    other: { has: boolean; details?: string };
  };
  
  // Interrogatorio por aparatos y sistemas
  systems_interrogation: {
    cardiovascular: { has: boolean; details?: string };
    respiratory: { has: boolean; details?: string };
    digestive: { has: boolean; details?: string };
    genitourinary: { has: boolean; details?: string };
    musculoskeletal: { has: boolean; details?: string };
    neurological: { has: boolean; details?: string };
    endocrine: { has: boolean; details?: string };
    skin: { has: boolean; details?: string };
    other: { has: boolean; details?: string };
  };
  
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string;
  
  // Notas de padecimiento
  chief_complaint: string;
  present_illness: string;
  
  // Examen físico
  physical_exam: {
    vital_signs: {
      blood_pressure: string;
      heart_rate: string;
      temperature: string;
      respiratory_rate: string;
      oxygen_saturation: string;
    };
    general_appearance: string;
    head_neck: string;
    cardiovascular: string;
    respiratory: string;
    abdomen: string;
    extremities: string;
    neurological: string;
  };
  
  // Diagnóstico
  diagnosis: {
    primary: string;
    secondary: string[];
    cie11_codes: string[];
  };
  
  // Pronóstico
  prognosis: string;
  
  // Plan
  treatment_plan: string;
  
  // Estudios solicitados
  requested_studies: Array<{
    id: string;
    name: string;
    type: 'laboratory' | 'imaging' | 'other';
    notes?: string;
  }>;
  
  // Receta
  prescription: Array<{
    id: string;
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  
  // Alergias
  allergies: Array<{
    id: string;
    allergen: string;
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  
  status: 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ConsultationStore {
  currentConsultation: Consultation | null;
  medicalHistory: MedicalHistory | null;
  activeTab: 'ficha' | 'historia_clinica' | 'consulta' | 'historial' | 'estudios';
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentConsultation: (consultation: Consultation | null) => void;
  setMedicalHistory: (history: MedicalHistory | null) => void;
  setActiveTab: (tab: 'ficha' | 'historia_clinica' | 'consulta' | 'historial' | 'estudios') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Consultation CRUD
  createConsultation: (consultation: Omit<Consultation, 'id' | 'created_at' | 'updated_at'>) => void;
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
  completeConsultation: (id: string) => void;
  
  // Medical History CRUD
  createMedicalHistory: (history: Omit<MedicalHistory, 'id' | 'created_at' | 'updated_at'>) => void;
  updateMedicalHistory: (id: string, updates: Partial<MedicalHistory>) => void;
  
  // Computed
  getConsultationById: (id: string) => Consultation | undefined;
  getMedicalHistoryByPatientId: (patientId: string) => MedicalHistory | undefined;
}

// Mock data
const mockMedicalHistory: MedicalHistory = {
  id: '1',
  patient_id: '1',
  hereditary_family: {
    diabetes: { has: true, details: 'Padre diagnosticado a los 45 años' },
    hypertension: { has: false },
    cardiovascular: { has: false },
    thyroid: { has: true, details: 'Madre con hipotiroidismo' },
    cancer: { has: false },
    renal: { has: false },
    lupus: { has: false },
    parkinson: { has: false },
    alzheimer: { has: false },
    active_medications: { has: false },
    other: { has: false },
  },
  non_pathological: {
    smoking: { has: false },
    alcohol: { has: false },
    drugs: { has: false },
    exercise: { has: true, details: 'Ejercicio moderado 3 veces por semana' },
    diet: { has: true, details: 'Dieta balanceada' },
    sleep: { has: true, details: '7-8 horas por noche' },
    stress: { has: false },
    other: { has: false },
  },
  pathological: {
    surgeries: { has: false },
    hospitalizations: { has: false },
    allergies: { has: true, details: 'Alergia a penicilina' },
    chronic_diseases: { has: false },
    medications: { has: false },
    other: { has: false },
  },
  systems_interrogation: {
    cardiovascular: { has: false },
    respiratory: { has: false },
    digestive: { has: false },
    genitourinary: { has: false },
    musculoskeletal: { has: false },
    neurological: { has: false },
    endocrine: { has: false },
    skin: { has: false },
    other: { has: false },
  },
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'
};

const mockConsultation: Consultation = {
  id: '1',
  patient_id: '1',
  doctor_id: '1',
  chief_complaint: 'Dolor de cabeza intenso',
  present_illness: 'El paciente refiere dolor de cabeza de 3 días de evolución...',
  physical_exam: {
    vital_signs: {
      blood_pressure: '120/80',
      heart_rate: '72',
      temperature: '36.8',
      respiratory_rate: '16',
      oxygen_saturation: '98%',
    },
    general_appearance: 'Paciente consciente, orientado',
    head_neck: 'Sin alteraciones',
    cardiovascular: 'Ritmo cardíaco regular',
    respiratory: 'Auscultación pulmonar normal',
    abdomen: 'Blando, no doloroso',
    extremities: 'Sin edema',
    neurological: 'Examen neurológico normal',
  },
  diagnosis: {
    primary: 'Cefalea tensional',
    secondary: ['Estrés'],
    cie11_codes: ['8A80.0'],
  },
  prognosis: 'Favorable con tratamiento adecuado',
  treatment_plan: 'Analgésicos, relajación, control de estrés',
  requested_studies: [
    {
      id: '1',
      name: 'Hemograma completo',
      type: 'laboratory',
      notes: 'Para descartar anemia'
    }
  ],
  prescription: [
    {
      id: '1',
      medication: 'Ibuprofeno',
      dosage: '400mg',
      frequency: 'Cada 8 horas',
      duration: '5 días',
      instructions: 'Tomar con alimentos'
    }
  ],
  allergies: [
    {
      id: '1',
      allergen: 'Penicilina',
      reaction: 'Urticaria',
      severity: 'moderate'
    }
  ],
  status: 'in_progress',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z'
};

export const useConsultationStore = create<ConsultationStore>()(
  persist(
    (set, get) => ({
      currentConsultation: mockConsultation,
      medicalHistory: mockMedicalHistory,
      activeTab: 'ficha',
      isLoading: false,
      error: null,
      
      // Actions
      setCurrentConsultation: (consultation) => set({ currentConsultation: consultation }),
      setMedicalHistory: (history) => set({ medicalHistory: history }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // Consultation CRUD
      createConsultation: (consultation) => {
        const newConsultation: Consultation = {
          ...consultation,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set({ currentConsultation: newConsultation });
      },
      
      updateConsultation: (id, updates) => {
        set((state) => ({
          currentConsultation: state.currentConsultation
            ? {
                ...state.currentConsultation,
                ...updates,
                updated_at: new Date().toISOString(),
              }
            : null
        }));
      },
      
      completeConsultation: (id) => {
        set((state) => ({
          currentConsultation: state.currentConsultation
            ? {
                ...state.currentConsultation,
                status: 'completed',
                updated_at: new Date().toISOString(),
              }
            : null
        }));
      },
      
      // Medical History CRUD
      createMedicalHistory: (history) => {
        const newHistory: MedicalHistory = {
          ...history,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set({ medicalHistory: newHistory });
      },
      
      updateMedicalHistory: (id, updates) => {
        set((state) => ({
          medicalHistory: state.medicalHistory
            ? {
                ...state.medicalHistory,
                ...updates,
                updated_at: new Date().toISOString(),
              }
            : null
        }));
      },
      
      // Computed
      getConsultationById: (id) => {
        const state = get();
        return state.currentConsultation?.id === id ? state.currentConsultation : undefined;
      },
      
      getMedicalHistoryByPatientId: (patientId) => {
        const state = get();
        return state.medicalHistory?.patient_id === patientId ? state.medicalHistory : undefined;
      },
    }),
    {
      name: 'consultation-store',
      partialize: (state) => ({
        currentConsultation: state.currentConsultation,
        medicalHistory: state.medicalHistory,
        activeTab: state.activeTab
      })
    }
  )
);
