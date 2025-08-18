'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@/utils/api';
import { handleApiError } from '@/utils/api-helpers';
import toast from 'react-hot-toast';

// --- Type Definitions ---
export interface Business {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessPayload {
  name: string;
  owner_id: string;
}

export interface UpdateBusinessPayload {
  name?: string;
}

// --- API Functions ---
const fetchBusinesses = async (): Promise<Business[]> => {
  const res = await customFetch('/businesses/');
  if (!res.ok) {
    throw new Error('Failed to fetch businesses');
  }
  return res.json();
};

const fetchBusiness = async (id: string): Promise<Business> => {
  const res = await customFetch(`/businesses/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch business');
  }
  return res.json();
};

const createBusiness = async (payload: CreateBusinessPayload): Promise<Business> => {
  const res = await customFetch('/businesses/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create business');
  }
  return res.json();
};

const updateBusiness = async ({ id, payload }: { id: string; payload: UpdateBusinessPayload }): Promise<Business> => {
  const res = await customFetch(`/businesses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to update business');
  }
  return res.json();
};

const deleteBusiness = async (id: string): Promise<void> => {
  const res = await customFetch(`/businesses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete business');
  }
};

// --- Main Hook ---
export function useBusinesses() {
  const queryClient = useQueryClient();

  // Query for all businesses
  const { data: businesses = [], isLoading, error } = useQuery({
    queryKey: ['businesses'],
    queryFn: fetchBusinesses,
    retry: 1,
    onError: () => {
      // Silently handle error to use mock data
    },
  });

  // Query for single business
  const useBusiness = (id: string) => {
    return useQuery({
      queryKey: ['businesses', id],
      queryFn: () => fetchBusiness(id),
      enabled: !!id,
    });
  };

  // Mutation for creating business
  const { mutate: createBusinessMutation, isPending: isCreating } = useMutation({
    mutationFn: createBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Negocio creado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for updating business
  const { mutate: updateBusinessMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Negocio actualizado exitosamente');
    },
    onError: handleApiError,
  });

  // Mutation for deleting business
  const { mutate: deleteBusinessMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Negocio eliminado exitosamente');
    },
    onError: handleApiError,
  });

  // Helper function to get business by ID
  const getBusinessById = (id: string) => {
    return businesses.find(business => business.id === id);
  };

  // Helper function to get businesses by owner
  const getBusinessesByOwner = (ownerId: string) => {
    return businesses.filter(business => business.owner_id === ownerId);
  };

  return {
    businesses,
    isLoading,
    error,
    useBusiness,
    createBusiness: createBusinessMutation,
    updateBusiness: updateBusinessMutation,
    deleteBusiness: deleteBusinessMutation,
    isCreating,
    isUpdating,
    isDeleting,
    getBusinessById,
    getBusinessesByOwner,
  };
}
