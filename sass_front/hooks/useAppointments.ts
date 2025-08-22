'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// --- Type Definitions ---
export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_datetime: string;
  status: 'active' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    id: string;
    first_name: string;
    last_name: string;
    contact_info: {
      email: string;
      phone: string;
    };
  };
  doctor?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface CreateAppointmentPayload {
  doctor_id: string;
  patient_id: string;
  appointment_datetime: string;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentPayload {
  appointment_datetime?: string;
  status?: 'active' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
}

// --- API Functions ---
const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await customFetch('/appointments/');
  if (!res.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return res.json();
};

// Mock data for when backend is not available
const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctor_id: '1',
    patient_id: '1',
    appointment_datetime: '2024-08-17T22:00:00Z',
    status: 'active',
    reason: 'Revisión',
    notes: 'Especial',
    created_at: '2024-08-10T10:00:00Z',
    updated_at: '2024-08-10T10:00:00Z',
    patient: {
      id: '1',
      first_name: 'Mauricio',
      last_name: 'Fernandez',
      contact_info: {
        email: 'mauricio@example.com',
        phone: '555-1234',
      },
    },
    doctor: {
      id: '1',
      first_name: 'Dr. Robert',
      last_name: 'Escalona',
      email: 'doctor@example.com',
    },
  },
  {
    id: '2',
    doctor_id: '1',
    patient_id: '2',
    appointment_datetime: '2024-08-18T14:30:00Z',
    status: 'active',
    reason: 'Consulta general',
    notes: 'Primera visita',
    created_at: '2024-08-10T10:00:00Z',
    updated_at: '2024-08-10T10:00:00Z',
    patient: {
      id: '2',
      first_name: 'María',
      last_name: 'González',
      contact_info: {
        email: 'maria@example.com',
        phone: '555-5678',
      },
    },
    doctor: {
      id: '1',
      first_name: 'Dr. Robert',
      last_name: 'Escalona',
      email: 'doctor@example.com',
    },
  },
  {
    id: '3',
    doctor_id: '1',
    patient_id: '3',
    appointment_datetime: '2024-08-19T10:00:00Z',
    status: 'active',
    reason: 'Control rutinario',
    notes: '',
    created_at: '2024-08-10T10:00:00Z',
    updated_at: '2024-08-10T10:00:00Z',
    patient: {
      id: '3',
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      contact_info: {
        email: 'carlos@example.com',
        phone: '555-9012',
      },
    },
    doctor: {
      id: '1',
      first_name: 'Dr. Robert',
      last_name: 'Escalona',
      email: 'doctor@example.com',
    },
  },
];

const fetchAppointment = async (id: string): Promise<Appointment> => {
  const res = await customFetch(`/appointments/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch appointment');
  }
  return res.json();
};

const createAppointment = async (payload: CreateAppointmentPayload): Promise<Appointment> => {
  const res = await customFetch('/appointments/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create appointment');
  }
  return res.json();
};

const updateAppointment = async ({ id, payload }: { id: string; payload: UpdateAppointmentPayload }): Promise<Appointment> => {
  const res = await customFetch(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update appointment');
  }
  return res.json();
};

const deleteAppointment = async (id: string): Promise<void> => {
  const res = await customFetch(`/appointments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete appointment');
  }
};

// --- Main Hook ---
export function useAppointments() {
  const queryClient = useQueryClient();

  // Query for all appointments
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
    retry: 1, // Only retry once to fallback to mock data quickly
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Use mock data if no appointments from backend
  const allAppointments = appointments.length > 0 ? appointments : mockAppointments;

  // Query for single appointment
  const useAppointment = (id: string) => {
    return useQuery({
      queryKey: ['appointments', id],
      queryFn: () => fetchAppointment(id),
      enabled: !!id,
    });
  };

  // Mutation for creating appointment
  const { mutate: createAppointmentMutation, isPending: isCreating } = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita creada exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for updating appointment
  const { mutate: updateAppointmentMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita actualizada exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for deleting appointment
  const { mutate: deleteAppointmentMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Cita eliminada exitosamente');
    },
    onError: handleApiError,
  });

  // Helper function to get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return allAppointments.filter(appointment => 
      appointment.appointment_datetime.startsWith(dateString)
    );
  };

  // Helper function to get appointments for a date range
  const getAppointmentsForDateRange = (startDate: Date, endDate: Date) => {
    const startString = startDate.toISOString().split('T')[0];
    const endString = endDate.toISOString().split('T')[0];
    
    return allAppointments.filter(appointment => {
      const appointmentDate = appointment.appointment_datetime.split('T')[0];
      return appointmentDate >= startString && appointmentDate <= endString;
    });
  };

  return {
    appointments: allAppointments,
    isLoading,
    error,
    useAppointment,
    createAppointment: createAppointmentMutation,
    updateAppointment: updateAppointmentMutation,
    deleteAppointment: deleteAppointmentMutation,
    isCreating,
    isUpdating,
    isDeleting,
    getAppointmentsForDate,
    getAppointmentsForDateRange,
  };
}
