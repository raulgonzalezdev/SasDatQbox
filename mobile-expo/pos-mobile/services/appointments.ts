import { post, get, put, del } from './api';
import { APPOINTMENT_ENDPOINTS } from '../constants/api';

// Interfaces para las citas médicas
export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreate {
  patient_id: string;
  appointment_date: string;
  notes?: string;
}

export interface AppointmentUpdate {
  appointment_date?: string;
  notes?: string;
  status?: string;
}

// Función para crear una nueva cita
export const createAppointment = async (appointmentData: AppointmentCreate): Promise<Appointment> => {
  console.log('🔍 Creando cita médica');
  
  try {
    const appointment = await post<Appointment>(APPOINTMENT_ENDPOINTS.CREATE, appointmentData, { requireAuth: true });
    return appointment;
  } catch (error) {
    console.error('❌ Error al crear cita:', error);
    throw error;
  }
};

// Función para obtener todas las citas del usuario
export const getAppointments = async (): Promise<Appointment[]> => {
  console.log('🔍 Obteniendo citas médicas');
  
  try {
    const appointments = await get<Appointment[]>(APPOINTMENT_ENDPOINTS.LIST, { requireAuth: true });
    return appointments;
  } catch (error) {
    console.error('❌ Error al obtener citas:', error);
    throw error;
  }
};

// Función para obtener una cita específica
export const getAppointment = async (id: string): Promise<Appointment> => {
  console.log('🔍 Obteniendo cita médica:', id);
  
  try {
    const appointment = await get<Appointment>(APPOINTMENT_ENDPOINTS.GET(id), { requireAuth: true });
    return appointment;
  } catch (error) {
    console.error('❌ Error al obtener cita:', error);
    throw error;
  }
};

// Función para actualizar una cita
export const updateAppointment = async (id: string, appointmentData: AppointmentUpdate): Promise<Appointment> => {
  console.log('🔍 Actualizando cita médica:', id);
  
  try {
    const appointment = await put<Appointment>(APPOINTMENT_ENDPOINTS.UPDATE(id), appointmentData, { requireAuth: true });
    return appointment;
  } catch (error) {
    console.error('❌ Error al actualizar cita:', error);
    throw error;
  }
};

// Función para eliminar una cita
export const deleteAppointment = async (id: string): Promise<void> => {
  console.log('🔍 Eliminando cita médica:', id);
  
  try {
    await del(APPOINTMENT_ENDPOINTS.DELETE(id), { requireAuth: true });
  } catch (error) {
    console.error('❌ Error al eliminar cita:', error);
    throw error;
  }
};

// Función para confirmar una cita
export const confirmAppointment = async (id: string): Promise<Appointment> => {
  console.log('🔍 Confirmando cita médica:', id);
  
  try {
    const appointment = await post<Appointment>(APPOINTMENT_ENDPOINTS.CONFIRM(id), {}, { requireAuth: true });
    return appointment;
  } catch (error) {
    console.error('❌ Error al confirmar cita:', error);
    throw error;
  }
};

// Función para cancelar una cita
export const cancelAppointment = async (id: string): Promise<Appointment> => {
  console.log('🔍 Cancelando cita médica:', id);
  
  try {
    const appointment = await post<Appointment>(APPOINTMENT_ENDPOINTS.CANCEL(id), {}, { requireAuth: true });
    return appointment;
  } catch (error) {
    console.error('❌ Error al cancelar cita:', error);
    throw error;
  }
};

// Función para reprogramar una cita
export const rescheduleAppointment = async (id: string, appointmentData: AppointmentUpdate): Promise<Appointment> => {
  console.log('🔍 Reprogramando cita médica:', id);
  
  try {
    const appointment = await post<Appointment>(APPOINTMENT_ENDPOINTS.RESCHEDULE(id), appointmentData, { requireAuth: true });
    return appointment;
  } catch (error) {
    console.error('❌ Error al reprogramar cita:', error);
    throw error;
  }
};
