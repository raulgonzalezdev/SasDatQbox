import { post, get, put, del } from './api';
import { PATIENT_ENDPOINTS } from '../constants/api';

// Interfaces para los pacientes
export interface Patient {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  surgeries?: string[];
  family_history?: Record<string, any>;
  lifestyle?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PatientCreate {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  surgeries?: string[];
  family_history?: Record<string, any>;
  lifestyle?: Record<string, any>;
}

export interface PatientUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  surgeries?: string[];
  family_history?: Record<string, any>;
  lifestyle?: Record<string, any>;
}

export interface MedicalHistory {
  patient_id: string;
  medical_history: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    surgeries: string[];
    family_history: Record<string, any>;
    lifestyle: Record<string, any>;
  };
  last_updated: string;
}

// Función para crear un nuevo paciente
export const createPatient = async (patientData: PatientCreate): Promise<Patient> => {
  console.log('🔍 Creando paciente');
  
  try {
    const patient = await post<Patient>(PATIENT_ENDPOINTS.CREATE, patientData, { requireAuth: true });
    return patient;
  } catch (error) {
    console.error('❌ Error al crear paciente:', error);
    throw error;
  }
};

// Función para obtener todos los pacientes
export const getPatients = async (skip: number = 0, limit: number = 100): Promise<Patient[]> => {
  console.log('🔍 Obteniendo pacientes');
  
  try {
    const patients = await get<Patient[]>(`${PATIENT_ENDPOINTS.LIST}?skip=${skip}&limit=${limit}`, { requireAuth: true });
    return patients;
  } catch (error) {
    console.error('❌ Error al obtener pacientes:', error);
    throw error;
  }
};

// Función para buscar pacientes
export const searchPatients = async (query: string): Promise<Patient[]> => {
  console.log('🔍 Buscando pacientes:', query);
  
  try {
    const patients = await get<Patient[]>(`${PATIENT_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`, { requireAuth: true });
    return patients;
  } catch (error) {
    console.error('❌ Error al buscar pacientes:', error);
    throw error;
  }
};

// Función para obtener un paciente específico
export const getPatient = async (id: string): Promise<Patient> => {
  console.log('🔍 Obteniendo paciente:', id);
  
  try {
    const patient = await get<Patient>(PATIENT_ENDPOINTS.GET(id), { requireAuth: true });
    return patient;
  } catch (error) {
    console.error('❌ Error al obtener paciente:', error);
    throw error;
  }
};

// Función para obtener el historial médico de un paciente
export const getPatientMedicalHistory = async (id: string): Promise<MedicalHistory> => {
  console.log('🔍 Obteniendo historial médico del paciente:', id);
  
  try {
    const medicalHistory = await get<MedicalHistory>(PATIENT_ENDPOINTS.MEDICAL_HISTORY(id), { requireAuth: true });
    return medicalHistory;
  } catch (error) {
    console.error('❌ Error al obtener historial médico:', error);
    throw error;
  }
};

// Función para actualizar un paciente
export const updatePatient = async (id: string, patientData: PatientUpdate): Promise<Patient> => {
  console.log('🔍 Actualizando paciente:', id);
  
  try {
    const patient = await put<Patient>(PATIENT_ENDPOINTS.UPDATE(id), patientData, { requireAuth: true });
    return patient;
  } catch (error) {
    console.error('❌ Error al actualizar paciente:', error);
    throw error;
  }
};

// Función para eliminar un paciente
export const deletePatient = async (id: string): Promise<void> => {
  console.log('🔍 Eliminando paciente:', id);
  
  try {
    await del(PATIENT_ENDPOINTS.DELETE(id), { requireAuth: true });
  } catch (error) {
    console.error('❌ Error al eliminar paciente:', error);
    throw error;
  }
};
