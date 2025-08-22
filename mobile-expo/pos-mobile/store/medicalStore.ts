import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos para el sistema médico
export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  specialty: string;
  license_number: string;
  consultation_fee: number;
  virtual_consultation_fee: number;
  is_available: boolean;
  rating: number;
  experience_years: number;
  hospital?: string;
  created_at: Date;
}

export interface PatientDoctor {
  doctor_id: string;
  patient_id: string;
  doctor: Doctor;
  is_primary: boolean;
  added_date: Date;
  last_consultation: Date | null;
}

export interface PaymentMethod {
  id: string;
  type: 'mobile_payment' | 'bank_transfer' | 'credit_card' | 'cash';
  name: string;
  details: {
    bank_name?: string;
    account_number?: string;
    phone_number?: string;
    card_last_four?: string;
  };
  is_active: boolean;
}

export interface PaymentProof {
  id: string;
  payment_method_id: string;
  amount: number;
  currency: string;
  sender_bank?: string;
  receiver_bank?: string;
  reference_number?: string;
  transaction_date: Date;
  proof_image_url: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  verified_by?: string;
  verified_at?: Date;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  type: 'virtual' | 'in_person';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'paid';
  scheduled_at: Date;
  duration_minutes: number;
  consultation_fee: number;
  payment_status: 'unpaid' | 'pending' | 'paid' | 'refunded';
  payment_proof_id?: string;
  consultation_notes?: string;
  prescription_ids?: string[];
  follow_up_allowed_until?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Consultation {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  status: 'active' | 'follow_up' | 'closed';
  consultation_type: 'initial' | 'follow_up' | 'emergency';
  symptoms?: string;
  diagnosis?: string;
  treatment_plan?: string;
  prescriptions: string[];
  lab_results: string[];
  medical_reports: string[];
  next_steps?: string;
  follow_up_date?: Date;
  closed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Prescription {
  id: string;
  consultation_id: string;
  doctor_id: string;
  patient_id: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  status: 'active' | 'completed' | 'cancelled';
  issued_at: Date;
  expires_at: Date;
}

export interface MedicalReport {
  id: string;
  consultation_id: string;
  doctor_id: string;
  patient_id: string;
  type: 'lab_result' | 'imaging' | 'diagnosis' | 'treatment_summary';
  title: string;
  content: string;
  file_urls: string[];
  created_at: Date;
}

// Estado del store médico
interface MedicalState {
  // Doctores del paciente
  patientDoctors: PatientDoctor[];
  
  // Citas médicas
  appointments: Appointment[];
  
  // Consultas activas
  consultations: Consultation[];
  
  // Recetas
  prescriptions: Prescription[];
  
  // Reportes médicos
  medicalReports: MedicalReport[];
  
  // Métodos de pago
  paymentMethods: PaymentMethod[];
  
  // Comprobantes de pago
  paymentProofs: PaymentProof[];
  
  // Estado de carga
  isLoading: boolean;
  
  // Acciones para doctores
  addDoctorToPatient: (doctor: Doctor, isPrimary?: boolean) => void;
  removeDoctorFromPatient: (doctorId: string) => void;
  setPrimaryDoctor: (doctorId: string) => void;
  
  // Acciones para citas
  scheduleAppointment: (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  updatePaymentStatus: (appointmentId: string, status: Appointment['payment_status']) => void;
  
  // Acciones para consultas
  startConsultation: (appointmentId: string) => void;
  addPrescription: (consultationId: string, prescription: Omit<Prescription, 'id' | 'issued_at'>) => void;
  addMedicalReport: (consultationId: string, report: Omit<MedicalReport, 'id' | 'created_at'>) => void;
  closeConsultation: (consultationId: string, summary: string) => void;
  
  // Acciones para pagos
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  submitPaymentProof: (proof: Omit<PaymentProof, 'id'>) => void;
  verifyPayment: (proofId: string, verified: boolean, notes?: string) => void;
  
  // Utilidades
  getActiveConsultation: (patientId: string, doctorId: string) => Consultation | null;
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getUnpaidAppointments: (patientId: string) => Appointment[];
  getPendingPaymentProofs: () => PaymentProof[];
  
  // Limpiar datos
  clearAllData: () => void;
}

export const useMedicalStore = create<MedicalState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      patientDoctors: [],
      appointments: [],
      consultations: [],
      prescriptions: [],
      medicalReports: [],
      paymentMethods: [],
      paymentProofs: [],
      isLoading: false,
      
      // Acciones para doctores
      addDoctorToPatient: (doctor, isPrimary = false) => {
        set((state) => {
          const existing = state.patientDoctors.find(pd => pd.doctor_id === doctor.id);
          if (existing) return state;
          
          let updatedDoctors = [...state.patientDoctors];
          
          // Si es primario, quitar primary de otros
          if (isPrimary) {
            updatedDoctors = updatedDoctors.map(pd => ({ ...pd, is_primary: false }));
          }
          
          updatedDoctors.push({
            doctor_id: doctor.id,
            patient_id: 'current_patient', // TODO: Get from current user
            doctor,
            is_primary: isPrimary || state.patientDoctors.length === 0,
            added_date: new Date(),
            last_consultation: null,
          });
          
          return { patientDoctors: updatedDoctors };
        });
      },
      
      removeDoctorFromPatient: (doctorId) => {
        set((state) => ({
          patientDoctors: state.patientDoctors.filter(pd => pd.doctor_id !== doctorId)
        }));
      },
      
      setPrimaryDoctor: (doctorId) => {
        set((state) => ({
          patientDoctors: state.patientDoctors.map(pd => ({
            ...pd,
            is_primary: pd.doctor_id === doctorId
          }))
        }));
      },
      
      // Acciones para citas
      scheduleAppointment: (appointmentData) => {
        set((state) => ({
          appointments: [...state.appointments, {
            ...appointmentData,
            id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date(),
            updated_at: new Date(),
          }]
        }));
      },
      
      updateAppointmentStatus: (appointmentId, status) => {
        set((state) => ({
          appointments: state.appointments.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status, updated_at: new Date() }
              : apt
          )
        }));
      },
      
