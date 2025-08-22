'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// --- Type Definitions ---
export interface Patient {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  contact_info: {
    email: string;
    phone: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreatePatientPayload {
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  contact_info: {
    email: string;
    phone: string;
  };
}

export interface UpdatePatientPayload {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  contact_info?: {
    email?: string;
    phone?: string;
  };
}

// --- API Functions ---
const fetchPatients = async (): Promise<Patient[]> => {
  const res = await customFetch('/patients/');
  if (!res.ok) {
    throw new Error('Failed to fetch patients');
  }
  return res.json();
};

// Mock data for when backend is not available
const mockPatients: Patient[] = [
  {
    id: '1',
    user_id: '1',
    first_name: 'Mauricio',
    last_name: 'Fernandez',
    date_of_birth: '1990-05-15',
    contact_info: {
      email: 'mauricio@example.com',
      phone: '555-1234',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    user_id: '2',
    first_name: 'María',
    last_name: 'González',
    date_of_birth: '1985-08-22',
    contact_info: {
      email: 'maria@example.com',
      phone: '555-5678',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    user_id: '3',
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    date_of_birth: '1978-12-10',
    contact_info: {
      email: 'carlos@example.com',
      phone: '555-9012',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    user_id: '4',
    first_name: 'Ana',
    last_name: 'López',
    date_of_birth: '1992-03-28',
    contact_info: {
      email: 'ana@example.com',
      phone: '555-3456',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

const fetchPatient = async (id: string): Promise<Patient> => {
  const res = await customFetch(`/patients/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch patient');
  }
  return res.json();
};

const createPatient = async (payload: CreatePatientPayload): Promise<Patient> => {
  const res = await customFetch('/patients/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create patient');
  }
  return res.json();
};

const updatePatient = async ({ id, payload }: { id: string; payload: UpdatePatientPayload }): Promise<Patient> => {
  const res = await customFetch(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update patient');
  }
  return res.json();
};

const deletePatient = async (id: string): Promise<void> => {
  const res = await customFetch(`/patients/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete patient');
  }
};

// --- Main Hook ---
export function usePatients() {
  const queryClient = useQueryClient();

  // Query for all patients
  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
    retry: 1, // Only retry once to fallback to mock data quickly
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Use mock data if no patients from backend
  const allPatients = patients.length > 0 ? patients : mockPatients;

  // Query for single patient
  const usePatient = (id: string) => {
    return useQuery({
      queryKey: ['patients', id],
      queryFn: () => fetchPatient(id),
      enabled: !!id,
    });
  };

  // Mutation for creating patient
  const { mutate: createPatientMutation, isPending: isCreating } = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente creado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for updating patient
  const { mutate: updatePatientMutation, isPending: isUpdating } = useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente actualizado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for deleting patient
  const { mutate: deletePatientMutation, isPending: isDeleting } = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente eliminado exitosamente');
    },
    onError: handleApiError,
  });

  // Helper function to search patients by name
  const searchPatientsByName = (searchTerm: string) => {
    if (!searchTerm.trim()) return allPatients;
    
    const term = searchTerm.toLowerCase();
    return allPatients.filter(patient => 
      patient.first_name.toLowerCase().includes(term) ||
      patient.last_name.toLowerCase().includes(term) ||
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(term)
    );
  };

  // Helper function to get patient by ID
  const getPatientById = (id: string) => {
    return allPatients.find(patient => patient.id === id);
  };

  return {
    patients: allPatients,
    isLoading,
    error,
    usePatient,
    createPatient: createPatientMutation,
    updatePatient: updatePatientMutation,
    deletePatient: deletePatientMutation,
    isCreating,
    isUpdating,
    isDeleting,
    searchPatientsByName,
    getPatientById,
  };
}