      updatePaymentStatus: (appointmentId, paymentStatus) => {
        set((state) => ({
          appointments: state.appointments.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, payment_status: paymentStatus, updated_at: new Date() }
              : apt
          )
        }));
      },
      
      // Acciones para consultas
      startConsultation: (appointmentId) => {
        const appointment = get().appointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;
        
        set((state) => {
          const consultation: Consultation = {
            id: `cons_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            appointment_id: appointmentId,
            patient_id: appointment.patient_id,
            doctor_id: appointment.doctor_id,
            status: 'active',
            consultation_type: 'initial',
            prescriptions: [],
            lab_results: [],
            medical_reports: [],
            created_at: new Date(),
            updated_at: new Date(),
          };
          
          return {
            consultations: [...state.consultations, consultation],
            appointments: state.appointments.map(apt => 
              apt.id === appointmentId 
                ? { ...apt, status: 'in_progress', updated_at: new Date() }
                : apt
            )
          };
        });
      },
      
      addPrescription: (consultationId, prescriptionData) => {
        set((state) => ({
          prescriptions: [...state.prescriptions, {
            ...prescriptionData,
            id: `rx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            issued_at: new Date(),
          }]
        }));
      },
      
      addMedicalReport: (consultationId, reportData) => {
        set((state) => ({
          medicalReports: [...state.medicalReports, {
            ...reportData,
            id: `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date(),
          }]
        }));
      },
      
      closeConsultation: (consultationId, summary) => {
        set((state) => {
          const consultation = state.consultations.find(c => c.id === consultationId);
          if (!consultation) return state;
          
          // Calcular fecha límite para follow-up (ejemplo: 7 días)
          const followUpUntil = new Date();
          followUpUntil.setDate(followUpUntil.getDate() + 7);
          
          return {
            consultations: state.consultations.map(c => 
              c.id === consultationId 
                ? { ...c, status: 'follow_up', next_steps: summary, follow_up_date: followUpUntil, updated_at: new Date() }
                : c
            ),
            appointments: state.appointments.map(apt => 
              apt.id === consultation.appointment_id 
                ? { ...apt, status: 'completed', follow_up_allowed_until: followUpUntil, updated_at: new Date() }
                : apt
            )
          };
        });
      },
      
      // Acciones para pagos
      addPaymentMethod: (methodData) => {
        set((state) => ({
          paymentMethods: [...state.paymentMethods, {
            ...methodData,
            id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          }]
        }));
      },
      
      submitPaymentProof: (proofData) => {
        set((state) => ({
          paymentProofs: [...state.paymentProofs, {
            ...proofData,
            id: `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          }]
        }));
      },
      
      verifyPayment: (proofId, verified, notes) => {
        set((state) => ({
          paymentProofs: state.paymentProofs.map(proof => 
            proof.id === proofId 
              ? { 
                  ...proof, 
                  status: verified ? 'verified' : 'rejected', 
                  notes, 
                  verified_at: new Date(),
                  verified_by: 'admin' // TODO: Get from current user
                }
              : proof
          )
        }));
      },
      
      // Utilidades
      getActiveConsultation: (patientId, doctorId) => {
        return get().consultations.find(c => 
          c.patient_id === patientId && 
          c.doctor_id === doctorId && 
          c.status === 'active'
        ) || null;
      },
      
      getAppointmentsByPatient: (patientId) => {
        return get().appointments.filter(apt => apt.patient_id === patientId);
      },
      
      getUnpaidAppointments: (patientId) => {
        return get().appointments.filter(apt => 
          apt.patient_id === patientId && 
          apt.payment_status === 'unpaid'
        );
      },
      
      getPendingPaymentProofs: () => {
        return get().paymentProofs.filter(proof => proof.status === 'pending');
      },
      
      clearAllData: () => {
        set({
          patientDoctors: [],
          appointments: [],
          consultations: [],
          prescriptions: [],
          medicalReports: [],
          paymentMethods: [],
          paymentProofs: [],
          isLoading: false,
        });
      },
    }),
    {
      name: 'medical-business-logic',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Funciones de utilidad
export const getMockDoctors = (): Doctor[] => [
  {
    id: 'doc_001',
    first_name: 'Ana',
    last_name: 'González',
    email: 'ana.gonzalez@hospital.com',
    phone: '+1234567890',
    specialty: 'Medicina General',
    license_number: 'MED-2024-001',
    consultation_fee: 50.00,
    virtual_consultation_fee: 35.00,
    is_available: true,
    rating: 4.8,
    experience_years: 12,
    hospital: 'Hospital Central',
    created_at: new Date('2020-01-15'),
  },
  {
    id: 'doc_002',
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    email: 'carlos.rodriguez@clinic.com',
    phone: '+1234567891',
    specialty: 'Cardiología',
    license_number: 'MED-2024-002',
    consultation_fee: 80.00,
    virtual_consultation_fee: 60.00,
    is_available: true,
    rating: 4.9,
    experience_years: 15,
    hospital: 'Clínica del Corazón',
    created_at: new Date('2018-03-20'),
  },
  {
    id: 'doc_003',
    first_name: 'María',
    last_name: 'López',
    email: 'maria.lopez@pediatrics.com',
    phone: '+1234567892',
    specialty: 'Pediatría',
    license_number: 'MED-2024-003',
    consultation_fee: 60.00,
    virtual_consultation_fee: 45.00,
    is_available: false,
    rating: 4.7,
    experience_years: 8,
    hospital: 'Hospital Infantil',
    created_at: new Date('2021-06-10'),
  },
];

export const getDefaultPaymentMethods = (): Omit<PaymentMethod, 'id'>[] => [
  {
    type: 'mobile_payment',
    name: 'Pago Móvil',
    details: {
      phone_number: '+58-414-1234567'
    },
    is_active: true,
  },
  {
    type: 'bank_transfer',
    name: 'Transferencia Bancaria',
    details: {
      bank_name: 'Banco de Venezuela',
      account_number: '0102-1234-56-7890123456'
    },
    is_active: true,
  },
];
